from fastapi import APIRouter, Depends
from backend.schemas.events import AttendanceEvent, EventIngestResponse
from backend.services.ingest import ingest_attendance_event
from backend.services.auth import get_current_actor


router = APIRouter(tags=["attendance"])


@router.post("/attendance", response_model=EventIngestResponse)
async def submit_attendance(event: AttendanceEvent, actor=Depends(get_current_actor)):
    result = await ingest_attendance_event(event, actor)
    return result

