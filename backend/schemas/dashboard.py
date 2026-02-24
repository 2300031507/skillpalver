from pydantic import BaseModel
from typing import List, Dict


class AttendanceTrendPoint(BaseModel):
    date: str
    attendance_percent: float


class EngagementMetric(BaseModel):
    name: str
    value: float


class CodingActivityPoint(BaseModel):
    date: str
    problems_attempted: int
    problems_solved: int


class RecoverySuggestion(BaseModel):
    title: str
    description: str


class StudentDashboardView(BaseModel):
    student_id: str
    risk_level: str
    attendance_trend: List[AttendanceTrendPoint]
    lms_engagement: List[EngagementMetric]
    coding_activity: List[CodingActivityPoint]
    recovery_suggestions: List[RecoverySuggestion]


class ClassRiskBucket(BaseModel):
    level: str
    count: int


class AtRiskStudent(BaseModel):
    student_id: str
    name: str
    course_id: str
    risk_level: str
    explanation: Dict[str, float]


class TeacherDashboardView(BaseModel):
    teacher_id: str
    class_risk_heatmap: List[ClassRiskBucket]
    at_risk_students: List[AtRiskStudent]

