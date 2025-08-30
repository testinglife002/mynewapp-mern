import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const AddTodoForm = ({ show, onClose, onTodoAdded, projects, projectId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [proId, setProId] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (projects.length > 0) {
      setProId(projects[0]._id); // default to first project
    }
  }, [projects]);

  // console.log(proId);
  // console.log(projectId);
  // console.log(projects);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !proId) return alert("Title and Project are required.");
    setLoading(true);

    try {
        const res = await newRequest.post("/todos", 
            {
                title,
                description,
                dueDate,
                projectId: proId,  // ← should send the selected project ID
                recurrence,
            }
        );        
     // );
      onTodoAdded?.(res.data);
      onClose?.();
      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setProId(projects[0]?._id || "");
      setRecurrence("none");
      // navigate("/todosapp"); // Redirect after success
      navigate("/user-alt");
    } catch (err) {
      console.error("Failed to add todo", err);
      alert("Failed to add todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Todo</Modal.Title>
           {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="todoTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="todoDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="todoDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="todoProject">
            <Form.Label>Project</Form.Label>
            <Form.Select
              value={proId}
              onChange={(e) => setProId(e.target.value)}
              required
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="todoRecurrence">
            <Form.Label>Repeat</Form.Label>
            <Form.Select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Todo"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddTodoForm;
