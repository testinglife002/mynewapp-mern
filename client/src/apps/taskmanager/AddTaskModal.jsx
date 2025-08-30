  import React, { useState, useEffect } from "react";
  import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
  import newRequest from "../../utils/newRequest"; // axios with baseURL + credentials
  import UserListAlt from "./UserListAlt";

  const AddTaskModal = ({ show, handleClose, users = [] }) => {
    const [projects, setProjects] = useState([]);
    const [team, setTeam] = useState([]);
    // const [teamUsers, setTeamUsers] = useState([]);

    const [form, setForm] = useState({
      title: "",
      stage: "todo",
      date: "",
      priority: "normal",
      team: [],
      assets: [],
      projectId: "",
    });

    const [loading, setLoading] = useState(false);

    // ✅ no need to fetch users again, use props
    const teamUsers = users;

    // Fetch user team
    /* useEffect(() => {
      const fetchTeam = async () => {
        try {
          const res = await newRequest.get("/users/user-list");
          // const res = await newRequest.get("/users");
          setTeamUsers(res.data);
        } catch (err) {
          console.error("Failed to load team:", err);
        }
      };
      fetchTeam();
    }, []); */

    // console.log(teamUsers);

    // Fetch available projects
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const res = await newRequest.get("/projects/my-projects");
          setProjects(res.data);
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      };
      fetchProjects();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      console.log(form);
      e.preventDefault();
      setLoading(true);

      try {
        const payload = { ...form, team };
        const res = await newRequest.post("/tasks/create", payload);
        // onTaskCreated(res?.data?.task);
        setForm({
          title: "",
          stage: "todo",
          date: "",
          priority: "normal",
          team: [],
          assets: [],
          projectId: "",
        });
        setTeam([]);
        handleClose();
      } catch (error) {
        console.error("Create Task Error:", error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create / Add Task</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col>
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
              </Col>
              <Col>
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
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
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
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Assign Team Members */}
            <UserListAlt setTeam={setTeam} team={team} allUsers={teamUsers} />

            <Form.Group className="mb-3">
              <Form.Label>Assets (optional)</Form.Label>
              <Form.Control
                type="text"
                name="assets"
                value={form.assets}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    assets: [e.target.value],
                  }))
                }
                placeholder="Enter image/file URL"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Create Task"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  export default AddTaskModal;
