from fastapi import APIRouter, Depends
from typing import List
from backend.schemas.dashboard import StudentDashboardView, TeacherDashboardView
from backend.services.dashboard import get_student_dashboard, get_teacher_dashboard
from backend.services.auth import get_current_actor


router = APIRouter(tags=["dashboard"])


@router.get("/dashboard/student", response_model=StudentDashboardView)
async def student_dashboard(actor=Depends(get_current_actor)):
    result = await get_student_dashboard(actor)
    return result


@router.get("/dashboard/teacher", response_model=TeacherDashboardView)
async def teacher_dashboard(actor=Depends(get_current_actor)):
    result = await get_teacher_dashboard(actor)
    return result

