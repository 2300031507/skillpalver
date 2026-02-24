INSERT INTO students (id, external_id, first_name, last_name, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'S001', 'Alice', 'Smith', 'alice@example.edu'),
    ('22222222-2222-2222-2222-222222222222', 'S002', 'Bob', 'Jones', 'bob@example.edu');

INSERT INTO risk_predictions (
    id,
    student_id,
    course_id,
    risk_level,
    academic_risk_low,
    academic_risk_medium,
    academic_risk_high,
    dropout_probability,
    recovery_probability
)
VALUES
    ('aaaaaaa1-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'CS101', 'medium', 0.2, 0.5, 0.3, 0.35, 0.6);

