import pytest
from fastapi.testclient import TestClient


def test_create_user(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "user_type": "customer",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Registered successfully"
    assert "user_id" in data


def test_create_duplicate_user(client: TestClient):
    # Create first user
    client.post(
        "/api/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "user_type": "customer",
        },
    )

    # Try to create duplicate
    response = client.post(
        "/api/auth/register",
        json={
            "name": "Test User 2",
            "email": "test@example.com",
            "phone": "1234567890",
            "user_type": "customer",
        },
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_get_services(client: TestClient):
    response = client.get("/api/services/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
