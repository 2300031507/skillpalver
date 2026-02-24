from fastapi import APIRouter, Depends
from typing import List
from backend.schemas.notifications import Notification, NotificationCreateRequest
from backend.services.notifications import list_notifications_for_actor, create_manual_notification
from backend.services.auth import get_current_actor


router = APIRouter(tags=["notifications"])


@router.get("/notifications", response_model=List[Notification])
async def get_notifications(actor=Depends(get_current_actor)):
    result = await list_notifications_for_actor(actor)
    return result


@router.post("/notifications", response_model=Notification)
async def create_notification(payload: NotificationCreateRequest, actor=Depends(get_current_actor)):
    result = await create_manual_notification(payload, actor)
    return result

