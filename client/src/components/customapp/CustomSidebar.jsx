import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaRegStickyNote,
  FaTasks,
  FaClipboardList,
  FaTrello,
  FaPaintBrush,
  FaCog,
  FaBars,
  FaPlus,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import "./CustomSidebar.css";

const CustomSidebar = ({ isOpen, toggleSidebar, selectedTab, setSelectedTab }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="logo">SuperApp</h2>}
        <button className="collapse-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      {/* Tabs  
      className="sidebar-tabs-container"
      */}
      <div className="sidebar-tabs-container">
        <div className={`tab ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
          Home
        </div>
        &nbsp;
        <div className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          Profile
        </div>
        &nbsp;
        <div className={`tab ${activeTab === "contact" ? "active" : ""}`} onClick={() => setActiveTab("contact")}>
          Contact
        </div>
        
      </div>

         {/* Tabs  
      className="tab-content-container"
      */}
      <div >
        {activeTab === "home" && <div className="tab-content">Home tab content goes here...</div>}
        {activeTab === "profile" && <div className="tab-content">Profile tab content goes here...</div>}
        {activeTab === "contact" && <div className="tab-content">Contact tab content goes here...</div>}
      </div>

      <hr />

      <ul className="app-list">
        <li className={`app-item ${selectedTab === "dashboard" ? "active" : ""}`} onClick={() => setSelectedTab("dashboard")} title={!isOpen ? "Dashboard" : ""}>
          <span className="icon"><FaTachometerAlt /></span>
          {isOpen && <span className="label">Dashboard</span>}
        </li>
        <li className={`app-item ${selectedTab === "notes" ? "active" : ""}`} onClick={() => setSelectedTab("notes")} title={!isOpen ? "Notes" : ""}>
          <span className="icon"><FaRegStickyNote /></span>
          {isOpen && <span className="label">Notes</span>}
        </li>
        <li className={`app-item ${selectedTab === "todos" ? "active" : ""}`} onClick={() => setSelectedTab("todos")} title={!isOpen ? "Todos" : ""}>
          <span className="icon"><FaTasks /></span>
          {isOpen && <span className="label">Todos</span>}
        </li>
        <li className={`app-item ${selectedTab === "task" ? "active" : ""}`} onClick={() => setSelectedTab("task")} title={!isOpen ? "Task Manager" : ""}>
          <span className="icon"><FaClipboardList /></span>
          {isOpen && <span className="label">Task Manager</span>}
        </li>
        <li className={`app-item ${selectedTab === "trello" ? "active" : ""}`} onClick={() => setSelectedTab("trello")} title={!isOpen ? "Trello" : ""}>
          <span className="icon"><FaTrello /></span>
          {isOpen && <span className="label">Trello</span>}
        </li>
        <li className={`app-item ${selectedTab === "canva" ? "active" : ""}`} onClick={() => setSelectedTab("canva")} title={!isOpen ? "Canva" : ""}>
          <span className="icon"><FaPaintBrush /></span>
          {isOpen && <span className="label">Canva</span>}
        </li>

        {/* Dropdown */}
        <li className="app-item" onClick={() => setOpenDropdown(!openDropdown)}>
          <span className="icon"><FaPlus /></span>
          {isOpen && <span className="label">Apps</span>}
          {isOpen && (openDropdown ? <FaChevronUp /> : <FaChevronDown />)}
        </li>
        {openDropdown && (
          <ul className="dropdown-list">
            <li className="dropdown-item" onClick={() => setSelectedTab("app1")}>App One</li>
            <li className="dropdown-item" onClick={() => setSelectedTab("app2")}>App Two</li>
          </ul>
        )}

        {/* Settings */}
        <li className={`app-item settings ${selectedTab === "settings" ? "active" : ""}`} onClick={() => setSelectedTab("settings")} title={!isOpen ? "Settings" : ""}>
          <span className="icon"><FaCog /></span>
          {isOpen && <span className="label">Settings</span>}
        </li>
      </ul>
    </aside>
  );
};

export default CustomSidebar;
