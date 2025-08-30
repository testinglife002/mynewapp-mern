// DisplayAllProjects.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";


const DisplayAllProjects = ({ optionId, onProjectSelected }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get(`/projects/${optionId}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    if (optionId) {
      fetchProjects();
    }
  }, [optionId]);

  return (
    <div>
      <h6 className="mt-3">Projects:</h6>
      <ul className="list-group mb-3">
        {projects.map((project) => (
          <li
            key={project._id}
            className="list-group-item list-group-item-action"
            onClick={() => onProjectSelected(project)}
            style={{ cursor: "pointer" }}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayAllProjects;
