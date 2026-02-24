const BASE_URL = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Actor-Id": options.actorId || "S001",
      "X-Actor-Role": options.actorRole || "student"
    }
  });
  if (!response.ok) {
    throw new Error("Request failed");
  }
  return response.json();
}

export async function fetchStudentDashboard(actorId) {
  return request("/dashboard/student", { actorId, actorRole: "student" });
}

export async function fetchTeacherDashboard(actorId) {
  return request("/dashboard/teacher", { actorId, actorRole: "teacher" });
}

export async function fetchNotifications(actorId, role) {
  return request("/notifications", { actorId, actorRole: role });
}

