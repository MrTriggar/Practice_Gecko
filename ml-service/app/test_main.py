from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_check_terms_approved():
    response = client.post("/check_terms", json={"text": "YADRO API"})
    assert response.status_code == 200
    data = response.json()
    assert all(t["status"] == "approved" for t in data["terms"])


def test_check_terms_wrong():
    response = client.post("/check_terms", json={"text": "ЯДРО"})
    assert response.status_code == 200
    data = response.json()
    assert data["terms"][0]["status"] == "wrong"
    assert data["terms"][0]["suggestion"] == "YADRO"


def test_check_terms_category():
    response = client.post("/check_terms", json={"text": "TATLIN"})
    data = response.json()
    assert data["terms"][0]["category"] == "product"


def test_suggest_fix_long_segment():
    long_text = "a" * 100
    response = client.post(
        "/suggest_fix",
        json={"segments": [{"id": 1, "text": long_text}]},
    )
    assert response.status_code == 200
    issues = response.json()["issues"]
    assert issues[0]["severity"] == "high"


def test_suggest_fix_no_issues():
    response = client.post(
        "/suggest_fix",
        json={"segments": [{"id": 2, "text": "короткий текст"}]},
    )
    issues = response.json()["issues"]
    assert issues == []