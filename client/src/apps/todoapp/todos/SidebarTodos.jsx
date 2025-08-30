// components/SidebarTodos.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaInbox, FaCalendarDay, FaCalendarWeek, FaListAlt, FaCalendarAlt } from 'react-icons/fa';

const SidebarTodos = () => {
  return (
    <div className="sidebar p-3 border-end bg-light" style={{ minHeight: '100vh', width: '240px' }}>
      <h4 className="mb-4">Tasks</h4>
      <nav className="nav flex-column">
        <NavLink to="/inbox" className="nav-link" activeclassname="active">
          <FaInbox className="me-2" /> Inbox
        </NavLink>
        <NavLink to="/today" className="nav-link" activeclassname="active">
          <FaCalendarDay className="me-2" /> Today
        </NavLink>
        <NavLink to="/this-week" className="nav-link" activeclassname="active">
          <FaCalendarWeek className="me-2" /> This Week
        </NavLink>
        <NavLink to="/all" className="nav-link" activeclassname="active">
          <FaListAlt className="me-2" /> All Todos
        </NavLink>
        <NavLink to="/calendar" className="nav-link" activeclassname="active">
          <FaCalendarAlt className="me-2" /> Calendar View
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarTodos;
