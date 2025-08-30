import React from "react";
import { Modal } from "react-bootstrap";
import { DialogTitle } from "@mui/material";

const ModalWrapper = ({ open, setOpen, title, children }) => {
  return (
    <Modal show={open} onHide={() => setOpen(false)} centered>
      <Modal.Header closeButton>
        <DialogTitle>{title}</DialogTitle>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalWrapper;
