// src/layout/TodoLayout.jsx
import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import "./TodoLayout.css";
import TodoSidebar from "./TodoSidebar";
import TodoFloatingActions from "./TodoFloatingActions";
import MainViewTodo from "../appcomponents/MainViewTodo";

const TodoLayout = ({ children }) => {
  const [selectedView, setSelectedView] = useState("inbox");
  
  const [activeView, setActiveView] = useState('today');
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(
    JSON.parse(localStorage.getItem("sidebarExpanded")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isSidebarExpanded);
  }, [isSidebarExpanded]);

  return (
    <div className="d-flex">
      <TodoSidebar 
        isExpanded={isSidebarExpanded} 
        toggleExpand={() => setIsSidebarExpanded(prev => !prev)} 
        setActiveView={setActiveView}  
      />
      <div className="flex-grow-1 layout-main">
        <Navbar bg="light" expand="lg" className="px-3 shadow-sm">
          <Navbar.Brand href="/">🧠 SmartTodo</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <NavDropdown title="Manage" id="manage-dropdown">
                <NavDropdown.Item href="/projects">Projects</NavDropdown.Item>
                <NavDropdown.Item href="/tags">Tags</NavDropdown.Item>
                <NavDropdown.Item href="/notes">Notes</NavDropdown.Item>
                <NavDropdown.Item href="/add-todos">Add Todo</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/calendar">📅 Calendar</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title="👤 Profile" id="user-dropdown">
                <NavDropdown.Item>Settings</NavDropdown.Item>
                <NavDropdown.Item>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid className="p-3 position-relative">
          {/* <MainView selectedView={selectedView} /> */}
          <MainViewTodo activeView={activeView} />
          {children}
          <TodoFloatingActions />
        </Container>
      </div>
    </div>
  );
};

export default TodoLayout;
