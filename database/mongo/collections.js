db.createCollection("raw_events");
db.raw_events.createIndex({ student_id: 1, course_id: 1, timestamp: -1 });

db.createCollection("student_features");
db.student_features.createIndex({ student_id: 1, course_id: 1 }, { unique: true });

