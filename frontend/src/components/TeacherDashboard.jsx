import React, { useEffect, useState } from "react";
import { fetchTeacherDashboard, fetchNotifications } from "../api/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FiBell, FiAlertTriangle, FiUsers, FiTrendingDown } from "react-icons/fi";

const RiskLevelBadge = ({ level }) => {
  const colors = {
    high: { bg: "bg-red-500/20", text: "text-red-600", border: "border-red-300" },
    medium: { bg: "bg-yellow-500/20", text: "text-yellow-600", border: "border-yellow-300" },
    low: { bg: "bg-green-500/20", text: "text-green-600", border: "border-green-300" }
  };
  const style = colors[level?.toLowerCase()] || colors.medium;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text} border ${style.border}`}>
      {level}
    </span>
  );
};

export function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await fetchTeacherDashboard("T001");
        const notes = await fetchNotifications("T001", "teacher");
        setData(dashboard);
        setNotifications(notes);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-700 font-semibold">Loading classroom data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center border border-white/20">
        <FiAlertTriangle className="text-4xl text-orange-500 mx-auto mb-4" />
        <p className="text-gray-700 font-semibold">Unable to load classroom data</p>
      </div>
    );
  }

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
  const riskDistribution =
    data.class_risk_heatmap?.map((bucket) => ({
      name: bucket.level,
      value: bucket.count
    })) || [];

  const totalStudents = riskDistribution.reduce((sum, item) => sum + item.value, 0);
  const atRiskCount = riskDistribution
    .filter((item) => item.name.toLowerCase() !== "low")
    .reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Total Students</h3>
            <FiUsers className="text-2xl text-blue-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{totalStudents}</div>
          <p className="text-gray-600 text-sm mt-2">In your classroom</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wide">At Risk</h3>
            <FiAlertTriangle className="text-2xl text-red-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900">{atRiskCount}</div>
          <p className="text-gray-600 text-sm mt-2">{((atRiskCount / totalStudents) * 100).toFixed(1)}% of class</p>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wide">Low Risk</h3>
            <FiTrendingDown className="text-2xl text-green-500" />
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {riskDistribution.find((item) => item.name.toLowerCase() === "low")?.value || 0}
          </div>
          <p className="text-gray-600 text-sm mt-2">Performing well</p>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Heatmap */}
        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Risk Distribution</h3>
          {riskDistribution && riskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 46, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">No risk data available</p>
          )}
        </div>

        {/* Risk Pie Chart */}
        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📈 Student Breakdown</h3>
          {riskDistribution && riskDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 46, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">No breakdown data</p>
          )}
        </div>
      </div>

      {/* At-Risk Students Table */}
      <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
        <h3 className="text-lg font-bold text-gray-900 mb-6">⚠️ Students Requiring Attention</h3>
        {data.at_risk_students && data.at_risk_students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Student Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Risk Level</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.at_risk_students.map((student) => (
                  <tr key={student.student_id} className="border-b border-white/5 hover:bg-white/5 smooth-transition">
                    <td className="py-4 px-4 text-gray-900 font-medium">{student.name}</td>
                    <td className="py-4 px-4 text-gray-600">{student.student_id}</td>
                    <td className="py-4 px-4">
                      <RiskLevelBadge level={student.risk_level} />
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg smooth-transition text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">✨ Great! No students at risk</p>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiBell /> Recent Alerts & Notifications
        </h3>
        {notifications && notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                  n.severity === "high"
                    ? "bg-red-500/10 border-red-500 text-red-800"
                    : n.severity === "medium"
                    ? "bg-yellow-500/10 border-yellow-500 text-yellow-800"
                    : "bg-green-500/10 border-green-500 text-green-800"
                }`}
              >
                <span className="text-xl mt-1">
                  {n.severity === "high" ? "🔴" : n.severity === "medium" ? "🟡" : "🟢"}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{n.severity.toUpperCase()}</p>
                  <p className="text-sm mt-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No alerts at this time</p>
        )}
      </div>

      {/* Selected Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-2xl p-8 border border-white/20 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedStudent.name}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Student ID</p>
                <p className="text-gray-900 font-semibold">{selectedStudent.student_id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Risk Level</p>
                <div className="mt-1">
                  <RiskLevelBadge level={selectedStudent.risk_level} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex-1 px-4 py-2 bg-gray-300/30 text-gray-900 rounded-lg font-medium hover:bg-gray-300/50 smooth-transition"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg smooth-transition">
                Send Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

