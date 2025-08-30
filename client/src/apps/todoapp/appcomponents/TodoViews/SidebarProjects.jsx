// components/SidebarProjects.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { ListGroup } from "react-bootstrap";

const SidebarProjects = ({ projects }) => {
  return (
    <div className="p-3 border-end vh-100" style={{ width: "250px" }}>
      <h5 className="mb-3">Views</h5>
      <ListGroup variant="flush">
        <ListGroup.Item as={NavLink} to="/todos/inbox">Inbox</ListGroup.Item>
        <ListGroup.Item as={NavLink} to="/todos/today">Today</ListGroup.Item>
        <ListGroup.Item as={NavLink} to="/todos/this-week">This Week</ListGroup.Item>
        <ListGroup.Item as={NavLink} to="/todos/calendar">Calendar</ListGroup.Item>
        <ListGroup.Item as={NavLink} to="/todos/all">All Todos</ListGroup.Item>
        <ListGroup.Item as={NavLink} to="/todos/kanban">Kanban</ListGroup.Item>
      </ListGroup>

      <h6 className="mt-4">Projects</h6>
      <ListGroup variant="flush">
        {projects?.map((project) => (
          <ListGroup.Item
            key={project._id}
            as={NavLink}
            to={`/todos/project/${project._id}`}
          >
            {project.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SidebarProjects;
