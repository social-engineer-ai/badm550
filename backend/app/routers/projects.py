from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..dependencies import get_current_user, RoleChecker
from ..models.core import User, UserRole, TeamMembership
from ..models.projects import (
    ProjectModule, ProjectMilestone, ProjectResource,
    TeamProjectAssignment, ProjectSubmission
)
from ..schemas.projects import (
    ProjectModuleCreate, ProjectModuleUpdate, ProjectModuleResponse, ProjectModuleListResponse,
    ProjectMilestoneCreate, ProjectMilestoneUpdate, ProjectMilestoneResponse,
    ProjectResourceCreate, ProjectResourceResponse,
    ProjectSubmissionCreate, ProjectSubmissionResponse,
    TeamProjectAssignmentCreate
)

router = APIRouter()

# Role checkers
allow_instructor = RoleChecker([UserRole.ADMIN, UserRole.TEACHER])
allow_staff = RoleChecker([UserRole.ADMIN, UserRole.TEACHER, UserRole.TA])

# ============== PROJECT CRUD ==============

@router.get("/", response_model=List[ProjectModuleListResponse])
def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all projects (filtered by role)"""
    projects = db.query(ProjectModule).all()
    # Add milestone count
    result = []
    for project in projects:
        project_dict = {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "client_name": project.client_name,
            "semester_id": project.semester_id,
            "status": project.status,
            "created_at": project.created_at,
            "milestone_count": len(project.milestones) if project.milestones else 0
        }
        result.append(project_dict)
    return result


@router.get("/{project_id}", response_model=ProjectModuleResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get project with all milestones and resources"""
    project = db.query(ProjectModule).filter(ProjectModule.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/", response_model=ProjectModuleResponse)
def create_project(
    project: ProjectModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Create a new project (instructor only)"""
    db_project = ProjectModule(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.put("/{project_id}", response_model=ProjectModuleResponse)
def update_project(
    project_id: int,
    project: ProjectModuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Update project details"""
    db_project = db.query(ProjectModule).filter(ProjectModule.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    for key, value in project.model_dump(exclude_unset=True).items():
        setattr(db_project, key, value)

    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(RoleChecker([UserRole.ADMIN]))
):
    """Delete a project (admin only)"""
    db_project = db.query(ProjectModule).filter(ProjectModule.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted"}


# ============== MILESTONES ==============

@router.get("/{project_id}/milestones", response_model=List[ProjectMilestoneResponse])
def list_milestones(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all milestones for a project"""
    milestones = db.query(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id
    ).order_by(ProjectMilestone.week_number).all()
    return milestones


@router.get("/{project_id}/milestones/{week_number}", response_model=ProjectMilestoneResponse)
def get_milestone(
    project_id: int,
    week_number: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific milestone by week number"""
    milestone = db.query(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id,
        ProjectMilestone.week_number == week_number
    ).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return milestone


@router.post("/{project_id}/milestones", response_model=ProjectMilestoneResponse)
def create_milestone(
    project_id: int,
    milestone: ProjectMilestoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Create a new milestone"""
    # Check project exists
    project = db.query(ProjectModule).filter(ProjectModule.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    milestone_data = milestone.model_dump()
    # Convert pydantic models to dicts for JSON columns
    if milestone_data.get('deliverables'):
        milestone_data['deliverables'] = [d.model_dump() if hasattr(d, 'model_dump') else d for d in milestone_data['deliverables']]
    if milestone_data.get('resources'):
        milestone_data['resources'] = [r.model_dump() if hasattr(r, 'model_dump') else r for r in milestone_data['resources']]

    db_milestone = ProjectMilestone(project_id=project_id, **milestone_data)
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone


@router.put("/{project_id}/milestones/{week_number}", response_model=ProjectMilestoneResponse)
def update_milestone(
    project_id: int,
    week_number: int,
    milestone: ProjectMilestoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Update a milestone"""
    db_milestone = db.query(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id,
        ProjectMilestone.week_number == week_number
    ).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    update_data = milestone.model_dump(exclude_unset=True)
    # Convert pydantic models to dicts for JSON columns
    if 'deliverables' in update_data and update_data['deliverables']:
        update_data['deliverables'] = [d.model_dump() if hasattr(d, 'model_dump') else d for d in update_data['deliverables']]
    if 'resources' in update_data and update_data['resources']:
        update_data['resources'] = [r.model_dump() if hasattr(r, 'model_dump') else r for r in update_data['resources']]

    for key, value in update_data.items():
        setattr(db_milestone, key, value)

    db.commit()
    db.refresh(db_milestone)
    return db_milestone


@router.delete("/{project_id}/milestones/{week_number}")
def delete_milestone(
    project_id: int,
    week_number: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Delete a milestone"""
    db_milestone = db.query(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id,
        ProjectMilestone.week_number == week_number
    ).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    db.delete(db_milestone)
    db.commit()
    return {"message": "Milestone deleted"}


# ============== RESOURCES ==============

@router.post("/{project_id}/resources", response_model=ProjectResourceResponse)
def add_resource(
    project_id: int,
    resource: ProjectResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Add a project-level resource"""
    db_resource = ProjectResource(project_id=project_id, **resource.model_dump())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource


@router.delete("/{project_id}/resources/{resource_id}")
def delete_resource(
    project_id: int,
    resource_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Delete a resource"""
    db_resource = db.query(ProjectResource).filter(
        ProjectResource.id == resource_id,
        ProjectResource.project_id == project_id
    ).first()
    if not db_resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    db.delete(db_resource)
    db.commit()
    return {"message": "Resource deleted"}


# ============== SUBMISSIONS ==============

@router.post("/{project_id}/milestones/{week_number}/submit", response_model=ProjectSubmissionResponse)
def submit_deliverable(
    project_id: int,
    week_number: int,
    submission: ProjectSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a deliverable for a milestone"""
    # Get milestone
    milestone = db.query(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id,
        ProjectMilestone.week_number == week_number
    ).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Get user's team
    team_id = None
    if current_user.student_profile:
        membership = db.query(TeamMembership).filter(
            TeamMembership.student_id == current_user.student_profile.id
        ).first()
        if membership:
            team_id = membership.team_id

    if not team_id:
        # For testing or instructors, use a default team
        team_id = 1

    db_submission = ProjectSubmission(
        milestone_id=milestone.id,
        team_id=team_id,
        submitted_by=current_user.id,
        **submission.model_dump()
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)

    return db_submission


@router.get("/{project_id}/submissions", response_model=List[ProjectSubmissionResponse])
def list_submissions(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_staff)
):
    """List all submissions for a project (instructor view)"""
    submissions = db.query(ProjectSubmission).join(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id
    ).all()
    return submissions


@router.get("/{project_id}/my-submissions", response_model=List[ProjectSubmissionResponse])
def list_my_submissions(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List current user's team submissions for a project"""
    team_id = None
    if current_user.student_profile:
        membership = db.query(TeamMembership).filter(
            TeamMembership.student_id == current_user.student_profile.id
        ).first()
        if membership:
            team_id = membership.team_id

    if not team_id:
        return []

    submissions = db.query(ProjectSubmission).join(ProjectMilestone).filter(
        ProjectMilestone.project_id == project_id,
        ProjectSubmission.team_id == team_id
    ).all()
    return submissions


# ============== TEAM ASSIGNMENTS ==============

@router.post("/{project_id}/assign-team")
def assign_team(
    project_id: int,
    assignment: TeamProjectAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Assign a team to a project"""
    # Check if already assigned
    existing = db.query(TeamProjectAssignment).filter(
        TeamProjectAssignment.project_id == project_id,
        TeamProjectAssignment.team_id == assignment.team_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Team already assigned to this project")

    db_assignment = TeamProjectAssignment(
        project_id=project_id,
        team_id=assignment.team_id
    )
    db.add(db_assignment)
    db.commit()
    return {"message": "Team assigned to project"}


@router.delete("/{project_id}/assign-team/{team_id}")
def unassign_team(
    project_id: int,
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(allow_instructor)
):
    """Remove a team from a project"""
    assignment = db.query(TeamProjectAssignment).filter(
        TeamProjectAssignment.project_id == project_id,
        TeamProjectAssignment.team_id == team_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    db.delete(assignment)
    db.commit()
    return {"message": "Team unassigned from project"}


@router.get("/{project_id}/teams")
def list_assigned_teams(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List teams assigned to a project"""
    assignments = db.query(TeamProjectAssignment).filter(
        TeamProjectAssignment.project_id == project_id
    ).all()
    return [{"team_id": a.team_id, "assigned_at": a.assigned_at} for a in assignments]
