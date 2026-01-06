from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from ..database import get_db
from ..models.features import Week, Alert, EmailDraft
from ..models.core import Team, UserRole, User, TeamMembership
from ..dependencies import RoleChecker, get_current_user
from pydantic import BaseModel

router = APIRouter(
    prefix="/instructor", 
    tags=["instructor"],
    dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN, UserRole.TA]))]
)

@router.get("/alerts")
async def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.is_resolved == False).order_by(Alert.priority.desc()).all()

@router.get("/drafts")
async def get_drafts(db: Session = Depends(get_db)):
    return db.query(EmailDraft).filter(EmailDraft.is_sent == False).all()

@router.get("/teams/health")
async def get_teams_health(db: Session = Depends(get_db)):
    from ..models.features import PulseResponse, Alert
    from ..models.core import StudentProfile, TeamMembership
    
    teams = db.query(Team).all()
    health_data = []
    
    for team in teams:
        # Get active high-priority alerts for this team
        high_alerts = db.query(Alert).filter(
            Alert.team_id == team.id, 
            Alert.is_resolved == False,
            Alert.priority == 'high'
        ).count()

        # Get recent sentiment
        memberships = db.query(TeamMembership).filter(TeamMembership.team_id == team.id).all()
        student_ids = [m.student_id for m in memberships]
        
        recent_pulses = db.query(PulseResponse).filter(
            PulseResponse.student_id.in_(student_ids) if student_ids else False
        ).order_by(PulseResponse.created_at.desc()).limit(10).all()
        
        # Simple logic: if any high alerts or many neutral/sad pulses, status = orange/red
        status = "green"
        if high_alerts > 0:
            status = "red"
        elif any(p.sentiment in ['😐', '🙁'] for p in recent_pulses):
            status = "yellow"
            
        health_data.append({
            "id": team.id,
            "name": team.name,
            "status": status,
            "alert_count": high_alerts,
            "sentiment": "positive" if not any(p.sentiment == '🙁' for p in recent_pulses) else "strained"
        })
    return health_data


@router.get("/teams")
async def get_teams(db: Session = Depends(get_db)):
    from ..models.core import Team, StudentProfile, TeamMembership, User, Project
    
    query = db.query(Team).options(
        joinedload(Team.project),
        joinedload(Team.memberships).joinedload(TeamMembership.student).joinedload(StudentProfile.user)
    ).all()
    
    return query

@router.get("/teams/{team_id}/audit")
async def audit_team(team_id: int, db: Session = Depends(get_db)):
    from ..models.features import Submission, Alert, PulseResponse, MeetingRequest, FrustrationReport
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    memberships = db.query(TeamMembership).filter(TeamMembership.team_id == team_id).all()
    student_ids = [m.student_id for m in memberships]
    
    submissions = db.query(Submission).filter(Submission.team_id == team_id).order_by(Submission.created_at.desc()).all()
    alerts = db.query(Alert).filter(Alert.team_id == team_id).order_by(Alert.created_at.desc()).all()
    meetings = db.query(MeetingRequest).filter(MeetingRequest.team_id == team_id).all()
    frustrations = db.query(FrustrationReport).filter(FrustrationReport.student_id.in_(student_ids) if student_ids else False).all()
    pulses = db.query(PulseResponse).filter(PulseResponse.student_id.in_(student_ids) if student_ids else False).order_by(PulseResponse.created_at.desc()).limit(15).all()
    
    return {
        "team": team,
        "submissions": submissions,
        "alerts": alerts,
        "meetings": meetings,
        "frustrations": frustrations,
        "pulse_history": pulses
    }

