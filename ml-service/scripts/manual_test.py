import requests

BASE_URL = "http://127.0.0.1:8001"


def test_check_terms():
    resp = requests.post(
        f"{BASE_URL}/check_terms",
        json={"text": "Привет от YADRO и API, а ещё ЯДРО и tatlin"},
    )
    print("check_terms:", resp.status_code, resp.json())


def test_suggest_fix():
    resp = requests.post(
        f"{BASE_URL}/suggest_fix",
        json={
            "segments": [
                {"id": 1, "text": "Короткий сегмент"},
                {"id": 2, "text": "a" * 90},
                {"id": 3, "text": "ОЧЕНЬ МНОГО КАПСА ТУТ"},
            ]
        },
    )
    print("suggest_fix:", resp.status_code, resp.json())


if __name__ == "__main__":
    test_check_terms()
    test_suggest_fix()