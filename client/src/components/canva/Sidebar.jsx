// frontend/src/components/canva/Sidebar.jsx
import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import SavedDesignsModal from "./SavedDesignsModal";
import "./Sidebar.css";
import newRequest from "../../utils/newRequest";

// const Sidebar = ({ onAddText, onImageUpload, onUndo, onRedo, onSave, user, onLoadDesign, savedDesigns, onSelectDesign, loading }) => {

const Sidebar = ({ user, onLoadDesign, onAddText, onImageUpload, onUndo, onRedo, onSave, savedDesigns, onSelectDesign, loading }) => {
    const [showModal, setShowModal] = useState(false);

  // const [showSaved, setShowSaved] = useState(false);
  // const [savedDesigns, setSavedDesigns] = useState([]);

  const handleClose = () => setShowModal(false);
  const handleOpen = () => {
    setShowModal(true);
    onLoadDesign(); // fetch saved designs
  };

  const handleOpenSaved = async () => {
    try {
      const res = await newRequest.get(`/designs/user/${user?._id}`);
      // setSavedDesigns(res.data || []); // ensure array
      // setShowSaved(true);
      setShowModal(true);
      onLoadDesign(); // fetch saved designs
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseSaved = () => setShowSaved(false);

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/designs/${id}`, {
        method: "DELETE",
      });
      onLoadDesign(); // reload designs after delete
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sidebar">
        <button onClick={handleOpenSaved}>Saved Designs</button>
      <div className="sidebar-content">
        <Button variant="primary" className="w-100 mb-2" onClick={onAddText}>
          ➕ Add Text
        </Button>
        <input type="file" className="form-control mb-2" onChange={onImageUpload} />
        <Button variant="secondary" className="w-100 mb-2" onClick={onUndo}>
          ↩️ Undo
        </Button>
        <Button variant="secondary" className="w-100 mb-2" onClick={onRedo}>
          ↪️ Redo
        </Button>
        <Button variant="success" className="w-100 mb-2" onClick={onSave}>
          💾 Save
        </Button>
        <Button variant="info" className="w-100" onClick={handleOpen}>
          {loading ? <Spinner size="sm" /> : "📂 Load Designs"}
        </Button>

        <SavedDesignsModal
          show={showModal}
          handleClose={handleClose}
          savedDesigns={savedDesigns}
          onLoadDesign={(design) => {
            onSelectDesign(design);
            handleClose();
          }}
          onDeleteDesign={handleDelete}
        />
      </div>
    </div>
  );
};

export default Sidebar;


