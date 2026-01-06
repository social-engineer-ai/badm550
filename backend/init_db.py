from app.database import engine, Base
# Ensure all models are imported so they are registered with Base
from app.models.core import User, Team, StudentProfile, Semester, Project, TeamMembership, AdminProfile, TeacherProfile, TAProfile
from app.models.features import Week, Submission, Alert, EmailDraft, PulseCheck, PulseResponse, MeetingRequest, FrustrationReport, Grade
from app.models.projects import ProjectModule, ProjectMilestone, ProjectResource, TeamProjectAssignment, ProjectSubmission

def init_db():
    print("Initializing Database...")
    Base.metadata.create_all(bind=engine)
    print("Database structure initialized successfully.")

if __name__ == "__main__":
    init_db()
