import React from "react";
import { Modal, Button } from "react-bootstrap";
import { DialogTitle } from "@mui/material";
import { FaQuestion } from "react-icons/fa";

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Modal show={open} onHide={closeDialog} centered>
      <Modal.Header closeButton>
        <DialogTitle>
          <div className="p-3 rounded-circle bg-danger text-white">
            <FaQuestion size={40} />
          </div>
        </DialogTitle>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="text-muted">
          Are you sure you want to activate or deactivate this account?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onClick}>
          Yes
        </Button>
        <Button variant="secondary" onClick={closeDialog}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
