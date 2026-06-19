import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaUser,
  FaFolder,
  FaBrain,
  FaBriefcase,
  FaGraduationCap,
  FaFilePdf,
  FaEnvelope,
  FaHome,
  FaCamera,
  FaSun,
  FaMoon
} from "react-icons/fa";

// Import Editors (which we will create next)
import AboutEditor from "./AboutEditor";
import ProjectEditor from "./ProjectEditor";
import SkillsEditor from "./SkillsEditor";
import ExperienceEditor from "./ExperienceEditor";
import EducationEditor from "./EducationEditor";
import ResumeEditor from "./ResumeEditor";
import ProfileEditor from "./ProfileEditor";
import Messages from "./Messages";

import API from "../utils/api";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState({ username: "Admin", email: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || (!saved && document.documentElement.classList.contains("dark"));
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load admin details
  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      setAdminUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "About", path: "/admin/dashboard/about", icon: <FaUser /> },
    { name: "Projects", path: "/admin/dashboard/projects", icon: <FaFolder /> },
    { name: "Skills", path: "/admin/dashboard/skills", icon: <FaBrain /> },
    { name: "Experience", path: "/admin/dashboard/experience", icon: <FaBriefcase /> },
    { name: "Education", path: "/admin/dashboard/education", icon: <FaGraduationCap /> },
    { name: "Resume", path: "/admin/dashboard/resume", icon: <FaFilePdf /> },
    { name: "Profile Photo", path: "/admin/dashboard/profile", icon: <FaCamera /> },
    { name: "Contact Messages", path: "/admin/dashboard/messages", icon: <FaEnvelope /> }
  ];

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-50 text-gray-100 dark:text-gray-800 flex overflow-hidden admin-dashboard">

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-900 dark:bg-white border-r border-gray-800 dark:border-gray-200 transition-all duration-300 flex flex-col justify-between z-40 md:z-30 
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"}
        `}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800 dark:border-gray-200">
            <h1
              className={`font-bold text-lg text-yellow-400 dark:text-blue-600 tracking-wider transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
            >
              Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-gray-950 p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 transition"
            >
              <FaBars />
            </button>
          </div>

          {/* Nav links */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition font-medium ${isActive
                    ? "bg-yellow-400 dark:bg-blue-600 text-gray-950 dark:text-white font-semibold shadow-lg"
                    : "text-gray-400 dark:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-950"
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`transition-opacity duration-200 whitespace-nowrap ${sidebarOpen ? "opacity-100" : "opacity-0 hidden"
                      }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin details & Logout */}
        <div className="p-4 border-t border-gray-800 dark:border-gray-200">
          <div
            className={`flex items-center gap-3 mb-4 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
          >
            <div className="w-10 h-10 bg-yellow-400/10 dark:bg-blue-100 border border-yellow-400/35 dark:border-blue-300 rounded-full flex items-center justify-center text-yellow-400 dark:text-blue-600 font-bold uppercase">
              {adminUser.username[0]}
            </div>
            <div className="overflow-hidden text-gray-100 dark:text-gray-800">
              <p className="text-sm font-semibold truncate">{adminUser.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{adminUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-3 bg-red-950/20 border border-red-900/40 hover:bg-red-900 hover:border-red-700 text-red-400 hover:text-white dark:bg-red-50 dark:border-red-200 dark:hover:bg-red-600 dark:text-red-600 dark:hover:text-white px-4 py-3 rounded-xl transition font-semibold`}
          >
            <FaSignOutAlt />
            <span className={sidebarOpen ? "inline" : "hidden"}>Logout</span>
          </button>
        </div>
      </aside>
      {/* MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-35 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTAINER */}
      <main className={`flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300 ml-0 ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        {/* Top Header */}
        <header className="h-16 border-b border-gray-800 dark:border-gray-200 px-4 md:px-8 flex items-center justify-between bg-gray-900/50 dark:bg-white/75 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-gray-950 p-2 rounded-lg bg-gray-800/40 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 transition mr-3"
            >
              <FaBars />
            </button>
            <h2 className="text-xl font-bold tracking-wide text-white dark:text-gray-900">
              {menuItems.find((m) => m.path === location.pathname)?.name || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-gray-900 p-2.5 rounded-xl bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 transition shadow-inner"
              title={darkMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              Server Date: {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        {/* Inner Content Section */}
        <div className="p-8 flex-1 bg-gray-950 dark:bg-gray-50">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="projects" element={<ProjectEditor />} />
            <Route path="skills" element={<SkillsEditor />} />
            <Route path="experience" element={<ExperienceEditor />} />
            <Route path="education" element={<EducationEditor />} />
            <Route path="resume" element={<ResumeEditor />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="messages" element={<Messages />} />
          </Routes>
        </div>
      </main>

    </div>
  );
};

// Simple internal Dashboard overview page displaying analytics
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    educations: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.allSettled([
          API.get("/projects"),
          API.get("/skills"),
          API.get("/experience"),
          API.get("/education"),
          API.get("/contact")
        ]);

        setStats({
          projects: results[0].status === "fulfilled" && Array.isArray(results[0].value.data) ? results[0].value.data.length : 0,
          skills: results[1].status === "fulfilled" && Array.isArray(results[1].value.data) ? results[1].value.data.length : 0,
          experiences: results[2].status === "fulfilled" && Array.isArray(results[2].value.data) ? results[2].value.data.length : 0,
          educations: results[3].status === "fulfilled" && Array.isArray(results[3].value.data) ? results[3].value.data.length : 0,
          messages: results[4].status === "fulfilled" && Array.isArray(results[4].value.data) ? results[4].value.data.length : 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardItems = [
    { label: "Projects", count: stats.projects, icon: <FaFolder />, color: "border-blue-500/30 dark:border-blue-200 text-blue-400 dark:text-blue-600" },
    { label: "Skills", count: stats.skills, icon: <FaBrain />, color: "border-purple-500/30 dark:border-purple-200 text-purple-400 dark:text-purple-600" },
    { label: "Experience", count: stats.experiences, icon: <FaBriefcase />, color: "border-green-500/30 dark:border-green-200 text-green-400 dark:text-green-600" },
    { label: "Education", count: stats.educations, icon: <FaGraduationCap />, color: "border-yellow-500/30 dark:border-yellow-200 text-yellow-400 dark:text-yellow-600" },
    { label: "Contact Messages", count: stats.messages, icon: <FaEnvelope />, color: "border-pink-500/30 dark:border-pink-200 text-pink-400 dark:text-pink-600" }
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h3 className="text-2xl font-bold text-white dark:text-gray-900">Welcome back!</h3>
        <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Here is a quick overview of your portfolio content statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardItems.map((card) => (
          <div
            key={card.label}
            className={`bg-gray-900 dark:bg-white border ${card.color} rounded-2xl p-6 shadow-xl dark:shadow-md flex items-center justify-between hover:scale-[1.02] transition`}
          >
            <div className="space-y-2">
              <p className="text-gray-400 dark:text-gray-500 text-sm font-semibold uppercase tracking-wider">{card.label}</p>
              <h4 className="text-4xl font-extrabold text-white dark:text-gray-900">{card.count}</h4>
            </div>
            <div className={`text-4xl bg-gray-950/40 dark:bg-gray-100 p-4 rounded-xl`}>{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
