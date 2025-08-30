// AddProjectModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import newRequest from "../../utils/newRequest";

const AddProjectModal = ({ show, handleClose, onAdd }) => {
  const [projectName, setProjectName] = useState("");

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const optionId = null;
      const res = await newRequest.post("/projects", { name, optionId });
      onAdd(res.data);
      alert("Project created!");
      setName("");
      handleClose();
    } catch (err) {
      // alert("Failed to create project");
      console.log(err);
    }
  };

  const handleSubmitt = () => {
    onAdd(projectName);
    setProjectName("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} >
          <Form.Group>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProjectModal;