import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Table } from "react-bootstrap";
import DisplayProjects from "./DisplayProjects";
import DisplayTodos from "../../apps/todoapp/DisplayTodos";

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [options, setOptions] = useState([]);
  const [selectedOptionForForm, setSelectedOptionForForm] = useState("");
  const [selectedFilterOption, setSelectedFilterOption] = useState(""); // used for filtering

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [shareMessage, setShareMessage] = useState("");

  const [search, setSearch] = useState("");
  const [optionId, setOptionId] = useState("");
  const [projectId, setProjectId] = useState(""); 
  const [todos, setTodos] = useState("");

  const fetchOptions = async () => {
    try {
      const res = await axios.get("/api/options", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOptions(res.data);
    } catch (err) {
      console.error("Error fetching options", err);
    }
  };

  const fetchProjects = async (optionId = "") => {
    try {
      const url = optionId ? `/api/projects/${optionId}` : "/api/projects";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchProjects(); // load all projects initially
  }, []);

  useEffect(() => {
    if (selectedFilterOption) {
      fetchProjects(selectedFilterOption); // filter by selected option
    } else {
      fetchProjects(); // show all if none selected
    }
  }, [selectedFilterOption]);

  const handleCreateOrUpdate = async () => {
    if (!projectName.trim() || !selectedOptionForForm) return;

    try {
      if (editingProject) {
        await axios.put(
          `/api/projects/${editingProject._id}`,
          { name: projectName, optionId: selectedOptionForForm },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } else {
        await axios.post(
          "/api/projects",
          { name: projectName, optionId: selectedOptionForForm },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      }
      setProjectName("");
      setEditingProject(null);
      setShowModal(false);
      setSelectedOptionForForm("");
      fetchProjects(selectedFilterOption); // refresh list
    } catch (err) {
      console.error("Error saving project", err);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      if (!projectId) return;

      try {
        const res = await axios.get(`/api/todos?projectId=${projectId}&search=${search}`);
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      }
    };

    fetchTodos();
  }, [projectId, search]); // 🔁 Refetch when projectId or search changes

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProjects(selectedFilterOption);
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setSelectedOptionForForm(project.optionId);
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
            setSelectedOptionForForm(selectedFilterOption || "");
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

          <Form.Select onChange={(e) => setOptionId(e.target.value)}>
            <option>Select Option</option>
            {options.map((opt) => (
                <option key={opt._id} value={opt._id}>
                {opt.name}
                </option>
            ))}
          </Form.Select>
          <Form.Select onChange={(e) => setProjectId(e.target.value)}>
            <option>Select Project</option>
            {projects.map((proj) => (
                <option key={proj._id} value={proj._id}>
                {proj.name}
                </option>
            ))}
          </Form.Select>

          <Form.Control
            type="text"
            className="form-control w-50"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
          <Button >Search</Button>

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
                  </Button>{" "}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setSelectedProjectId(project._id);
                      setShowShareModal(true);
                    }}
                  >
                    Share
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      

      <div className="row">
        <div className="col-md-4">
            <DisplayProjects optionId={optionId} onSelect={(id) => setSelectedProjectId(id)} />
        </div>
        <div className="col-md-8">
            <DisplayTodos projectId={selectedProjectId} />
        </div>
       </div>

      {/* Project Modal */}
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

            <Form.Group className="mt-3">
              <Form.Label>Select Option</Form.Label>
              <Form.Control
                as="select"
                value={selectedOptionForForm}
                onChange={(e) => setSelectedOptionForForm(e.target.value)}
              >
                <option value="">-- Select Option --</option>
                {options.map((opt) => (
                  <option key={opt._id} value={opt._id}>
                    {opt.name}
                  </option>
                ))}
              </Form.Control>
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

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Invite user by email</Form.Label>
              <Form.Control
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </Form.Group>
            {shareMessage && <p className="text-success mt-2">{shareMessage}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShareModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              try {
                await axios.put(`/api/projects/share/${selectedProjectId}`, {
                  email: shareEmail,
                });
                setShareMessage("Project shared successfully!");
                setShareEmail("");
              } catch (error) {
                console.error(error);
                setShareMessage("Failed to share project.");
              }
            }}
          >
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectManager;
