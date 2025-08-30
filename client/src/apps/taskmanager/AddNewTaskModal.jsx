// components/AddNewTaskModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import newRequest from "../../utils/newRequest";
import UserListAlt from "./UserListAlt";

const AddNewTaskModal = ({ show, onHide, allUsers }) => {
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]); // <-- Track selected user IDs
  const [teamUsers, setTeamUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    priority: "normal",
    stage: "todo",
    team: [],
    assets: [],
    projectId: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects/my-projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  // Fetch user team
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await newRequest.get("/users/user-list");
        setTeamUsers(res.data);
      } catch (err) {
        console.error("Failed to load team:", err);
      }
    };
    fetchTeam();
  }, []);

  useEffect(() => {
    setForm((prev) => ({ ...prev, team }));
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetsChange = (e) => {
    const assetsArray = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setForm((prev) => ({ ...prev, assets: assetsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/tasks/create", form);
      console.log("Task created:", res.data);
      onHide(); // close modal
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create / Add Task</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            <Form.Select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stage</Form.Label>
            <Form.Select
              name="stage"
              value={form.stage}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>

          {/* UserListAlt for team assignment */}
          <UserListAlt setTeam={setTeam} team={team} allUsers={teamUsers} />

          <Form.Group className="mb-3">
            <Form.Label>Assets (comma-separated URLs)</Form.Label>
            <Form.Control
              name="assets"
              placeholder="https://image1.png, https://file.pdf"
              onChange={handleAssetsChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Task
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddNewTaskModal;