@router.post("/teams/{team_id}/health")
async def update_team_health(team_id: int, status: str, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    team.health_status = status
    db.commit()
    return {"status": "success"}

@router.get("/submissions")
async def get_submissions(db: Session = Depends(get_db)):
    from ..models.features import Submission
    return db.query(Submission).options(
        joinedload(Submission.team),
        joinedload(Submission.week)
    ).all()

@router.post("/submissions/{sub_id}/action")
async def sub_action(sub_id: int, action: str, db: Session = Depends(get_db)):
    from ..models.features import Submission
    sub = db.query(Submission).filter(Submission.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    sub.status = "approved" if action == "approve" else "flagged"
    db.commit()
    return {"status": "success"}

@router.get("/weeks")
async def get_instructor_weeks(db: Session = Depends(get_db)):
    from ..models.features import Week
    return db.query(Week).order_by(Week.week_number).all()

@router.post("/weeks", dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN]))])
async def create_week(data: dict, db: Session = Depends(get_db)):
    from ..models.features import Week
    from ..models.core import Project

    # Get the project_id from data or find default project
    project_id = data.get("project_id")
    if not project_id:
        project = db.query(Project).first()
        if project:
            project_id = project.id

    # Get the next week number
    max_week = db.query(Week).filter(Week.project_id == project_id).order_by(Week.week_number.desc()).first()
    next_week_number = (max_week.week_number + 1) if max_week else 1

    new_week = Week(
        project_id=project_id,
        week_number=data.get("week_number", next_week_number),
        title=data.get("title", f"Week {next_week_number}"),
        overview=data.get("overview", ""),
        deliverable_spec=data.get("deliverable_spec", {})
    )
    db.add(new_week)
    db.commit()
    db.refresh(new_week)

    return new_week

@router.delete("/weeks/{week_id}", dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN]))])
async def delete_week(week_id: int, db: Session = Depends(get_db)):
    from ..models.features import Week
    week = db.query(Week).filter(Week.id == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")

    db.delete(week)
    db.commit()
    return {"status": "success", "message": "Week deleted"}

@router.put("/weeks/{week_id}", dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN]))])
async def update_week(week_id: int, data: dict, db: Session = Depends(get_db)):
    from ..models.features import Week
    week = db.query(Week).filter(Week.id == week_id).first()
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")

    for key, value in data.items():
        if hasattr(week, key):
            setattr(week, key, value)

    db.commit()
    return {"status": "success"}

@router.post("/sync", dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN]))])
async def trigger_sync(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..services.email_service import email_service
    analysis = await email_service.sync_and_process_inbox(db=db, user_id=current_user.id)
    return {"status": "success", "analysis": analysis}

@router.put("/drafts/{draft_id}")
async def update_draft(
    draft_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    from ..models.features import EmailDraft
    draft = db.query(EmailDraft).filter(EmailDraft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    if "subject" in data:
        draft.subject = data["subject"]
    if "body" in data:
        draft.body = data["body"]

    db.commit()
    return {"status": "success", "draft": draft}

@router.post("/drafts/{draft_id}/send")
async def send_draft(
    draft_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..services.email_service import email_service
    from ..models.features import EmailDraft
    from email.mime.text import MIMEText
    from googleapiclient.discovery import build
    import base64

    draft = db.query(EmailDraft).filter(EmailDraft.id == draft_id).first()
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")

    # 1. Authenticate
    if not await email_service.authenticate(db=db, user_id=current_user.id):
        raise HTTPException(status_code=401, detail="Gmail authentication failed")

    # 2. Build MIME message
    message = MIMEText(draft.body)
    message['to'] = draft.recipient_email
    message['subject'] = draft.subject
    
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')

    # 3. Send via Gmail
    try:
        service = build('gmail', 'v1', credentials=email_service.creds)
        service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
        
        draft.is_sent = True
        db.commit()
        return {"status": "success", "message": "Email sent via Gmail API"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.get("/grades")
async def get_gradebook(db: Session = Depends(get_db)):
    from ..models.features import Grade, Week
    from ..models.core import StudentProfile, User
    
    # Return a structured gradebook
    weeks = db.query(Week).order_by(Week.week_number).all()
    students = db.query(StudentProfile).all()
    grades = db.query(Grade).all()
    
    return {
        "weeks": weeks,
        "students": students,
        "grades": grades
    }

@router.post("/grades")
async def update_grade(
    data: dict, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..models.features import Grade
    
    grade = db.query(Grade).filter(
        Grade.student_id == data["student_id"],
        Grade.week_id == data["week_id"]
    ).first()
    
    if grade:
        grade.score = data["score"]
        grade.feedback = data.get("feedback", "")
        grade.grader_id = current_user.id
    else:
        grade = Grade(
            student_id=data["student_id"],
            week_id=data["week_id"],
            score=data["score"],
            feedback=data.get("feedback", ""),
            grader_id=current_user.id
        )
        db.add(grade)
        
    db.commit()
    return {"status": "success", "grade": grade}

@router.post("/pulse-blast", dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN]))])
async def trigger_pulse_blast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from ..services.email_service import email_service
    result = await email_service.send_bulk_pulse_invitation(db=db, instructor_id=current_user.id)
    return {"status": "success", "result": result}
