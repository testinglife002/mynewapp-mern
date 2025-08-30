// Navbar.jsx
import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";

const AppNavbar = ({ showAddProjectModal, showAddTaskModal }) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container className="d-flex justify-content-between">
        <Navbar.Brand>Task Manager</Navbar.Brand>
        <div>
          <Button variant="outline-light" size="sm" className="me-2" onClick={showAddProjectModal}>+ Add Project</Button>
          <Button variant="outline-light" size="sm" onClick={showAddTaskModal}>+ Add Task</Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;