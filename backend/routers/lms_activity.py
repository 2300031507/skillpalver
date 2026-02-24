from fastapi import APIRouter, Depends
from backend.schemas.events import LMSActivityEvent, EventIngestResponse
from backend.services.ingest import ingest_lms_event
from backend.services.auth import get_current_actor


router = APIRouter(tags=["lms-activity"])


@router.post("/lms-activity", response_model=EventIngestResponse)
async def submit_lms_activity(event: LMSActivityEvent, actor=Depends(get_current_actor)):
    result = await ingest_lms_event(event, actor)
    return result

