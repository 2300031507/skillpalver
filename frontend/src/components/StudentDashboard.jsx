import React, { useEffect, useState } from "react";
import { fetchStudentDashboard, fetchNotifications } from "../api/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FiBell, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";

const RiskBadge = ({ level }) => {
  const colors = {
    high: "bg-red-500/20 text-red-600 border border-red-300",
    medium: "bg-yellow-500/20 text-yellow-600 border border-yellow-300",
    low: "bg-green-500/20 text-green-600 border border-green-300"
  };
  return (
    <span className={`px-4 py-2 rounded-full text-sm font-bold ${colors[level?.toLowerCase()] || colors.medium}`}>
      {level || "Unknown"} Risk
    </span>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
  const gradients = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    orange: "from-orange-500 to-red-500",
    purple: "from-purple-500 to-pink-500"
  };
  return (
    <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wide">{title}</h3>
        {Icon && <Icon className={`text-2xl bg-gradient-to-br ${gradients[color]} bg-clip-text text-transparent`} />}
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
    </div>
  );
};

export function StudentDashboard() {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashboard = await fetchStudentDashboard("S001");
        const notes = await fetchNotifications("S001", "student");
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
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-700 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center border border-white/20">
        <FiAlertCircle className="text-4xl text-orange-500 mx-auto mb-4" />
        <p className="text-gray-700 font-semibold">Unable to load dashboard data</p>
      </div>
    );
  }

  const riskColors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981"
  };

  return (
    <div className="space-y-8">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-2xl p-8 border border-white/20 hover-scale col-span-1 md:col-span-1">
          <p className="text-gray-600 text-sm uppercase tracking-wide font-semibold mb-4">Current Risk Level</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <RiskBadge level={data.risk_level} />
            </div>
          </div>
        </div>

        <StatCard
          title="Attendance Rate"
          value={`${(data.attendance_trend?.[data.attendance_trend.length - 1]?.attendance_percent * 100 || 0).toFixed(1)}%`}
          subtitle="Last recorded session"
          icon={FiCheckCircle}
          color="green"
        />

        <StatCard
          title="Problems Solved"
          value={data.coding_activity?.[data.coding_activity.length - 1]?.problems_solved || 0}
          subtitle="From coding assignments"
          icon={FiTrendingUp}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Attendance Trend</h3>
          {data.attendance_trend && data.attendance_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.attendance_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 46, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance_percent"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#0ea5e9", r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">No attendance data available</p>
          )}
        </div>

        {/* Coding Activity */}
        <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
          <h3 className="text-lg font-bold text-gray-900 mb-6">💻 Coding Activity</h3>
          {data.coding_activity && data.coding_activity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.coding_activity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(30, 30, 46, 0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                />
                <Bar dataKey="problems_solved" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600">No coding activity data</p>
          )}
        </div>
      </div>

      {/* LMS Engagement */}
      <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📚 LMS Engagement Metrics</h3>
        {data.lms_engagement && data.lms_engagement.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.lms_engagement.map((metric) => (
              <div key={metric.name} className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                <p className="text-gray-600 text-sm mb-2">{metric.name}</p>
                <p className="text-3xl font-bold text-purple-600">{metric.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No LMS engagement data</p>
        )}
      </div>

      {/* Recovery Suggestions */}
      <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
        <h3 className="text-lg font-bold text-gray-900 mb-6">🎯 Recommended Actions</h3>
        {data.recovery_suggestions && data.recovery_suggestions.length > 0 ? (
          <div className="space-y-4">
            {data.recovery_suggestions.map((item, idx) => (
              <div key={item.title} className="flex gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/40 smooth-transition">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold">
                    {idx + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recommendations at this time</p>
        )}
      </div>

      {/* Notifications */}
      <div className="glass-effect rounded-2xl p-6 border border-white/20 hover-scale">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiBell /> Recent Notifications
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
                <div>
                  <p className="font-semibold">{n.severity.toUpperCase()}</p>
                  <p className="text-sm mt-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No notifications at this time</p>
        )}
      </div>
    </div>
  );
}

