import React, { useEffect, useState } from "react";
import { fetchStudentDashboard, fetchNotifications } from "../api/client";

export function StudentDashboard() {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function load() {
      const dashboard = await fetchStudentDashboard("S001");
      const notes = await fetchNotifications("S001", "student");
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
      <h2>Student Dashboard</h2>
      <p>Risk level: {data.risk_level}</p>
      <section>
        <h3>Attendance trend</h3>
        <ul>
          {data.attendance_trend.map((point) => (
            <li key={point.date}>
              {point.date}: {(point.attendance_percent * 100).toFixed(1)}%
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>LMS engagement</h3>
        <ul>
          {data.lms_engagement.map((metric) => (
            <li key={metric.name}>
              {metric.name}: {metric.value}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Coding activity</h3>
        <ul>
          {data.coding_activity.map((point) => (
            <li key={point.date}>
              {point.date}: {point.problems_solved}/{point.problems_attempted}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Recovery suggestions</h3>
        <ul>
          {data.recovery_suggestions.map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>: {item.description}
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

