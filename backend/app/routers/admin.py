"""
Admin API endpoints for managing projects, teams, students, and TAs.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models.core import (
    User, UserRole, Team, Project, Semester, StudentProfile,
    TeacherProfile, TAProfile, TeamMembership, ProjectType, TeamRole
)
from ..models.features import Week
from ..dependencies import RoleChecker, get_current_user
from ..utils.auth import get_password_hash

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(RoleChecker([UserRole.TEACHER, UserRole.ADMIN]))]
)

# ============== SCHEMAS ==============

class SemesterCreate(BaseModel):
    name: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str
    semester_id: int
    type: str = "structured"
    client_name: Optional[str] = None
    description: Optional[str] = None

class TeamCreate(BaseModel):
    name: str
    project_id: int
    data_slice: Optional[dict] = None

class StudentCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str = "changeme123"

class TACreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str = "changeme123"

class TeamAssignment(BaseModel):
    student_id: int
    team_id: int
    role: str = "member"

# ============== SEMESTERS ==============

@router.get("/semesters")
async def list_semesters(db: Session = Depends(get_db)):
    return db.query(Semester).order_by(Semester.id.desc()).all()

@router.post("/semesters")
async def create_semester(data: SemesterCreate, db: Session = Depends(get_db)):
    from datetime import datetime
    semester = Semester(
        name=data.name,
        start_date=datetime.strptime(data.start_date, "%Y-%m-%d").date() if data.start_date else None,
        end_date=datetime.strptime(data.end_date, "%Y-%m-%d").date() if data.end_date else None,
        is_active=True
    )
    db.add(semester)
    db.commit()
    db.refresh(semester)
    return semester

# ============== PROJECTS ==============

@router.get("/projects")
async def list_projects(db: Session = Depends(get_db)):
    return db.query(Project).options(joinedload(Project.semester)).order_by(Project.id.desc()).all()

@router.post("/projects")
async def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        name=data.name,
        semester_id=data.semester_id,
        type=ProjectType(data.type),
        client_name=data.client_name,
        description=data.description
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"status": "success"}

# ============== TEAMS ==============

@router.get("/teams")
async def list_teams(db: Session = Depends(get_db)):
    return db.query(Team).options(
        joinedload(Team.project),
        joinedload(Team.memberships).joinedload(TeamMembership.student).joinedload(StudentProfile.user)
    ).all()

@router.post("/teams")
async def create_team(data: TeamCreate, db: Session = Depends(get_db)):
    team = Team(
        name=data.name,
        project_id=data.project_id,
        data_slice=data.data_slice,
        health_status="green"
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.put("/teams/{team_id}")
async def update_team(team_id: int, data: dict, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    for key, value in data.items():
        if hasattr(team, key):
            setattr(team, key, value)
    db.commit()
    return team

@router.delete("/teams/{team_id}")
async def delete_team(team_id: int, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    # Remove memberships first
    db.query(TeamMembership).filter(TeamMembership.team_id == team_id).delete()
    db.delete(team)
    db.commit()
    return {"status": "success"}

# ============== STUDENTS ==============

@router.get("/students")
async def list_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.role == UserRole.STUDENT).options(
        joinedload(User.student_profile)
    ).all()

    result = []
    for student in students:
        profile = student.student_profile
        team_membership = None
        if profile:
            membership = db.query(TeamMembership).filter(
                TeamMembership.student_id == profile.id
            ).first()
            if membership:
                team = db.query(Team).filter(Team.id == membership.team_id).first()
                team_membership = {"team_id": team.id, "team_name": team.name} if team else None

        result.append({
            "id": student.id,
            "email": student.email,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "is_active": student.is_active,
            "profile_id": profile.id if profile else None,
            "team": team_membership
        })
    return result

@router.post("/students")
async def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = User(
        email=data.email,
        first_name=data.first_name,
        last_name=data.last_name,
        hashed_password=get_password_hash(data.password),
        role=UserRole.STUDENT,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create student profile
    profile = StudentProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    return {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}

@router.delete("/students/{student_id}")
async def delete_student(student_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == student_id, User.role == UserRole.STUDENT).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    # Remove profile and memberships
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_id).first()
    if profile:
        db.query(TeamMembership).filter(TeamMembership.student_id == profile.id).delete()
        db.delete(profile)

    db.delete(user)
    db.commit()
    return {"status": "success"}

# ============== TEAM ASSIGNMENTS ==============

@router.post("/teams/{team_id}/members")
async def add_student_to_team(team_id: int, data: dict, db: Session = Depends(get_db)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    student_id = data.get("student_id")
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    # Check if already in a team
    existing = db.query(TeamMembership).filter(TeamMembership.student_id == profile.id).first()
    if existing:
        # Remove from old team
        db.delete(existing)

    membership = TeamMembership(
        student_id=profile.id,
        team_id=team_id,
        role=TeamRole(data.get("role", "member"))
    )
    db.add(membership)
    db.commit()
    return {"status": "success"}

@router.delete("/teams/{team_id}/members/{student_id}")
async def remove_student_from_team(team_id: int, student_id: int, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student not found")

    membership = db.query(TeamMembership).filter(
        TeamMembership.team_id == team_id,
        TeamMembership.student_id == profile.id
    ).first()

    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")

    db.delete(membership)
    db.commit()
    return {"status": "success"}

# ============== TAs ==============

@router.get("/tas")
async def list_tas(db: Session = Depends(get_db)):
    tas = db.query(User).filter(User.role == UserRole.TA).all()
    return [{"id": ta.id, "email": ta.email, "first_name": ta.first_name, "last_name": ta.last_name} for ta in tas]

@router.post("/tas")
async def create_ta(data: TACreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user = User(
        email=data.email,
        first_name=data.first_name,
        last_name=data.last_name,
        hashed_password=get_password_hash(data.password),
        role=UserRole.TA,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create TA profile
    profile = TAProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    return {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name}

@router.delete("/tas/{ta_id}")
async def delete_ta(ta_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == ta_id, User.role == UserRole.TA).first()
    if not user:
        raise HTTPException(status_code=404, detail="TA not found")

    profile = db.query(TAProfile).filter(TAProfile.user_id == ta_id).first()
    if profile:
        db.delete(profile)

    db.delete(user)
    db.commit()
    return {"status": "success"}
