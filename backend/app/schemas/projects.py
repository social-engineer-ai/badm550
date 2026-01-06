from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"


class ResourceType(str, Enum):
    VIDEO_YOUTUBE = "video_youtube"
    VIDEO_MEDIASPACE = "video_mediaspace"
    NOTEBOOK_COLAB = "notebook_colab"
    DOCUMENT = "document"
    DATASET = "dataset"
    LINK = "link"


# Resource schemas
class ProjectResourceBase(BaseModel):
    title: str
    resource_type: ResourceType
    url: str
    description: Optional[str] = None
    display_order: Optional[int] = 0


class ProjectResourceCreate(ProjectResourceBase):
    pass


class ProjectResourceResponse(ProjectResourceBase):
    id: int
    project_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Milestone schemas
class DeliverableItem(BaseModel):
    name: str
    description: str
    submission_type: str  # "link", "file", "notebook"
    points: Optional[int] = None


class MilestoneResourceItem(BaseModel):
    title: str
    type: str
    url: str
    description: Optional[str] = None


class ProjectMilestoneBase(BaseModel):
    week_number: int
    title: str
    theme: Optional[str] = None
    description: Optional[str] = None
    deliverables: Optional[List[DeliverableItem]] = []
    resources: Optional[List[MilestoneResourceItem]] = []
    guidance_notes: Optional[str] = None
    due_date: Optional[datetime] = None


class ProjectMilestoneCreate(ProjectMilestoneBase):
    pass


class ProjectMilestoneUpdate(BaseModel):
    title: Optional[str] = None
    theme: Optional[str] = None
    description: Optional[str] = None
    deliverables: Optional[List[DeliverableItem]] = None
    resources: Optional[List[MilestoneResourceItem]] = None
    guidance_notes: Optional[str] = None
    due_date: Optional[datetime] = None


class ProjectMilestoneResponse(ProjectMilestoneBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Project schemas
class ProjectModuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    client_name: Optional[str] = None
    semester_id: Optional[int] = None
    status: Optional[ProjectStatus] = ProjectStatus.DRAFT


class ProjectModuleCreate(ProjectModuleBase):
    pass


class ProjectModuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    client_name: Optional[str] = None
    status: Optional[ProjectStatus] = None


class ProjectModuleResponse(ProjectModuleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    milestones: List[ProjectMilestoneResponse] = []
    resources: List[ProjectResourceResponse] = []

    class Config:
        from_attributes = True


class ProjectModuleListResponse(ProjectModuleBase):
    id: int
    created_at: datetime
    milestone_count: Optional[int] = 0

    class Config:
        from_attributes = True


# Submission schemas
class ProjectSubmissionCreate(BaseModel):
    submission_type: str
    submission_url: Optional[str] = None
    notes: Optional[str] = None


class ProjectSubmissionResponse(BaseModel):
    id: int
    milestone_id: int
    team_id: int
    submission_type: str
    submission_url: Optional[str]
    notes: Optional[str]
    status: str
    ai_feedback: Optional[str]
    instructor_feedback: Optional[str]
    score: Optional[int]
    submitted_at: datetime
    reviewed_at: Optional[datetime]

    class Config:
        from_attributes = True


# Team assignment
class TeamProjectAssignmentCreate(BaseModel):
    team_id: int
    project_id: int
