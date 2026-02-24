from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import uuid4


class Notification(BaseModel):
    id: str
    student_id: Optional[str]
    recipient_type: str
    recipient_id: str
    severity: str
    message: str
    created_at: datetime
    read: bool


class NotificationRuleInput(BaseModel):
    student_id: str
    course_id: str
    risk_level: str
    academic_risk: dict
    dropout_probability: float
    recovery_probability: float


app = FastAPI(title="Notification Service")


notifications_store: List[Notification] = []


@app.post("/evaluate", response_model=List[Notification])
async def evaluate(input: NotificationRuleInput):
    generated = []
    if input.risk_level == "high" or input.dropout_probability > 0.7:
        generated.append(
            Notification(
                id=str(uuid4()),
                student_id=input.student_id,
                recipient_type="teacher",
                recipient_id="T001",
                severity="high",
                message=f"Student {input.student_id} is at high academic risk in {input.course_id}",
                created_at=datetime.utcnow(),
                read=False,
            )
        )
    notifications_store.extend(generated)
    return generated


@app.get("/notifications", response_model=List[Notification])
async def list_notifications(recipient_type: str, recipient_id: str):
    result = [n for n in notifications_store if n.recipient_type == recipient_type and n.recipient_id == recipient_id]
    return result


@app.post("/notifications", response_model=Notification)
async def create_notification(notification: Notification):
    notifications_store.append(notification)
    return notification

