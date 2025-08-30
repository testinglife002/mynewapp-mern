import { useState } from "react";
import { Nav } from "react-bootstrap";

const SidebarTodo = ({ setActiveView }) => {


  return (
    <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
      <h5>Task Views</h5>


      <div className="sidebar">
        <div className="nav flex-column">
        <ul className="list-unstyled">
            <li><button onClick={() => setActiveView("inbox")}>📥 Inbox</button></li>
            <li><button onClick={() => setActiveView("today")}>📅 Today</button></li>
            <li><button onClick={() => setActiveView("this-week")}>🗓️ This Week</button></li>
            <li><button onClick={() => setActiveView("calendar")}>📆 Calendar</button></li>
            <li><button onClick={() => setActiveView("all")}>📋 All Todos</button></li>
        </ul>
        </div>
      </div>

    </div>
  );
};

export default SidebarTodo;
