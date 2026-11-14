"""HTTP contract tests for synthetic operations."""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["simulated"] is True


def test_plant_inventory():
    response = client.get("/api/v1/plant")
    assert response.status_code == 200
    assert len(response.json()["equipment"]) == 6


def test_scenario():
    response = client.post("/api/v1/scenarios", json={})
    assert response.status_code == 200
    assert response.json()["outputs"]["captured_co2_t_h"] > 0


def test_comparison():
    response = client.post(
        "/api/v1/scenarios/compare",
        json={"baseline": {}, "candidate": {"lean_solvent_m3_h": 800}},
    )
    assert response.status_code == 200
    assert response.json()["captured_delta_t_h"] > 0


def test_validation_error():
    response = client.post(
        "/api/v1/scenarios", json={"rich_loading": 0.1, "lean_loading": 0.2}
    )
    assert response.status_code == 422


def test_history():
    response = client.get("/api/v1/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_policy_route():
    response = client.get("/api/v1/policies/solvent/3?signal=0.5")
    assert response.status_code == 200
    assert isinstance(response.json()["score"], float)


def test_bad_policy():
    assert client.get("/api/v1/policies/unknown/3").status_code == 404
    assert client.get("/api/v1/policies/solvent/1551").status_code == 404
