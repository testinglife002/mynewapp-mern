import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import newRequest from "../../utils/newRequest";


const EditOptionModal = ({ show, onHide, option, onUpdated }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(option?.name || "");
  }, [option]);

  const handleUpdate = async () => {
    try {
      const res = await newRequest.put(`/options/${option._id}`, { name });
      onUpdated(res.data);
      onHide();
    } catch {
      alert("Failed to update option");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Option</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleUpdate}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditOptionModal;
