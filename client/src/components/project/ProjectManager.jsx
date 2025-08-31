// ProjectManager.jsx
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import newRequest from "../../utils/newRequest";
import DisplayProjects from "./DisplayProjects";
import DisplayTodos from "../../apps/todoapp/DisplayTodos";

const ProjectManager = ({ selectedOptionId }) => {
  const [projects, setProjects] = useState([]);
  const [options, setOptions] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedFilterOption, setSelectedFilterOption] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const fetchOptions = async () => {
  try {
      const res = await newRequest.get("/options");
      console.log("Options response:", res.data);
      const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
      setOptions(arr);
    } catch (err) {
      console.error("Failed to fetch options", err);
      setOptions([]); // fallback
    }
  };

  const fetchProjects = async (optionId = "") => {
    try {
      const url = optionId ? `/projects?optionId=${optionId}` : "/projects";
      const res = await newRequest.get(url);
      console.log("Projects response:", res.data);
      const arr = Array.isArray(res.data) ? res.data : res.data.data || [];
      setProjects(arr);
    } catch (err) {
      console.error("Error fetching projects", err);
      setProjects([]); // fallback
    }
  };


  useEffect(() => {
    fetchOptions();
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedFilterOption) {
      fetchProjects(selectedFilterOption);
    } else {
      fetchProjects();
    }
  }, [selectedFilterOption]);

  const handleCreateOrUpdate = async () => {
    if (!projectName.trim() || !selectedOptionId) return;

    try {
      if (editingProject) {
        await newRequest.put(`/projects/${editingProject._id}`, {
          name: projectName,
          optionId: selectedOptionId,
        });
      } else {
        await newRequest.post("/projects", { name: projectName, optionId: selectedOptionId });
      }
      setProjectName("");
      setEditingProject(null);
      setShowModal(false);
      fetchProjects(selectedFilterOption);
    } catch (err) {
      console.error("Error saving project", err);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await newRequest.delete(`/projects/${projectId}`);
      fetchProjects(selectedFilterOption);
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setShowModal(true);
  };

  return (
    <div className="my-4">
      <h5>📁 Projects</h5>
      <div className="d-flex align-items-center mb-3 gap-3">
        <Button
          onClick={() => {
            setShowModal(true);
            setEditingProject(null);
            setProjectName("");
          }}
        >
          + Add Project
        </Button>

        <Form.Select
          style={{ width: "300px" }}
          value={selectedFilterOption}
          onChange={(e) => setSelectedFilterOption(e.target.value)}
        >
          <option value="">🔍 Show All Options</option>
          {options.map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.name}
            </option>
          ))}
        </Form.Select>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No projects found.
              </td>
            </tr>
          ) : (
            projects.map((project, index) => (
              <tr key={project._id}>
                <td>{index + 1}</td>
                <td>{project.name}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => openEditModal(project)}>
                    Edit
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(project._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Child Displays */}
      <div className="row">
        <div className="col-md-4">
          <DisplayProjects optionId={selectedOptionId} onSelect={(id) => setSelectedProjectId(id)} />
        </div>
        <div className="col-md-8">
          <DisplayTodos projectId={selectedProjectId} />
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? "Edit Project" : "Add New Project"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdate}>
            {editingProject ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectManager;
