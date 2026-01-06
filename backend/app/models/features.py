from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Enum, DateTime, JSON, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class SubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    FLAGGED = "flagged"
    APPROVED = "approved"

class AlertPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class MeetingStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DECLINED = "declined"
    COMPLETED = "completed"

class Week(Base):
    __tablename__ = "weeks"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    week_number = Column(Integer, index=True)
    title = Column(String, nullable=False)
    overview = Column(Text)
    objectives = Column(JSON) # List of strings
    agenda = Column(JSON) # List of dicts {step, output}
    resources = Column(JSON) # List of dicts {name, url}
    deliverable_spec = Column(JSON) # Instructions
    solution_file = Column(String) # Path
    validation_rules = Column(JSON)
    expected_findings = Column(JSON)
    due_date = Column(DateTime(timezone=True))

    project = relationship("Project", back_populates="weeks")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    week_id = Column(Integer, ForeignKey("weeks.id"))
    submitted_by_id = Column(Integer, ForeignKey("users.id"))
    file_url = Column(String)
    findings_summary = Column(Text)
    self_assessment = Column(Integer) # 1-5 confidence
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.PENDING)
    auto_eval_result = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    team = relationship("Team")
    week = relationship("Week")
    submitted_by = relationship("User")

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    type = Column(String) # non_response, discrepancy, sentiment, conflict, etc.
    message = Column(Text)
    ai_hypothesis = Column(Text)
    priority = Column(Enum(AlertPriority), default=AlertPriority.MEDIUM)
    is_resolved = Column(Boolean, default=False)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True) # TA or Teacher
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    team = relationship("Team")
    assigned_to = relationship("User")

class PulseCheck(Base):
    __tablename__ = "pulse_checks"
    id = Column(Integer, primary_key=True, index=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    type = Column(String) # "tuesday", "friday"
    scheduled_for = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)

class PulseResponse(Base):
    __tablename__ = "pulse_responses"
    id = Column(Integer, primary_key=True, index=True)
    pulse_check_id = Column(Integer, ForeignKey("pulse_checks.id"))
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    sentiment = Column(String) # smiling, neutral, frowning
    feedback = Column(Text)
    is_confidential = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MeetingRequest(Base):
    __tablename__ = "meeting_requests"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True) # If team meeting
    topic = Column(String)
    description = Column(Text)
    duration = Column(Integer) # minutes
    preferred_slots = Column(JSON) # List of datetimes
    status = Column(Enum(MeetingStatus), default=MeetingStatus.PENDING)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FrustrationReport(Base):
    __tablename__ = "frustration_reports"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    category = Column(String) # team, project, client, course, support
    impact_level = Column(String) # affecting me, affecting team, critical
    message = Column(Text)
    is_anonymous = Column(Boolean, default=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EmailDraft(Base):
    __tablename__ = "email_drafts"
    id = Column(Integer, primary_key=True, index=True)
    recipient_email = Column(String)
    subject = Column(String)
    body = Column(Text)
    cluster_id = Column(String, nullable=True) # For grouping similar questions
    context_data = Column(JSON)
    is_sent = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Grade(Base):
    __tablename__ = "grades"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    week_id = Column(Integer, ForeignKey("weeks.id"))
    score = Column(Integer)
    feedback = Column(Text)
    grader_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    student = relationship("StudentProfile")
    week = relationship("Week")
    grader = relationship("User")
