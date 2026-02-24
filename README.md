# Context-Aware Academic Risk and Recovery Prediction System

## High-Level Architecture

- frontend: React single-page application with role-based dashboards for students and teachers. Consumes backend REST APIs only.
- backend: FastAPI service responsible for authentication, event ingestion, Kafka publishing, ML inference orchestration, dashboard aggregation, and notification exposure. Does not perform analytics directly.
- streaming: PySpark Structured Streaming job consuming Kafka topics and computing student-level features such as attendance percentage. Writes results into the MongoDB feature store.
- ml: Python modules for model training, online inference, and explainability. Reads feature data from the feature store and exposes prediction APIs.
- database: MongoDB and PostgreSQL schemas and sample data for raw events, features, student profiles, risk predictions, and notifications.
- notifications: Service that evaluates ML outputs against rule-based logic to generate alerts and exposes notification APIs.

## End-to-End Data Flow

1. Student activity is submitted to backend REST APIs under /api/attendance, /api/lms-activity, and /api/coding-activity.
2. Backend validates payloads and publishes normalized events to Kafka topics such as student-attendance-events, student-lms-activity-events, and student-coding-activity-events.
3. PySpark streaming jobs in the streaming module consume these Kafka topics, compute features such as attendance_percent and inactivity_days, and write per-student aggregated records into the MongoDB student_features collection.
4. The ML inference service reads feature vectors from the feature store and uses XGBoost-based models to compute academic risk class probabilities, dropout probability, and recovery probability. It exposes a /predict endpoint.
5. Backend calls the ML service via HTTP, interprets probabilities into human-readable risk levels, and persists prediction snapshots into the SQL risk_predictions table.
6. Backend or the notifications service applies rule-based logic to ML outputs to generate notifications, storing them in SQL and exposing them via notification APIs.
7. The React frontend calls dashboard and notification APIs such as /api/dashboard/student, /api/dashboard/teacher, and /api/notifications to render role-specific visualizations including risk levels, trends, heatmaps, and alerts.

