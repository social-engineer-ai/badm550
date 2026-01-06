"""
Tests for authentication endpoints.
"""
import pytest
from fastapi import status


class TestAuthEndpoints:
    """Test authentication API endpoints."""

    def test_root_endpoint(self, client):
        """Test root endpoint returns welcome message."""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["message"] == "Welcome to the BADM 550 Course OS API"

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["status"] == "healthy"

    def test_signup_new_user(self, client):
        """Test creating a new user."""
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "email": "newuser@illinois.edu",
                "password": "securepassword123",
                "first_name": "New",
                "last_name": "User",
                "role": "student"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == "newuser@illinois.edu"
        assert data["first_name"] == "New"
        assert data["role"] == "student"
        assert "id" in data

    def test_signup_duplicate_email(self, client, student_user):
        """Test that duplicate email returns error."""
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "email": "student@illinois.edu",  # Already exists
                "password": "password123",
                "first_name": "Duplicate",
                "last_name": "User",
                "role": "student"
            }
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already exists" in response.json()["detail"]

    def test_login_valid_credentials(self, client, student_user):
        """Test login with valid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "student@illinois.edu",
                "password": "testpass123"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_password(self, client, student_user):
        """Test login with invalid password."""
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "student@illinois.edu",
                "password": "wrongpassword"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, client):
        """Test login with nonexistent user."""
        response = client.post(
            "/api/v1/auth/login",
            data={
                "username": "nobody@illinois.edu",
                "password": "password123"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_signup_teacher_role(self, client):
        """Test creating a teacher user."""
        response = client.post(
            "/api/v1/auth/signup",
            json={
                "email": "newteacher@illinois.edu",
                "password": "teacherpass123",
                "first_name": "Professor",
                "last_name": "Smith",
                "role": "teacher"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["role"] == "teacher"
