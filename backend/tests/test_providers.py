import pytest
from fastapi.testclient import TestClient

def test_search_providers_empty(client: TestClient):
    response = client.get("/api/providers/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0

def test_search_providers_with_filters(client: TestClient):
    response = client.get("/api/providers/?service=plumber&location=Test%20City")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_ai_suggestions(client: TestClient):
    response = client.get("/api/services/suggest/water%20leak")
    assert response.status_code == 200
    data = response.json()
    assert "query" in data
    assert "suggested_service" in data
    assert data["query"] == "water leak"
    
