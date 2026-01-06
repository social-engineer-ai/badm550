import enum
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum, DateTime, Date, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    TA = "ta"
    STUDENT = "student"

class ProjectType(str, enum.Enum):
    UNSTRUCTURED = "unstructured"
    STRUCTURED = "structured"
    SIMULATED = "simulated"

class TeamRole(str, enum.Enum):
    MEMBER = "member"
    LEAD = "lead"

# Association table for Team Memberships
class TeamMembership(Base):
    __tablename__ = "team_memberships"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    team_id = Column(Integer, ForeignKey("teams.id"))
    role = Column(Enum(TeamRole), default=TeamRole.MEMBER)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("StudentProfile", back_populates="team_memberships")
    team = relationship("Team", back_populates="memberships")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    must_change_password = Column(Boolean, default=False)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    oauth_token = Column(JSON, nullable=True)

    # Profiles
    admin_profile = relationship("AdminProfile", back_populates="user", uselist=False)
    teacher_profile = relationship("TeacherProfile", back_populates="user", uselist=False)
    ta_profile = relationship("TAProfile", back_populates="user", uselist=False)
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)

class AdminProfile(Base):
    __tablename__ = "admin_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="admin_profile")

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_semesters = Column(JSON) # List of semester IDs
    user = relationship("User", back_populates="teacher_profile")

class TAProfile(Base):
    __tablename__ = "ta_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    teacher_id = Column(Integer, ForeignKey("teacher_profiles.id"))
    assigned_teams = Column(JSON) # List of team IDs
    user = relationship("User", back_populates="ta_profile")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    canvas_id = Column(String, nullable=True)
    
    user = relationship("User", back_populates="student_profile")
    team_memberships = relationship("TeamMembership", back_populates="student")

class Semester(Base):
    __tablename__ = "semesters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # e.g. "Spring 2026"
    start_date = Column(Date)
    end_date = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    projects = relationship("Project", back_populates="semester")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    name = Column(String, nullable=False)
    type = Column(Enum(ProjectType), nullable=False)
    client_name = Column(String)
    description = Column(String)
    data_config = Column(JSON) # Instructions for team-specific data
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    semester = relationship("Semester", back_populates="projects")
    teams = relationship("Team", back_populates="project")
    weeks = relationship("Week", back_populates="project")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String, index=True, nullable=False)
    data_slice = Column(JSON) # e.g. {"division": "KC", "quarters": ["Q1", "Q2"]}
    assigned_ta_id = Column(Integer, ForeignKey("ta_profiles.id"), nullable=True)
    health_status = Column(String, default="green") # green, yellow, red
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    project = relationship("Project", back_populates="teams")
    memberships = relationship("TeamMembership", back_populates="team")

