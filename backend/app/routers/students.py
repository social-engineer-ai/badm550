from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.features import Week, Submission, EmailDraft
from ..models.core import User, StudentProfile, UserRole, TeamMembership
from ..dependencies import get_current_user, RoleChecker
from pydantic import BaseModel

router = APIRouter(
    prefix="/students", 
    tags=["students"],
    dependencies=[Depends(RoleChecker([UserRole.STUDENT, UserRole.ADMIN]))]
)

class MessageIn(BaseModel):
    subject: str
    body: str

@router.get("/weeks")
async def get_weeks(db: Session = Depends(get_db)):
    return db.query(Week).order_by(Week.week_number.asc()).all()

@router.get("/me/team")
async def get_my_team(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Getting the first team membership for now
    membership = db.query(TeamMembership).filter(TeamMembership.student_id == student.id).first()
    if not membership:
        raise HTTPException(status_code=404, detail="Team membership not found")
        
    return {
        "team_name": membership.team.name,
        "project_type": membership.team.project.type,
        "role": membership.role
    }

@router.post("/submit")
async def submit_assignment(
    data: dict, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..services.ai_service import ai_service
    from ..models.features import Week, Submission, Alert, AlertPriority
    
    # 1. Get student profile
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    # 2. Get week rules
    week = db.query(Week).filter(Week.week_number == data["week_number"]).first()
    if not week:
        raise HTTPException(status_code=404, detail="Course week not found")

    # 3. Simulate content extraction from file
    # In a real scenario, we'd use a PDF/CSV parser here
    mock_extracted_text = (
        "Project: Global Retail Analysis. Division: KC. "
        "Calculated Price Gap: 12.5%. Revenue Aggregation: $4.5M. "
        "Observations: Outliers detected in pricing column but not removed."
    )
    
    # 4. Use AI to evaluate
    eval_rules = week.validation_rules or {"required_columns": ["price_gap", "revenue"], "min_confidence": 3}
    ai_result = await ai_service.evaluate_submission(mock_extracted_text, eval_rules)
    
    # 5. Create Submission record
    # Find team
    membership = db.query(TeamMembership).filter(TeamMembership.student_id == student.id).first()
    
    new_submission = Submission(
        team_id=membership.team_id if membership else None,
        week_id=week.id,
        submitted_by_id=current_user.id,
        file_url=data.get("filename", "unknown.pdf"),
        findings_summary=mock_extracted_text[:200], # snippet
        auto_eval_result=ai_result,
        status="flagged" if ai_result.get("status") == "flagged" else "pending"
    )
    db.add(new_submission)
    
    # 6. If flagged, create a high priority alert for the instructor
    if ai_result.get("status") == "flagged":
        new_alert = Alert(
            team_id=membership.team_id if membership else None,
            type="discrepancy",
            message=f"Auto-eval flagged submission for {current_user.email} in Week {week.week_number}.",
            ai_hypothesis=f"Student might have missed the following: {', '.join(ai_result.get('flags', []))}",
            priority=AlertPriority.HIGH
        )
        db.add(new_alert)

    db.commit()
    return {"message": "Submission received", "auto_eval_result": ai_result}

@router.post("/pulse")
async def record_pulse(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.features import PulseResponse, PulseCheck, Alert, AlertPriority
    
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Find active pulse check for semester or just create a record
    new_response = PulseResponse(
        student_id=student.id,
        sentiment=data["sentiment"],
        feedback=data.get("feedback", ""),
    )
    db.add(new_response)

    # If frowning, create an alert
    if data["sentiment"] == '🙁':
        membership = db.query(TeamMembership).filter(TeamMembership.student_id == student.id).first()
        new_alert = Alert(
            team_id=membership.team_id if membership else None,
            type="sentiment",
            message=f"Negative sentiment reported by {current_user.email}.",
            priority=AlertPriority.LOW
        )
        db.add(new_alert)
        
    db.commit()
    return {"message": "Pulse recorded"}

@router.post("/contact")
async def contact_professor(


    msg: MessageIn, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..services.ai_service import ai_service
    
    # Generate a real draft using Claude
    ai_draft_content = await ai_service.draft_email(
        student_query=msg.body,
        context=f"This is for a student {current_user.first_name} {current_user.last_name} in BADM 550 MSBA Business Practicum course."
    )
    
    # Create an email draft from student message
    new_draft = EmailDraft(
        recipient_email="prof@illinois.edu", # Instructor
        subject=f"RE: {msg.subject} (From: {current_user.email})",
        body=ai_draft_content,
        context_data={"original_message": msg.body, "student_id": current_user.id}
    )
    db.add(new_draft)
    db.commit()
    return {"message": "Message sent to professor. AI has drafted a response for review."}

@router.get("/me/collaboration")
async def get_team_collaboration(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    from ..models.core import Team, TeamMembership, StudentProfile, User
    from ..models.features import Submission, MeetingRequest
    from sqlalchemy.orm import joinedload
    
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    membership = db.query(TeamMembership).filter(TeamMembership.student_id == student.id).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="No team found for student")
        
    team = db.query(Team).options(
        joinedload(Team.memberships).joinedload(TeamMembership.student).joinedload(StudentProfile.user)
    ).filter(Team.id == membership.team_id).first()
    
    submissions = db.query(Submission).filter(Submission.team_id == team.id).order_by(Submission.created_at.desc()).all()
    meetings = db.query(MeetingRequest).filter(MeetingRequest.team_id == team.id).all()
    
    return {
        "team": team,
        "submissions": submissions,
        "meetings": meetings
    }

@router.post("/frustration")
async def report_frustration(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.features import FrustrationReport, Alert, AlertPriority
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    new_report = FrustrationReport(
        student_id=student.id,
        category=data["category"],
        impact_level=data["impact_level"],
        message=data["message"],
        is_anonymous=data.get("is_anonymous", False)
    )
    db.add(new_report)
    
    # Critical friction triggers a high-priority alert
    if data["impact_level"] == "critical":
        membership = db.query(TeamMembership).filter(TeamMembership.student_id == student.id).first()
        new_alert = Alert(
            team_id=membership.team_id if membership else None,
            type="conflict",
            message=f"CRITICAL FRICTION REPORTED: A student has reported a critical issue in the {data['category']} category.",
            priority=AlertPriority.HIGH
        )
        db.add(new_alert)
        
    db.commit()
    return {"status": "success", "message": "Report received. The instructor team will review this confidentially."}

@router.post("/meeting-request")
async def request_meeting(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.features import MeetingRequest, Alert, AlertPriority
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    membership = db.query(TeamMembership).filter(TeamMembership.student_id == student.id).first()
    
    new_request = MeetingRequest(
        student_id=student.id,
        team_id=membership.team_id if membership else None,
        topic=data["topic"],
        description=data["description"],
        duration=data.get("duration", 30),
        preferred_slots=data.get("preferred_slots", [])
    )
    db.add(new_request)
    
    # Alert instructor about meeting request
    new_alert = Alert(
        team_id=membership.team_id if membership else None,
        type="meeting_requested",
        message=f"Meeting Request: {data['topic']} from {current_user.first_name}.",
        priority=AlertPriority.LOW
    )
    db.add(new_alert)
    
    db.commit()
    return {"status": "success", "message": "Meeting request transmitted."}

@router.get("/me/grades")
async def get_my_grades(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    from ..models.features import Grade
    from sqlalchemy.orm import joinedload
    student = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
        
    grades = db.query(Grade).options(joinedload(Grade.week)).filter(Grade.student_id == student.id).all()
    return grades
