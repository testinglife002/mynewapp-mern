// src/pages/SuperApp.jsx
import React, { useState, useRef } from "react";
import "./SuperApp.css";
import { FaRegStickyNote, FaTasks, FaClipboardList, FaTrello, FaPaintBrush, FaTachometerAlt, FaBars } from "react-icons/fa";

// Dummy app components
const NotesApp = () => <div className="app-content">📒 Notes App Content</div>;
const TodosApp = () => <div className="app-content">✅ Todos App Content</div>;
const TaskManagerApp = () => <div className="app-content">📂 Task Manager Content</div>;
const TrelloApp = () => <div className="app-content">📝 Trello Board Content</div>;
const CanvaApp = () => <div className="app-content">🎨 Canva Design Area</div>;
const DashboardApp = () => (
  <div className="app-content">
    <h2>📊 Dashboard - Admin Panel</h2>
    <button className="btn">+ Add Post</button>
    <div className="posts-section">List of posts will appear here...</div>
  </div>
);

const apps = [
  { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt />, component: <DashboardApp /> },
  { id: "notes", label: "Notes", icon: <FaRegStickyNote />, component: <NotesApp /> },
  { id: "todos", label: "Todos", icon: <FaTasks />, component: <TodosApp /> },
  { id: "task", label: "Task Manager", icon: <FaClipboardList />, component: <TaskManagerApp /> },
  { id: "trello", label: "Trello", icon: <FaTrello />, component: <TrelloApp /> },
  { id: "canva", label: "Canva", icon: <FaPaintBrush />, component: <CanvaApp /> },
];

const SuperApp = () => {
  const [selectedApp, setSelectedApp] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPos, setTooltipPos] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const sidebarRef = useRef();

  const renderApp = () => {
    const app = apps.find((a) => a.id === selectedApp);
    return app ? app.component : <div>Select an App</div>;
  };

  const handleTooltipEnter = (label) => {
    setTooltipText(label);
    setShowTooltip(true);
  };

  const handleTooltipLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseMove = (e) => {
    if (isCollapsed && showTooltip) {
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      let top = e.clientY - sidebarRect.top - 15; // 15 = half tooltip height

      // Keep tooltip inside sidebar
      const maxTop = sidebarRef.current.clientHeight - 30;
      if (top > maxTop) top = maxTop;
      if (top < 5) top = 5;

      setTooltipPos(top);
    }
  };

  return (
    <div className="super-app">
      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
        ref={sidebarRef}
        onMouseMove={handleMouseMove}
      >
        <div className="sidebar-header">
          {!isCollapsed && <h2 className="logo">SuperApp</h2>}
          <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            <FaBars />
          </button>
        </div>

        <ul className="sidebar-list">
          {apps.map((app) => (
            <li
              key={app.id}
              className={`sidebar-item ${selectedApp === app.id ? "active" : ""}`}
              onClick={() => setSelectedApp(app.id)}
              onMouseEnter={() => isCollapsed && handleTooltipEnter(app.label)}
              onMouseLeave={handleTooltipLeave}
            >
              <span className="icon">{app.icon}</span>
              {!isCollapsed && <span className="label">{app.label}</span>}
            </li>
          ))}
        </ul>

        {/* Tooltip */}
        {isCollapsed && showTooltip && (
          <div className="sidebar-tooltip" style={{ top: tooltipPos }}>
            {tooltipText}
          </div>
        )}
      </aside>

      <main className="main-content" style={{ marginLeft: isCollapsed ? "60px" : "220px" }}>
        <nav className="navbar">
          <h3>{apps.find((a) => a.id === selectedApp)?.label}</h3>
          <div className="user-menu">
            <span>👤 User</span>
          </div>
        </nav>
        <div className="content-area">{renderApp()}</div>
      </main>
    </div>
  );
};

export default SuperApp;
