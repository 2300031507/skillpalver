from pydantic import BaseModel
from typing import Dict


class RiskPredictionRequest(BaseModel):
    student_id: str
    course_id: str


class RiskScores(BaseModel):
    academic_risk: Dict[str, float]
    dropout_probability: float
    recovery_probability: float


class RiskPredictionResponse(BaseModel):
    student_id: str
    course_id: str
    risk_level: str
    scores: RiskScores

