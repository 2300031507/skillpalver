from fastapi import FastAPI
from backend.routers import attendance, lms_activity, coding_activity, predict_risk, notifications, dashboard


def create_app() -> FastAPI:
    app = FastAPI(title="Academic Risk Backend")
    app.include_router(attendance.router, prefix="/api")
    app.include_router(lms_activity.router, prefix="/api")
    app.include_router(coding_activity.router, prefix="/api")
    app.include_router(predict_risk.router, prefix="/api")
    app.include_router(notifications.router, prefix="/api")
    app.include_router(dashboard.router, prefix="/api")
    return app


app = create_app()

