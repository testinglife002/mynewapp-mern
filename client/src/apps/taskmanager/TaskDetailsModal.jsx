import React, { useState } from "react";
import {
  Modal,
  Button,
  Badge,
  ListGroup,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import dayjs from "dayjs";
import newRequest from "../../utils/newRequest"; // make sure this is the correct path

const TaskDetailsModal = ({ show, onHide, task, onTaskUpdated }) => {
  if (!task) return null;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    date: task.date,
    stage: task.stage,
    priority: task.priority,
    assets: task.assets || [],
  });

   // For Add Subtask modal visibility
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);

  // Subtask form data
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskTag, setSubtaskTag] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await newRequest.put(`/tasks/${task._id}`, formData);
      if (res.data?.status) {
        onTaskUpdated?.(res.data.task); // optional callback
        setEditMode(false);
      }
    } catch (err) {
      console.error("Error updating task:", err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: task.title,
      date: task.date,
      stage: task.stage,
      priority: task.priority,
      assets: task.assets || [],
    });
  };

  // Add Subtask submit handler
  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) {
      alert("Subtask title is required");
      return;
    }
    try {
      const res = await newRequest.post(`/tasks/${task._id}/subtasks`, {
        title: subtaskTitle,
        tag: subtaskTag,
      });
      if (res.data.status) {
        // Update task subtasks locally
        onTaskUpdated({
          ...task,
          subTasks: res.data.subTasks,
        });
        setShowSubtaskModal(false);
        setSubtaskTitle("");
        setSubtaskTag("");
      }
    } catch (err) {
      console.error("Error adding subtask:", err);
    }
  };

  return (
    <>
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Task Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Title */}
        {editMode ? (
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Form.Group>
        ) : (
          <h5>{task.title}</h5>
        )}

        {/* Date */}
        {editMode ? (
          <Form.Group className="mb-2">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date?.slice(0, 10)}
              onChange={handleChange}
            />
          </Form.Group>
        ) : (
          <p className="text-muted mb-2">
            <strong>Date:</strong> {dayjs(task.date).format("MMM D, YYYY")}
          </p>
        )}

        {/* Project */}
        <p>
          <strong>Project:</strong> {task.project?.name || task.project || "N/A"}
        </p>

        {/* Stage */}
        <div className="mb-2">
          <strong>Status:</strong>{" "}
          {editMode ? (
            <Form.Select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              size="sm"
            >
              <option value="todo">Todo</option>
              <option value="in progress">In Progress</option>
              <option value="done">Done</option>
            </Form.Select>
          ) : (
            <Badge
              bg={
                task.stage === "todo"
                  ? "secondary"
                  : task.stage === "in progress"
                  ? "warning"
                  : "success"
              }
            >
              {task.stage}
            </Badge>
          )}
        </div>

        {/* Priority */}
        <div className="mb-2">
          <strong>Priority:</strong>{" "}
          {editMode ? (
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              size="sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          ) : (
            <Badge
              bg={
                task.priority === "high"
                  ? "danger"
                  : task.priority === "medium"
                  ? "warning"
                  : "secondary"
              }
            >
              {task.priority}
            </Badge>
          )}
        </div>

        {/* Assigned Users */}
        <div className="mb-3">
          <strong>Assigned Users:</strong>
          <ListGroup variant="flush">
            {task.team?.map((user, i) => (
              <ListGroup.Item key={user._id || i}>
                {user.username || user.name || user}{" "}
                <span className="text-muted">({user.email || "No email"})</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        {/* Assets */}
        <div>
          <strong>Assets:</strong>
          {editMode ? (
            <Form.Group className="mb-2">
              <Form.Label>Add Asset URLs</Form.Label>
              <Form.Control
                placeholder="Enter new asset URL and press enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const url = e.target.value.trim();
                    if (url) {
                      setFormData((prev) => ({
                        ...prev,
                        assets: [...prev.assets, url],
                      }));
                      e.target.value = "";
                    }
                  }
                }}
              />
              <ul className="ps-3 mt-2">
                {formData.assets.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>{" "}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          assets: prev.assets.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      ❌
                    </Button>
                  </li>
                ))}
              </ul>
            </Form.Group>
          ) : task.assets?.length ? (
            <ul className="ps-3">
              {task.assets.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No assets attached</p>
          )}
        </div>

        {/* Subtasks Section */}
          <div className="mt-4">
            <h6>
              Subtasks{" "}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowSubtaskModal(true)}
              >
                + Add Subtask
              </Button>
            </h6>
            {task.subTasks?.length === 0 && <p className="text-muted">No subtasks yet.</p>}
            <ListGroup>
              {task.subTasks?.map((subtask, idx) => (
                <ListGroup.Item key={idx}>
                  <Row>
                    <Col xs={8}>{subtask.title}</Col>
                    <Col xs={4} className="text-end text-muted">
                      {subtask.tag && <Badge bg="info" className="me-2">{subtask.tag}</Badge>}
                      {subtask.date && dayjs(subtask.date).format("MMM D, YYYY")}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

      </Modal.Body>

      <Modal.Footer>
        {editMode ? (
          <>
            <Button variant="success" onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setEditMode(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditMode(true)}>
            Edit Task
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>

    {/* Add Subtask Modal */}
      <Modal
        show={showSubtaskModal}
        onHide={() => setShowSubtaskModal(false)}
        centered
      >
        <Modal.Header closeButton>
            <Modal.Title>Add Subtask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
            <Form.Label>Subtask Title</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter subtask title"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                autoFocus
            />
            </Form.Group>
            <Form.Group>
            <Form.Label>Tag (optional)</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter tag"
                value={subtaskTag}
                onChange={(e) => setSubtaskTag(e.target.value)}
            />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleAddSubtask}>
            Add
            </Button>
            <Button variant="secondary" onClick={() => setShowSubtaskModal(false)}>
            Cancel
            </Button>
        </Modal.Footer>
    </Modal>
  </>
  );
};

export default TaskDetailsModal;
