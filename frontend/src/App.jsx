import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

function App() {
  const [role, setRole] = useState("student");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    navigate(newRole === "student" ? "/student" : "/teacher");
  };

  const roleColors = {
    student: "from-blue-500 to-cyan-500",
    teacher: "from-purple-500 to-pink-500",
    admin: "from-orange-500 to-red-500"
  };

  const currentGradient = roleColors[role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen glass-effect shadow-2xl transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        } z-40 border-r border-white/10`}
      >
        {/* Logo */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-white/10 sticky top-0 bg-white/50 backdrop-blur-sm">
          {sidebarOpen && (
            <div>
              <h1 className="gradient-text text-2xl font-bold">SkillPalver</h1>
              <p className="text-xs text-gray-600">Risk Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
          >
            {sidebarOpen ? (
              <FiX className="text-2xl text-gray-700" />
            ) : (
              <FiMenu className="text-2xl text-gray-700" />
            )}
          </button>
        </div>

        {/* Role Selection */}
        <div className={`p-6 ${!sidebarOpen ? "px-4" : ""}`}>
          {sidebarOpen && <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Select Role</p>}
          <div className="space-y-2">
            {["student", "teacher", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  role === r
                    ? `bg-gradient-to-r ${currentGradient} text-white shadow-lg`
                    : "bg-white/10 text-gray-700 hover:bg-white/20"
                } ${!sidebarOpen ? "px-2" : ""}`}
              >
                {sidebarOpen ? (
                  role === "student" ? "👨‍🎓 Student" : role === "teacher" ? "👨‍🏫 Teacher" : "⚙️ Admin"
                ) : (
                  role === "student" ? "👨‍🎓" : role === "teacher" ? "👨‍🏫" : "⚙️"
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-white/30 backdrop-blur-sm ${!sidebarOpen ? "p-4" : ""}`}>
          {sidebarOpen && (
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
                <FiUser size={20} />
                <span>Profile</span>
              </button>
              <button className="w-full flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium">
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
              <a
                href="https://github.com/2300031507/skillpalver"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <SiGithub size={20} />
                <span>GitHub</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-72" : "ml-20"}`}>
        {/* Top Bar */}
        <div className="glass-effect sticky top-0 z-30 border-b border-white/10 h-20 flex items-center px-8 shadow-lg">
          <div className="flex-1">
            <h2 className="gradient-text text-3xl font-bold">
              {role === "student" ? "📚 Student Dashboard" : role === "teacher" ? "👥 Teacher Dashboard" : "⚙️ Admin Panel"}
            </h2>
          </div>
          <div className="text-gray-600 text-sm">
            Logged in as: <span className="font-semibold text-gray-800 capitalize">{role}</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8 min-h-[calc(100vh-5rem)]">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={role === "student" ? "/student" : "/teacher"} replace />}
            />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

