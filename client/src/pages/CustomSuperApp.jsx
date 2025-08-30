// src/pages/CustomSuperApp.jsx
import React, { useState } from "react";
import "./CustomSuperApp.css";
import { FaTachometerAlt, FaRegStickyNote, FaTasks, FaClipboardList, FaTrello, FaPaintBrush, FaBars, FaCog, FaPlus } from "react-icons/fa";

// Dummy App Components
const Dashboard = () => (
  <div className="app-content">
    <h2>📊 Dashboard</h2>
    <button className="btn">+ Add Post</button>
    <div className="posts-section">Posts will appear here...</div>
  </div>
);

const NotesApp = () => <div className="app-content">📒 Notes App Content</div>;
const TodosApp = () => <div className="app-content">✅ Todos App Content</div>;
const TaskManagerApp = () => <div className="app-content">📂 Task Manager Content</div>;
const TrelloApp = () => <div className="app-content">📝 Trello Board Content</div>;
const CanvaApp = () => <div className="app-content">🎨 Canva Design Area</div>;

const appList = [
  { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt />, component: <Dashboard /> },
  { id: "notes", label: "Notes", icon: <FaRegStickyNote />, component: <NotesApp /> },
  { id: "todos", label: "Todos", icon: <FaTasks />, component: <TodosApp /> },
  { id: "task", label: "Task Manager", icon: <FaClipboardList />, component: <TaskManagerApp /> },
  { id: "trello", label: "Trello", icon: <FaTrello />, component: <TrelloApp /> },
  { id: "canva", label: "Canva", icon: <FaPaintBrush />, component: <CanvaApp /> },
];

const CustomSuperApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="custom-super-app">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {isSidebarOpen && <h2 className="logo">SuperApp</h2>}
          <button className="collapse-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </button>
        </div>

        {/* Tabs */}
        <div className="sidebar-tabs">
          <div
            className={`tab ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </div>
          <div
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </div>
          <div
            className={`tab ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </div>
        </div>

        {/* App List */}
        <ul className="app-list">
          {appList.map((app) => (
            <li
              key={app.id}
              className={`app-item ${selectedApp === app.id ? "active" : ""}`}
              onClick={() => setSelectedApp(app.id)}
              title={!isSidebarOpen ? app.label : ""}
            >
              <span className="icon">{app.icon}</span>
              {isSidebarOpen && <span className="label">{app.label}</span>}
            </li>
          ))}
        </ul>

        <hr />

        {/* Settings */}
        <div
          className="settings-item"
          title={!isSidebarOpen ? "Settings" : ""}
        >
          <FaCog className="icon" />
          {isSidebarOpen && <span>Settings</span>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ marginLeft: isSidebarOpen ? "260px" : "80px" }}>
        {/* App Bar */}
        <header className="app-bar">
          <h3>{appList.find((a) => a.id === selectedApp)?.label}</h3>
          <div className="user-actions">
            <button className="btn-action">🔔</button>
            <button className="btn-action">⚙️</button>
            <button className="btn-action">👤</button>
          </div>
        </header>

        {/* App Content */}
        <div className="content-area">
          {appList.find((a) => a.id === selectedApp)?.component}
        </div>
      </main>
    </div>
  );
};

export default CustomSuperApp;
