from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
import joblib
from pathlib import Path


class PredictionRequest(BaseModel):
    student_id: str
    course_id: str


class PredictionScores(BaseModel):
    academic_risk: Dict[str, float]
    dropout_probability: float
    recovery_probability: float


class PredictionResponse(BaseModel):
    student_id: str
    course_id: str
    scores: PredictionScores


app = FastAPI(title="Academic Risk ML Service")


def load_model():
    path = Path(__file__).resolve().parent.parent / "artifacts" / "academic_risk_model.joblib"
    if path.exists():
        return joblib.load(path)
    return None


model = load_model()


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    academic_risk = {"low": 0.2, "medium": 0.5, "high": 0.3}
    dropout_probability = 0.35
    recovery_probability = 0.6
    scores = PredictionScores(
        academic_risk=academic_risk,
        dropout_probability=dropout_probability,
        recovery_probability=recovery_probability,
    )
    return PredictionResponse(student_id=request.student_id, course_id=request.course_id, scores=scores)

