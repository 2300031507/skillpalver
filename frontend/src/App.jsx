import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";

function App() {
  const [role, setRole] = useState("student");

  return (
    <div>
      <header>
        <h1>Context-Aware Academic Risk Dashboard</h1>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </header>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={role === "student" ? "/student" : "/teacher"} replace />}
        />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </div>
  );
}

export default App;

