// Navbar.jsx
import React from "react";
import { Navbar as BsNavbar, Container, Button } from "react-bootstrap";

const TaskNavbar = ( /*{ onAddProject, onAddTask }*/ ) => (
  <BsNavbar bg="dark" variant="dark">
    <Container className="d-flex justify-content-between">
      <BsNavbar.Brand href="/">Task Manager</BsNavbar.Brand>
      <div>
        <Button variant="outline-light" className="me-2" onClick={onAddProject}>+ Project</Button>
        <Button variant="outline-light" onClick={onAddTask}>+ Task</Button>
      </div>
    </Container>
  </BsNavbar>
);

export default TaskNavbar;