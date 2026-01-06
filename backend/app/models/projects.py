from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum


class ProjectStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"


class ResourceType(str, enum.Enum):
    VIDEO_YOUTUBE = "video_youtube"
    VIDEO_MEDIASPACE = "video_mediaspace"
    NOTEBOOK_COLAB = "notebook_colab"
    DOCUMENT = "document"
    DATASET = "dataset"
    LINK = "link"


class ProjectModule(Base):
    __tablename__ = "project_modules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # "AWG Pricing Analysis"
    description = Column(Text)  # Project overview
    client_name = Column(String(255))  # "Associated Wholesale Grocers"
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    semester = relationship("Semester", back_populates="project_modules")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")
    resources = relationship("ProjectResource", back_populates="project", cascade="all, delete-orphan")
    team_assignments = relationship("TeamProjectAssignment", back_populates="project")


class ProjectMilestone(Base):
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("project_modules.id"), nullable=False)
    week_number = Column(Integer, nullable=False)  # 1, 2, 3...
    title = Column(String(255), nullable=False)  # "Data Exploration & Quality Assessment"
    theme = Column(String(255))  # "Understanding the Data"
    description = Column(Text)  # Detailed instructions

    # JSON fields for flexible content
    deliverables = Column(JSON)  # [{name, description, submission_type, points}]
    resources = Column(JSON)  # [{title, type, url, description}] - week-specific resources
    guidance_notes = Column(Text)  # Instructor hints/tips

    due_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    project = relationship("ProjectModule", back_populates="milestones")
    submissions = relationship("ProjectSubmission", back_populates="milestone")


class ProjectResource(Base):
    """Project-level resources (available throughout the project)"""
    __tablename__ = "project_resources"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("project_modules.id"), nullable=False)
    title = Column(String(255), nullable=False)
    resource_type = Column(Enum(ResourceType), nullable=False)
    url = Column(String(1024), nullable=False)
    description = Column(Text)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    project = relationship("ProjectModule", back_populates="resources")


class TeamProjectAssignment(Base):
    """Links teams to projects"""
    __tablename__ = "team_project_assignments"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("project_modules.id"), nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    team = relationship("Team", back_populates="project_assignments")
    project = relationship("ProjectModule", back_populates="team_assignments")


class ProjectSubmission(Base):
    """Student/team submissions for project milestones"""
    __tablename__ = "project_submissions"

    id = Column(Integer, primary_key=True, index=True)
    milestone_id = Column(Integer, ForeignKey("project_milestones.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Submission content
    submission_type = Column(String(50))  # "link", "file", "notebook"
    submission_url = Column(String(1024))  # For links/notebooks
    submission_file = Column(String(1024))  # For uploaded files
    notes = Column(Text)  # Student comments

    # Status and feedback
    status = Column(String(50), default="submitted")  # submitted, reviewed, graded
    ai_feedback = Column(Text)  # Auto-generated feedback
    instructor_feedback = Column(Text)
    score = Column(Integer)

    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))

    # Relationships
    milestone = relationship("ProjectMilestone", back_populates="submissions")
    team = relationship("Team")
    submitter = relationship("User")
