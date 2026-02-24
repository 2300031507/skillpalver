from fastapi import APIRouter, Depends
from backend.schemas.prediction import RiskPredictionRequest, RiskPredictionResponse
from backend.services.prediction import request_risk_prediction
from backend.services.auth import get_current_actor


router = APIRouter(tags=["predict-risk"])


@router.post("/predict-risk", response_model=RiskPredictionResponse)
async def predict_risk(payload: RiskPredictionRequest, actor=Depends(get_current_actor)):
    result = await request_risk_prediction(payload, actor)
    return result

