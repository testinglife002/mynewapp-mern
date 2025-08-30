// client/src/components/BoardList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { BsPeopleFill } from 'react-icons/bs';
import newRequest from '../../utils/newRequest';
import ActivityFeed from './ActivityFeed';
import ActivityFeeds from './ActivityFeeds';

function BoardList({ boards, onDeleteBoard }) {
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);

  // Modal editing states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBoard, setEditBoard] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBackground, setEditBackground] = useState("#0079BF");
  const [filePreview, setFilePreview] = useState(null);

  const handleEditClick = (board) => {
    setEditBoard(board);
    setEditName(board.name);
    setEditDescription(board.description || "");
    setEditBackground(board.background || "#0079BF");
    setFilePreview(null);
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setFilePreview(previewURL);
    }
  };

  const handleColorPick = (e) => {
    setEditBackground(e.target.value);
    setFilePreview(null);
  };

  const handleTextBackgroundChange = (e) => {
    setEditBackground(e.target.value);
    setFilePreview(null);
  };

  const handleSaveEdit = async () => {
    if (!editBoard) return;
    try {
      const finalBackground = filePreview || editBackground;

      await newRequest.put(`/boards/${editBoard._id}`, {
        name: editName,
        description: editDescription,
        background: finalBackground,
      });

      window.location.reload(); // Replace with lifted state update if possible
    } catch (err) {
      console.error("Failed to update board:", err);
    } finally {
      setShowEditModal(false);
    }
  };

  const previewStyle = {
    height: "100px",
    backgroundColor:
      editBackground?.startsWith("#") && !filePreview ? editBackground : undefined,
    backgroundImage: filePreview
      ? `url(${filePreview})`
      : editBackground?.startsWith("http")
      ? `url(${editBackground})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid #ddd",
    borderRadius: "6px",
    marginTop: "10px",
  };

  return (
    <>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {boards.map((board) => (
          <Col key={board._id}>
            <Card
              className="custom-card h-100 d-flex flex-column"
              style={{ overflow: "hidden", transition: "transform 0.2s ease-in-out" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {/* Board Background */}
              <div
                className="w-100"
                style={{
                  height: "100px",
                  backgroundColor: board.background?.startsWith("#")
                    ? board.background
                    : undefined,
                  backgroundImage: board.background?.startsWith("http")
                    ? `url(${board.background})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderTopLeftRadius: "12px",
                  borderTopRightRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: board.background?.startsWith("#") ? "white" : "#343a40",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                {(!board.background ||
                  (!board.background.startsWith("#") &&
                    !board.background.startsWith("http"))) && (
                  <span className="text-secondary" style={{ fontSize: "0.875rem" }}>
                    No Background
                  </span>
                )}
              </div>

              <Card.Body className="d-flex flex-column">
                <Link to={`/board/${board._id}`} className="text-decoration-none text-dark">
                  <Card.Title
                    title={board.name}
                    className="mb-1"
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {board.name}
                  </Card.Title>
                </Link>

                <Card.Text
                  className="text-secondary mb-2 flex-grow-1"
                  style={{
                    fontSize: "0.875rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {board.description || "No description provided."}
                </Card.Text>

                <div
                  className="d-flex align-items-center text-secondary"
                  style={{ fontSize: "0.875rem", marginBottom: "1rem" }}
                >
                  <BsPeopleFill className="me-1" size={16} />
                  {board.members ? board.members.length : 0} Members
                </div>

                <div className="d-flex justify-content-between mt-auto">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEditClick(board)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this board?")) {
                        onDeleteBoard(board._id);
                      }
                    }}
                    className="custom-btn-outline-danger"
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Activity Feed Section 
        {boards.map((b) => (
          <div key={`activity-${b._id}`} className="p-4 md:p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{b.name}</h1>
              <button
                onClick={() => setIsActivityFeedOpen(true)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Activity
              </button>
            </div>

            <ActivityFeed
              activities={b.activity || []}
              isOpen={isActivityFeedOpen}
              onClose={() => setIsActivityFeedOpen(false)}
            />
          </div>
        ))}
      */}
        

      {/* Edit Board Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editBoardName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editBoardDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editBoardBackground">
              <Form.Label>Background (Hex, URL, or File)</Form.Label>
              <Form.Control
                type="text"
                value={editBackground}
                onChange={handleTextBackgroundChange}
              />
              <div className="d-flex gap-2 mt-2">
                <Form.Control
                  type="color"
                  title="Pick a background color"
                  value={editBackground?.startsWith("#") ? editBackground : "#0079BF"}
                  onChange={handleColorPick}
                  style={{ width: "60px", padding: 0 }}
                />
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  title="Upload background image"
                />
              </div>
              <div
                style={previewStyle}
                className="background-preview d-flex align-items-center justify-content-center text-muted"
              >
                {!editBackground?.startsWith("#") &&
                  !editBackground?.startsWith("http") &&
                  !filePreview &&
                  "Background Preview"}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BoardList;
