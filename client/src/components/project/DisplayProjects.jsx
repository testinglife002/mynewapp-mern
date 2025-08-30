
/*
import React, { useEffect, useState } from "react";
import { Table, Badge } from "react-bootstrap";
import newRequest from "../../utils/newRequest"; // Adjust the path if needed

const DisplayProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    newRequest
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Failed to fetch projects:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Your Projects</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Option Name</th>
            <th>Shared With</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.optionId?.name || <em>Not Set</em>}</td>
              <td>
                {p.sharedWith.length === 0 ? (
                  <span className="text-muted">No users</span>
                ) : (
                  p.sharedWith.map((u) => (
                    <Badge bg="secondary" className="me-1" key={u._id}>
                      {u.username || u.email}
                    </Badge>
                  ))
                )}
              </td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};


export default DisplayProjects;
*/

import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest"; // 🔁 Adjust path if needed
import { Table, Badge, Spinner } from "react-bootstrap";

const DisplayProjects = ({ optionId, onSelect }) => {
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!optionId) {
        newRequest
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Failed to fetch projects:", err));
    }
  }, []);


   // if (!optionId) return;
    

  /*
  useEffect(() => {
    setLoading(true);
    if(optionId) {
        newRequest
      .get(`/projects?optionId=${optionId}`)
      .then((res) => {
        setShowProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      });
    }
  },[])
  */

  return (
    <div className="container mt-3">
      <h5 className="mb-3">Projects under Selected Option</h5>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : projects.length === 0 ? (
        <p>No projects found under this option.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Shared With</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project._id}
                onClick={() => onSelect?.(project._id)}
                style={{ cursor: "pointer" }}
              >
                <td>{project.name}</td>
                <td>
                  {project.sharedWith?.length > 0 ? (
                    project.sharedWith.map((user, i) => (
                      <Badge key={i} bg="secondary" className="me-1">
                        {user.username || user.email}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">Not shared</span>
                  )}
                </td>
              </tr>
            ))}

            {/* showProjects.map((pro) => (
              <tr
                key={pro._id}
                onClick={() => onSelect?.(pro._id)}
                style={{ cursor: "pointer" }}
              >
                <td>{pro.name}</td>
                <td>
                  {pro.sharedWith?.length > 0 ? (
                    pro.sharedWith.map((user, i) => (
                      <Badge key={i} bg="secondary" className="me-1">
                        {user.username || user.email}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">Not shared</span>
                  )}
                </td>
              </tr>
            )) */}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DisplayProjects;


