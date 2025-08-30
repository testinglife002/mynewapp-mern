// src/components/customapp/CustomAppBar.jsx
import React, { useState } from "react";
import { FaBell, FaCog, FaSun, FaMoon } from "react-icons/fa";
import "./CustomAppBar.css";

const CustomAppBar = ({ mode, setMode }) => {
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="custom-app-bar">
      <h3>My Dashboard</h3>
      <div className="app-bar-actions">
        <div className="nav-menu-wrapper">
          <button className="btn-action" onClick={() => setShowNavMenu(!showNavMenu)}>☰</button>
          {showNavMenu && (
            <div className="menu-dropdown">
              <div>Dashboard</div>
              <div>Reports</div>
              <div>Analytics</div>
            </div>
          )}
        </div>

        <button className="btn-action"> <FaBell /> </button>
        <button className="btn-action"> <FaCog /> </button>
        <button
          className="btn-action"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "light" ? <FaMoon /> : <FaSun />}
        </button>

        <div className="user-menu-wrapper">
          <button className="btn-action" onClick={() => setShowUserMenu(!showUserMenu)}>👤</button>
          {showUserMenu && (
            <div className="menu-dropdown">
              <div>Profile</div>
              <div>Logout</div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomAppBar;
