from uuid import uuid4
from backend.schemas.events import AttendanceEvent, LMSActivityEvent, CodingActivityEvent, EventIngestResponse
from backend.services.kafka import producer
from backend.settings import KafkaTopics


async def ingest_attendance_event(event: AttendanceEvent, actor: dict) -> EventIngestResponse:
    event_id = str(uuid4())
    payload = event.dict()
    payload["event_id"] = event_id
    payload["actor_id"] = actor["id"]
    producer.send(KafkaTopics.ATTENDANCE, payload)
    return EventIngestResponse(status="accepted", event_id=event_id)


async def ingest_lms_event(event: LMSActivityEvent, actor: dict) -> EventIngestResponse:
    event_id = str(uuid4())
    payload = event.dict()
    payload["event_id"] = event_id
    payload["actor_id"] = actor["id"]
    producer.send(KafkaTopics.LMS_ACTIVITY, payload)
    return EventIngestResponse(status="accepted", event_id=event_id)


async def ingest_coding_event(event: CodingActivityEvent, actor: dict) -> EventIngestResponse:
    event_id = str(uuid4())
    payload = event.dict()
    payload["event_id"] = event_id
    payload["actor_id"] = actor["id"]
    producer.send(KafkaTopics.CODING_ACTIVITY, payload)
    return EventIngestResponse(status="accepted", event_id=event_id)

