from fastapi import APIRouter, Depends
from backend.schemas.events import CodingActivityEvent, EventIngestResponse
from backend.services.ingest import ingest_coding_event
from backend.services.auth import get_current_actor


router = APIRouter(tags=["coding-activity"])


@router.post("/coding-activity", response_model=EventIngestResponse)
async def submit_coding_activity(event: CodingActivityEvent, actor=Depends(get_current_actor)):
    result = await ingest_coding_event(event, actor)
    return result

