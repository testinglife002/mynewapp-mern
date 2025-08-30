import React, { useState } from "react";
import { Modal, Button, Form, ListGroup, Row, Col } from "react-bootstrap";
import dayjs from "dayjs";
import newRequest from "../../../utils/newRequest";

const SubtaskModal = ({ show, onHide, todo, setTodo }) => {
  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    try {
      const res = await newRequest.put(`/todos/${todo._id}/add-subtask`, {
        title: newSubtask,
      });
      setTodo(res.data);
      setNewSubtask("");
    } catch (err) {
      console.error("Error adding subtask", err);
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await newRequest.delete(`/todos/${todo._id}`);
      onHide(); // close modal
    } catch (err) {
      console.error("Error deleting todo", err);
    }
  };

  const handleInputChange = (e) => {
    setNewSubtask(e.target.value);
  };

  if (!todo) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Todo Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{todo.title}</h5>
        <p><strong>Description:</strong> {todo.description || "N/A"}</p>
        <Row>
          <Col><strong>Start:</strong> {dayjs(todo.start).format("MMM D, YYYY h:mm A")}</Col>
          <Col><strong>End:</strong> {dayjs(todo.end).format("MMM D, YYYY h:mm A")}</Col>
        </Row>
        <Row className="mt-2">
          <Col><strong>Priority:</strong> {todo.priority}</Col>
          <Col><strong>Status:</strong> {todo.completed ? "Completed" : "Pending"}</Col>
        </Row>
        <p className="mt-2"><strong>User ID:</strong> {todo.userId}</p>

        <hr />
        <h6>Subtasks</h6>
        <ListGroup className="mb-3">
          {(todo.subtasks || []).map((sub, idx) => (
            <ListGroup.Item key={idx}>✔ {sub.title}</ListGroup.Item>
          ))}
        </ListGroup>

        <Form.Group className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Add a new subtask"
            value={newSubtask}
            onChange={handleInputChange}
          />
          <Button variant="primary" onClick={handleAddSubtask}>
            Add
          </Button>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteTodo}>Delete</Button>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubtaskModal;
