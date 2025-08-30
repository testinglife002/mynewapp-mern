import React from "react";
import { Modal, Button } from "react-bootstrap";
import { DialogTitle } from "@mui/material";
import { FaQuestion } from "react-icons/fa";

const ConfirmationDialog = ({
  open,
  setOpen,
  msg,
  onClick = () => {},
  type = "delete",
}) => {
  const closeDialog = () => {
    setOpen(false);
  };

  const danger = type === "delete";

  return (
    <Modal show={open} onHide={closeDialog} centered>
      <Modal.Header closeButton>
        <DialogTitle>
          <div className={`p-3 rounded-circle ${danger ? "bg-danger text-white" : "bg-warning text-dark"}`}>
            <FaQuestion size={40} />
          </div>
        </DialogTitle>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p className="text-muted">{msg ?? "Are you sure you want to proceed?"}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={danger ? "danger" : "warning"}
          onClick={onClick}
        >
          {type === "restore" ? "Restore" : "Delete"}
        </Button>
        <Button variant="secondary" onClick={closeDialog}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;
