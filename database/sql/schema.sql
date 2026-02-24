CREATE TABLE students (
    id VARCHAR(36) PRIMARY KEY,
    external_id VARCHAR(64) UNIQUE NOT NULL,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_predictions (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id),
    course_id VARCHAR(64) NOT NULL,
    risk_level VARCHAR(16) NOT NULL,
    academic_risk_low NUMERIC,
    academic_risk_medium NUMERIC,
    academic_risk_high NUMERIC,
    dropout_probability NUMERIC,
    recovery_probability NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) REFERENCES students(id),
    recipient_type VARCHAR(16) NOT NULL,
    recipient_id VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_predictions_student_course ON risk_predictions (student_id, course_id);
CREATE INDEX idx_notifications_recipient ON notifications (recipient_type, recipient_id, read);

