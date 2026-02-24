class KafkaTopics:
    ATTENDANCE = "student-attendance-events"
    LMS_ACTIVITY = "student-lms-activity-events"
    CODING_ACTIVITY = "student-coding-activity-events"
    STUDENT_FEATURES = "student-feature-updates"


class MongoCollections:
    RAW_EVENTS = "raw_events"
    STUDENT_FEATURES = "student_features"


class SqlTables:
    STUDENTS = "students"
    RISK_PREDICTIONS = "risk_predictions"
    NOTIFICATIONS = "notifications"

