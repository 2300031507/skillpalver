from backend.schemas.dashboard import StudentDashboardView, TeacherDashboardView, AttendanceTrendPoint, EngagementMetric, CodingActivityPoint, RecoverySuggestion, ClassRiskBucket, AtRiskStudent


async def get_student_dashboard(actor: dict) -> StudentDashboardView:
    attendance_trend = [
        AttendanceTrendPoint(date="2026-02-20", attendance_percent=0.8),
        AttendanceTrendPoint(date="2026-02-21", attendance_percent=0.9),
        AttendanceTrendPoint(date="2026-02-22", attendance_percent=0.7),
    ]
    lms_engagement = [
        EngagementMetric(name="page_views", value=120.0),
        EngagementMetric(name="time_spent_minutes", value=340.0),
    ]
    coding_activity = [
        CodingActivityPoint(date="2026-02-20", problems_attempted=5, problems_solved=4),
        CodingActivityPoint(date="2026-02-21", problems_attempted=3, problems_solved=2),
    ]
    recovery_suggestions = [
        RecoverySuggestion(title="Attend office hours", description="Schedule a weekly session with instructor"),
        RecoverySuggestion(title="Complete missing assignments", description="Focus on overdue tasks in LMS"),
    ]
    return StudentDashboardView(
        student_id=actor["id"],
        risk_level="medium",
        attendance_trend=attendance_trend,
        lms_engagement=lms_engagement,
        coding_activity=coding_activity,
        recovery_suggestions=recovery_suggestions,
    )


async def get_teacher_dashboard(actor: dict) -> TeacherDashboardView:
    class_risk_heatmap = [
        ClassRiskBucket(level="low", count=18),
        ClassRiskBucket(level="medium", count=7),
        ClassRiskBucket(level="high", count=5),
    ]
    at_risk_students = [
        AtRiskStudent(
            student_id="S001",
            name="Alice Smith",
            course_id="CS101",
            risk_level="high",
            explanation={"attendance": 0.3, "engagement": 0.4, "coding_consistency": 0.3},
        )
    ]
    return TeacherDashboardView(
        teacher_id=actor["id"],
        class_risk_heatmap=class_risk_heatmap,
        at_risk_students=at_risk_students,
    )

