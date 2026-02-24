from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class Notification(BaseModel):
    id: str
    student_id: Optional[str]
    recipient_type: str
    recipient_id: str
    severity: str
    message: str
    created_at: datetime
    read: bool


class NotificationCreateRequest(BaseModel):
    student_id: Optional[str]
    recipient_type: str
    recipient_id: str
    severity: str
    message: str

