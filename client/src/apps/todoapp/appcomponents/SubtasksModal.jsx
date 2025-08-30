// components/todos/SubtasksModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import newRequest from "../../../utils/newRequest";

const SubtasksModal = ({ show, onHide, todoId, refreshSubtasks }) => {
  const [title, setTitle] = useState("");

  const handleAdd = async () => {
    try {
      await newRequest.post(`/todos/${todoId}/subtasks`, {
        title,
        completed: false,
      });
      setTitle("");
      refreshSubtasks();
      onHide();
    } catch (err) {
      console.error("Failed to add subtask", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Subtask</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Subtask Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subtask"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleAdd}>Add Subtask</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubtasksModal;
