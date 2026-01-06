"""
Tests for student portal endpoints.
"""
import pytest
from fastapi import status
from unittest.mock import patch, AsyncMock


class TestStudentEndpoints:
    """Test student API endpoints."""

    def test_get_weeks_unauthorized(self, client):
        """Test weeks endpoint requires authentication."""
        response = client.get("/api/v1/students/weeks")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_weeks(self, client, auth_headers_student, week):
        """Test getting weeks as student."""
        response = client.get(
            "/api/v1/students/weeks",
            headers=auth_headers_student
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    def test_get_my_team_no_membership(self, client, auth_headers_student, student_user):
        """Test getting team when student has no membership."""
        response = client.get(
            "/api/v1/students/me/team",
            headers=auth_headers_student
        )
        # Should return 404 since no team membership exists
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_my_team_with_membership(self, client, db, team, project):
        """Test getting team when student has membership."""
        from app.models.core import User, UserRole, StudentProfile, TeamMembership
        from app.utils.auth import get_password_hash, create_access_token

        # Create student with team
        user = User(
            email="teamstudent@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Team",
            last_name="Student",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        membership = TeamMembership(student_id=profile.id, team_id=team.id)
        db.add(membership)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        response = client.get("/api/v1/students/me/team", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["team_name"] == "AWG-Team-1"

    def test_record_pulse_happy(self, client, db, team, project):
        """Test recording a happy pulse."""
        from app.models.core import User, UserRole, StudentProfile, TeamMembership
        from app.utils.auth import get_password_hash, create_access_token

        # Create student
        user = User(
            email="pulsestudent@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Pulse",
            last_name="Student",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        membership = TeamMembership(student_id=profile.id, team_id=team.id)
        db.add(membership)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        response = client.post(
            "/api/v1/students/pulse",
            json={"sentiment": "😊", "feedback": "All good!"},
            headers=headers
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Pulse recorded"

    def test_record_pulse_sad_creates_alert(self, client, db, team, project):
        """Test that sad pulse creates an alert."""
        from app.models.core import User, UserRole, StudentProfile, TeamMembership
        from app.models.features import Alert
        from app.utils.auth import get_password_hash, create_access_token

        # Create student
        user = User(
            email="sadstudent@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Sad",
            last_name="Student",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        membership = TeamMembership(student_id=profile.id, team_id=team.id)
        db.add(membership)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        # Count alerts before
        alerts_before = db.query(Alert).count()

        response = client.post(
            "/api/v1/students/pulse",
            json={"sentiment": "🙁", "feedback": "Struggling..."},
            headers=headers
        )
        assert response.status_code == status.HTTP_200_OK

        # Check alert was created
        alerts_after = db.query(Alert).count()
        assert alerts_after > alerts_before

    def test_report_frustration(self, client, db, team, project):
        """Test reporting frustration."""
        from app.models.core import User, UserRole, StudentProfile, TeamMembership
        from app.utils.auth import get_password_hash, create_access_token

        user = User(
            email="frustrated@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Frustrated",
            last_name="Student",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        membership = TeamMembership(student_id=profile.id, team_id=team.id)
        db.add(membership)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        response = client.post(
            "/api/v1/students/frustration",
            json={
                "category": "team",
                "impact_level": "moderate",
                "message": "Team communication issues",
                "is_anonymous": False
            },
            headers=headers
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "success"

    def test_request_meeting(self, client, db, team, project):
        """Test requesting a meeting."""
        from app.models.core import User, UserRole, StudentProfile, TeamMembership
        from app.utils.auth import get_password_hash, create_access_token

        user = User(
            email="meetingreq@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Meeting",
            last_name="Requester",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        membership = TeamMembership(student_id=profile.id, team_id=team.id)
        db.add(membership)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        response = client.post(
            "/api/v1/students/meeting-request",
            json={
                "topic": "Project guidance",
                "description": "Need help with data analysis",
                "duration": 30
            },
            headers=headers
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "success"

    @patch('app.services.ai_service.ai_service.draft_email', new_callable=AsyncMock)
    def test_contact_professor(self, mock_draft, client, db, team, project):
        """Test contacting professor."""
        from app.models.core import User, UserRole, StudentProfile, TeamMembership
        from app.utils.auth import get_password_hash, create_access_token

        mock_draft.return_value = "AI generated response draft"

        user = User(
            email="contacter@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Contact",
            last_name="Person",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        response = client.post(
            "/api/v1/students/contact",
            json={
                "subject": "Question about Week 3",
                "body": "I have a question about the data format."
            },
            headers=headers
        )
        assert response.status_code == status.HTTP_200_OK
        assert "Message sent" in response.json()["message"]

    def test_get_my_grades(self, client, db):
        """Test getting student grades."""
        from app.models.core import User, UserRole, StudentProfile
        from app.utils.auth import get_password_hash, create_access_token

        user = User(
            email="gradecheck@illinois.edu",
            hashed_password=get_password_hash("testpass123"),
            first_name="Grade",
            last_name="Checker",
            role=UserRole.STUDENT
        )
        db.add(user)
        db.commit()

        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

        token = create_access_token(subject=user.email)
        headers = {"Authorization": f"Bearer {token}"}

        response = client.get("/api/v1/students/me/grades", headers=headers)
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)
