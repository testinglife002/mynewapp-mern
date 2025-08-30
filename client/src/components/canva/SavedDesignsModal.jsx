// frontend/src/components/SavedDesignsModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./SavedDesignsModal.css";

const SavedDesignsModal = ({
  show,
  handleClose,
  savedDesigns = [], // default to empty array
  onLoadDesign,
  onDeleteDesign,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Saved Designs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {savedDesigns.length === 0 ? (
          <p>No saved designs yet.</p>
        ) : (
          <div className="designs-grid">
            {savedDesigns.map((design) => (
              <div key={design._id} className="design-card">
                <div className="thumbnail-wrapper">
                  <img src={design.thumbnail} alt={design.title} />
                </div>
                <div className="card-footer">
                  <span className="design-title">{design.title}</span>
                  <div className="card-buttons">
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => onLoadDesign(design)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDeleteDesign(design._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SavedDesignsModal;

