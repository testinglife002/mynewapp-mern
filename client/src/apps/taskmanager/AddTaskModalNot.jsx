// AddTaskModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddTaskModalNot = ({ show, handleClose, onAdd, selectedProject }) => {
  const [taskName, setTaskName] = useState("");

  const handleSubmit = () => {
    onAdd(selectedProject, taskName);
    setTaskName("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              disabled={!selectedProject}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!selectedProject}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTaskModalNot;