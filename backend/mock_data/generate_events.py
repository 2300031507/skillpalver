import requests
from datetime import datetime


BASE_URL = "http://localhost:8000/api"
HEADERS = {"X-Actor-Id": "S001", "X-Actor-Role": "student"}


def post(path: str, payload: dict):
    response = requests.post(f"{BASE_URL}{path}", json=payload, headers=HEADERS, timeout=5.0)
    response.raise_for_status()
    return response.json()


def send_sample_events():
    today = datetime.utcnow().date().isoformat()
    attendance = {
        "student_id": "S001",
        "course_id": "CS101",
        "date": today,
        "present": True,
        "source": "mock",
    }
    lms = {
        "student_id": "S001",
        "course_id": "CS101",
        "timestamp": datetime.utcnow().isoformat(),
        "action": "view_page",
        "duration_seconds": 600,
    }
    coding = {
        "student_id": "S001",
        "course_id": "CS101",
        "timestamp": datetime.utcnow().isoformat(),
        "platform": "leetcode",
        "problems_attempted": 3,
        "problems_solved": 2,
        "lines_of_code": 120,
    }
    print(post("/attendance", attendance))
    print(post("/lms-activity", lms))
    print(post("/coding-activity", coding))


if __name__ == "__main__":
    send_sample_events()

