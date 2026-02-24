import React, { useEffect, useState } from "react";
import { fetchTeacherDashboard, fetchNotifications } from "../api/client";

export function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      const dashboard = await fetchTeacherDashboard("T001");
      const notes = await fetchNotifications("T001", "teacher");
      setData(dashboard);
      setNotifications(notes);
    }
    load();
  }, []);

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <section>
        <h3>Class risk heatmap</h3>
        <ul>
          {data.class_risk_heatmap.map((bucket) => (
            <li key={bucket.level}>
              {bucket.level}: {bucket.count}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>At-risk students</h3>
        <ul>
          {data.at_risk_students.map((s) => (
            <li key={s.student_id}>
              {s.name} ({s.student_id}) [{s.risk_level}]
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Notifications</h3>
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              [{n.severity}] {n.message}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

