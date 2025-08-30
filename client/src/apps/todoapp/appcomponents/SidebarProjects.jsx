import React, { useEffect, useState } from "react";

import ListGroup from "react-bootstrap/ListGroup";
import newRequest from "../../../utils/newRequest";

const SidebarProjects = ({ onSelectProject }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects/my-projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <ListGroup className="sidebar-projects">
      {projects.map((project) => (
        <ListGroup.Item
          key={project._id}
          action
          onClick={() => onSelectProject(project._id)}
        >
          {project.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SidebarProjects;
