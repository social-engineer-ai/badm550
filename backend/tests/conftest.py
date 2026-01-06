"""
Test fixtures and configuration for BADM 550 API tests.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import Base, get_db
from app.models.core import User, UserRole, StudentProfile, TeacherProfile, Team, Project, Semester, TeamMembership, ProjectType
from app.models.features import Week, Alert, AlertPriority, Submission, PulseResponse, EmailDraft, Grade
from app.utils.auth import get_password_hash, create_access_token

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create a test client with database override."""
    # Import app here to avoid circular imports
    from main import app

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def teacher_user(db) -> User:
    """Create a teacher user for testing."""
    user = User(
        email="teacher@illinois.edu",
        hashed_password=get_password_hash("testpass123"),
        first_name="Test",
        last_name="Teacher",
        role=UserRole.TEACHER,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create teacher profile
    profile = TeacherProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    return user


@pytest.fixture
def student_user(db) -> User:
    """Create a student user for testing."""
    user = User(
        email="student@illinois.edu",
        hashed_password=get_password_hash("testpass123"),
        first_name="Test",
        last_name="Student",
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
    db.refresh(profile)

    return user


@pytest.fixture
def teacher_token(teacher_user) -> str:
    """Generate JWT token for teacher."""
    return create_access_token(subject=teacher_user.email)


@pytest.fixture
def student_token(student_user) -> str:
    """Generate JWT token for student."""
    return create_access_token(subject=student_user.email)


@pytest.fixture
def auth_headers_teacher(teacher_token) -> dict:
    """Authorization headers for teacher."""
    return {"Authorization": f"Bearer {teacher_token}"}


@pytest.fixture
def auth_headers_student(student_token) -> dict:
    """Authorization headers for student."""
    return {"Authorization": f"Bearer {student_token}"}


@pytest.fixture
def semester(db) -> Semester:
    """Create a test semester."""
    from datetime import date
    semester = Semester(
        name="Spring 2026",
        start_date=date(2026, 1, 13),
        end_date=date(2026, 5, 15),
        is_active=True
    )
    db.add(semester)
    db.commit()
    db.refresh(semester)
    return semester


@pytest.fixture
def project(db, semester) -> Project:
    """Create a test project."""
    project = Project(
        semester_id=semester.id,
        name="AWG Price Gap Analysis",
        type=ProjectType.STRUCTURED,
        client_name="AWG",
        description="Price gap analysis project"
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@pytest.fixture
def team(db, project) -> Team:
    """Create a test team."""
    team = Team(
        project_id=project.id,
        name="AWG-Team-1",
        data_slice={"division": "KC", "quarters": ["Q1", "Q2"]},
        health_status="green"
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return team


@pytest.fixture
def student_with_team(db, student_user, team) -> User:
    """Create a student with team membership."""
    student_profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == student_user.id
    ).first()

    membership = TeamMembership(
        student_id=student_profile.id,
        team_id=team.id
    )
    db.add(membership)
    db.commit()

    return student_user


@pytest.fixture
def week(db, project) -> Week:
    """Create a test week."""
    week = Week(
        project_id=project.id,
        week_number=1,
        title="Project Kickoff",
        overview="Introduction to the project",
        objectives=["Understand project goals", "Explore data"],
        validation_rules={"required_columns": ["price_gap"]}
    )
    db.add(week)
    db.commit()
    db.refresh(week)
    return week


@pytest.fixture
def alert(db, team) -> Alert:
    """Create a test alert."""
    alert = Alert(
        team_id=team.id,
        type="discrepancy",
        message="Test alert message",
        priority=AlertPriority.HIGH,
        is_resolved=False
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@pytest.fixture
def email_draft(db) -> EmailDraft:
    """Create a test email draft."""
    draft = EmailDraft(
        recipient_email="student@illinois.edu",
        subject="Test Subject",
        body="Test email body",
        is_sent=False
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft
