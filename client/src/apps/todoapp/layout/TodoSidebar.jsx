// src/layout/TodoSidebar.jsx
import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { Menu, ExpandMore, ChevronLeft, Dashboard, NoteAdd, Label, CalendarMonth } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import "./TodoSidebar.css";

const TodoSidebar = ({ isExpanded, toggleExpand, setActiveView }) => {

    const [ view, setView ] = useState('');

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <Tooltip title={isExpanded ? "Collapse" : "Expand"} placement="right">
          <IconButton onClick={toggleExpand} className="toggle-btn">
            {isExpanded ? <Menu /> : <ExpandMore />}
          </IconButton>
        </Tooltip>
      </div>
      
      <Nav defaultActiveKey="inbox" className="flex-column">
        <Nav.Link eventKey="inbox" onClick={() => setActiveView("inbox")}>📥 Inbox</Nav.Link>
        <Nav.Link eventKey="today" onClick={() => setActiveView("today")}>📅 Today</Nav.Link>
        <Nav.Link eventKey="week" onClick={() => setActiveView("this-week")}>📆 This Week</Nav.Link>
        <Nav.Link eventKey="all" onClick={() => setActiveView("calendar")}>📅 Calendar</Nav.Link>
        <Nav.Link eventKey="all" onClick={() => setActiveView("all")}>📋 All Todos</Nav.Link>
      </Nav>

      <Nav defaultActiveKey="/" className="flex-column">
        <Nav.Link href="/" title="Dashboard">
          <Dashboard className="me-2" />
          {isExpanded && "Dashboard"}
        </Nav.Link>
        <Nav.Link href="/todos" title="Todos">
          <NoteAdd className="me-2" />
          {isExpanded && "Todos"}
        </Nav.Link>
        <Nav.Link href="/tags" title="Tags">
          <Label className="me-2" />
          {isExpanded && "Tags"}
        </Nav.Link>
        <Nav.Link href="/calendar" title="Calendar">
          <CalendarMonth className="me-2" />
          {isExpanded && "Calendar"}
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default TodoSidebar;
