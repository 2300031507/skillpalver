from pydantic import BaseModel, Field
from datetime import datetime


class AttendanceEvent(BaseModel):
    student_id: str
    course_id: str
    date: datetime
    present: bool
    source: str = Field(default="manual")


class LMSActivityEvent(BaseModel):
    student_id: str
    course_id: str
    timestamp: datetime
    action: str
    duration_seconds: int


class CodingActivityEvent(BaseModel):
    student_id: str
    course_id: str
    timestamp: datetime
    platform: str
    problems_attempted: int
    problems_solved: int
    lines_of_code: int


class EventIngestResponse(BaseModel):
    status: str
    event_id: str

