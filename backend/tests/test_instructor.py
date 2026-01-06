"""
Tests for instructor dashboard endpoints.
"""
import pytest
from fastapi import status


class TestInstructorEndpoints:
    """Test instructor API endpoints."""

    def test_get_alerts_unauthorized(self, client):
        """Test alerts endpoint requires authentication."""
        response = client.get("/api/v1/instructor/alerts")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_alerts_as_teacher(self, client, auth_headers_teacher, alert):
        """Test getting alerts as teacher."""
        response = client.get(
            "/api/v1/instructor/alerts",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_get_alerts_as_student_forbidden(self, client, auth_headers_student):
        """Test that students cannot access instructor alerts."""
        response = client.get(
            "/api/v1/instructor/alerts",
            headers=auth_headers_student
        )
        # Should be forbidden for students
        assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

    def test_get_drafts(self, client, auth_headers_teacher, email_draft):
        """Test getting email drafts."""
        response = client.get(
            "/api/v1/instructor/drafts",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_get_teams_health(self, client, auth_headers_teacher, team):
        """Test getting team health data."""
        response = client.get(
            "/api/v1/instructor/teams/health",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    def test_get_teams(self, client, auth_headers_teacher, team):
        """Test getting all teams."""
        response = client.get(
            "/api/v1/instructor/teams",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    def test_audit_team(self, client, auth_headers_teacher, team, student_with_team):
        """Test team audit endpoint."""
        response = client.get(
            f"/api/v1/instructor/teams/{team.id}/audit",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "team" in data
        assert "submissions" in data
        assert "alerts" in data

    def test_audit_team_not_found(self, client, auth_headers_teacher):
        """Test audit for non-existent team."""
        response = client.get(
            "/api/v1/instructor/teams/99999/audit",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_team_health(self, client, auth_headers_teacher, team):
        """Test updating team health status."""
        response = client.post(
            f"/api/v1/instructor/teams/{team.id}/health?status=yellow",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "success"

    def test_get_weeks(self, client, auth_headers_teacher, week):
        """Test getting weeks for instructor."""
        response = client.get(
            "/api/v1/instructor/weeks",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)

    def test_get_submissions(self, client, auth_headers_teacher):
        """Test getting submissions."""
        response = client.get(
            "/api/v1/instructor/submissions",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.json(), list)

    def test_get_gradebook(self, client, auth_headers_teacher):
        """Test getting gradebook."""
        response = client.get(
            "/api/v1/instructor/grades",
            headers=auth_headers_teacher
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "weeks" in data
        assert "students" in data
        assert "grades" in data
