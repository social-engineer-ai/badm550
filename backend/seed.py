from datetime import datetime, date, timedelta
from app.database import SessionLocal
from app.models.core import User, Team, Semester, Project, ProjectType, StudentProfile, TeamMembership, UserRole, TeamRole
from app.models.features import Alert, EmailDraft, AlertPriority, Week, SubmissionStatus
from app.models.projects import ProjectModule  # Import to register relationships
from app.utils.auth import get_password_hash

def seed_data():
    db = SessionLocal()
    try:
        # 1. Create Semester
        semester = db.query(Semester).filter(Semester.name == "Spring 2026").first()
        if not semester:
            semester = Semester(
                name="Spring 2026",
                start_date=date(2026, 1, 15),
                end_date=date(2026, 5, 15),
                is_active=True
            )
            db.add(semester)
            db.commit()
            db.refresh(semester)

        # 2. Create Project
        project = db.query(Project).filter(Project.name == "Global Retail Analysis").first()
        if not project:
            project = Project(
                semester_id=semester.id,
                name="Global Retail Analysis",
                type=ProjectType.STRUCTURED,
                client_name="Project Retail Inc.",
                description="Analysis of global retail trends and price gap optimization."
            )
            db.add(project)
            db.commit()
            db.refresh(project)

        # 3. Create Users (Teacher and Student)
        teacher = db.query(User).filter(User.email == "prof@illinois.edu").first()
        if not teacher:
            teacher = User(
                email="prof@illinois.edu",
                hashed_password=get_password_hash("password123"),
                first_name="Prof",
                last_name="Instructor",
                role=UserRole.TEACHER
            )
            db.add(teacher)

        # Create TA
        ta_user = db.query(User).filter(User.email == "ta@illinois.edu").first()
        if not ta_user:
            ta_user = User(
                email="ta@illinois.edu",
                hashed_password=get_password_hash("password123"),
                first_name="Alex",
                last_name="Assistant",
                role=UserRole.TA
            )
            db.add(ta_user)
            db.commit()

        student_user = db.query(User).filter(User.email == "student@illinois.edu").first()
        if not student_user:
            student_user = User(
                email="student@illinois.edu",
                hashed_password=get_password_hash("password123"),
                first_name="Sam",
                last_name="Student",
                role=UserRole.STUDENT
            )
            db.add(student_user)
            db.commit()
            db.refresh(student_user)

            # Create Student Profile
            student_profile = StudentProfile(user_id=student_user.id, canvas_id="canvas_123")
            db.add(student_profile)
            db.commit()
            db.refresh(student_profile)
        else:
            student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == student_user.id).first()

        # 4. Create Team
        team = db.query(Team).filter(Team.name == "AWG-3").first()
        if not team:
            team = Team(
                name="AWG-3",
                project_id=project.id,
                health_status="green"
            )
            db.add(team)
            db.commit()
            db.refresh(team)

            # Add Student to Team
            membership = TeamMembership(
                student_id=student_profile.id,
                team_id=team.id,
                role=TeamRole.LEAD
            )
            db.add(membership)

        # 5. Create Weeks
        if not db.query(Week).filter(Week.project_id == project.id).first():
            weeks = [
                Week(
                    project_id=project.id,
                    week_number=1,
                    title="Introduction & Team Alignment",
                    overview="Setting up expectations and understanding the project scope.",
                    deliverable_spec={"hint": "Focus on defining clear roles within your team."}
                ),
                Week(
                    project_id=project.id,
                    week_number=2,
                    title="Data Analysis Foundation",
                    overview="Diving into initial datasets and identifying gaps.",
                    deliverable_spec={"hint": "Check for outliers in the pricing column."}
                ),
                Week(
                    project_id=project.id,
                    week_number=3,
                    title="Exploratory Visualization",
                    overview="Visualizing trends across regions.",
                    deliverable_spec={"hint": "Use heatmaps for density analysis."}
                ),
                Week(
                    project_id=project.id,
                    week_number=4,
                    title="Price Gap Calculation",
                    overview="Applying statistical models to identify gaps.",
                    deliverable_spec={"hint": "Ensure standard deviations are accounted for."}
                )
            ]
            db.add_all(weeks)

        # 6. Create Alerts
        if not db.query(Alert).first():
            db.add(Alert(
                team_id=team.id,
                type="missing_checkin",
                message="Team AWG-3 has not submitted their Tuesday pulse check.",
                priority=AlertPriority.HIGH
            ))
            db.add(Alert(
                team_id=team.id,
                type="discrepancy",
                message="Analytical discrepancy detected in Week 2 deliverable for AWG-3.",
                priority=AlertPriority.MEDIUM
            ))

        # 7. Create Drafts
        if not db.query(EmailDraft).first():
            db.add(EmailDraft(
                recipient_email="student@illinois.edu",
                subject="Follow-up: Analytical Discrepancy",
                body="Hi Sam, I noticed a slight discrepancy in your Week 2 analysis for AWG-3. Could you walk me through your logic for the price gap calculation?"
            ))

        db.commit()
        print("Robust seed data created successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
