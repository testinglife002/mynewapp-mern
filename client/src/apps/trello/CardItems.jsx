import React, { useState } from "react";
import { Button, Card, Form, ListGroup, Modal } from "react-bootstrap";
import { BsTrash, BsPencil } from "react-icons/bs";
import newRequest from "../../utils/newRequest";

function CardItems({ card, onDropCard, setDraggedCard, onCardUpdate, onCardDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [title, setTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ---------- CARD ----------

  const handleSaveCard = async () => {
    if (editCard) {
      const res = await newRequest.put(`/cards/${editCard._id}`, { title });
      onCardUpdate(res.data);
    }
    setShowModal(false);
    setEditCard(null);
    setTitle("");
  };

  const handleDeleteCard = async (cardId) => {
    await newRequest.delete(`/cards/${cardId}`);
    onCardDelete(cardId);
  };

  // ---------- COMMENTS ----------

  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await newRequest.post(`/cards/${card._id}/comments`, { text: commentText });
      onCardUpdate({ ...card, comments: [...(card.comments || []), res.data] });
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await newRequest.delete(`/cards/${card._id}/comments/${commentId}`);
      onCardUpdate({
        ...card,
        comments: card.comments.filter((c) => c._id !== commentId),
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // ---------- CHECKLISTS ----------

  const addChecklist = async () => {
    const res = await newRequest.post(`/cards/${card._id}/checklists`, { title: "New Checklist" });
    onCardUpdate({ ...card, checklists: [...(card.checklists || []), res.data] });
  };

  const deleteChecklist = async (checklistId) => {
    await newRequest.delete(`/cards/${card._id}/checklists/${checklistId}`);
    onCardUpdate({
      ...card,
      checklists: (card.checklists || []).filter((cl) => cl._id !== checklistId),
    });
  };

  // ---------- CHECKLIST ITEMS ----------

  const addChecklistItem = async (checklist, text) => {
    const res = await newRequest.post(`/cards/${card._id}/checklists/${checklist._id}/items`, { text });
    const updatedChecklists = card.checklists.map((cl) =>
      cl._id === checklist._id ? { ...cl, items: [...cl.items, res.data] } : cl
    );
    onCardUpdate({ ...card, checklists: updatedChecklists });
  };

  const toggleChecklistItem = async (checklist, item) => {
    const res = await newRequest.put(
      `/cards/${card._id}/checklists/${checklist._id}/items/${item._id}/toggle`
    );
    const updatedChecklists = card.checklists.map((cl) =>
      cl._id === checklist._id
        ? { ...cl, items: cl.items.map((it) => (it._id === item._id ? res.data : it)) }
        : cl
    );
    onCardUpdate({ ...card, checklists: updatedChecklists });
  };

  const deleteChecklistItem = async (checklist, itemId) => {
    await newRequest.delete(`/cards/${card._id}/checklists/${checklist._id}/items/${itemId}`);
    const updatedChecklists = card.checklists.map((cl) =>
      cl._id === checklist._id ? { ...cl, items: cl.items.filter((it) => it._id !== itemId) } : cl
    );
    onCardUpdate({ ...card, checklists: updatedChecklists });
  };

  // ---------- DRAG & DROP ----------

  const handleDragStart = (e) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDropCard(card);
  };

  return (
    <div>
      {/* Card item for list view */}
      <ListGroup.Item
        key={card._id}
        className={`mb-2 card-item ${isDraggingOver ? 'bg-light border-primary' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => {
          setIsDraggingOver(true);
          handleDragOver(e);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => {
          setIsDraggingOver(false);
          handleDrop(e);
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>{card.title}</span>
          <div className="card-actions d-flex gap-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => {
                setEditCard(card);
                setTitle(card.title);
                setShowModal(true);
              }}
            >
              <BsPencil />
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => handleDeleteCard(card._id)}
            >
              <BsTrash />
            </Button>
          </div>
        </div>
      </ListGroup.Item>


      {/* Card Preview */}
      <Card className="mb-2" onClick={handleShow} style={{ cursor: "pointer" }}>
        <Card.Body>{card.title}</Card.Body>
      </Card>

      {/* Card Details Modal */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title || card.title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>

          {/* ---------- Comments Section ---------- */}
          <div className="mb-3">
            <h6>Comments</h6>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button variant="primary" onClick={addComment}>
                Add Comment
              </Button>
            </div>
            <ListGroup>
              {card?.comments?.map((c) => (
                <ListGroup.Item key={c._id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{c.user?.username || "User"}:</strong> {c.text}
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => deleteComment(c._id)}>
                    <BsTrash size={12} />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* ---------- Checklists Section ---------- */}
          <div>
            <h6>Checklists</h6>
            <Button size="sm" variant="success" onClick={addChecklist}>
              + Add Checklist
            </Button>
            {card.checklists?.map((cl) => (
              <Card className="mt-2" key={cl._id}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  {cl.title}
                  <Button size="sm" variant="outline-danger" onClick={() => deleteChecklist(cl._id)}>
                    <BsTrash size={12} />
                  </Button>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {cl.items?.map((item) => (
                      <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                        <Form.Check
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(cl, item)}
                          label={item.text}
                        />
                        <Button size="sm" variant="outline-danger" onClick={() => deleteChecklistItem(cl, item._id)}>
                          <BsTrash size={12} />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Form
                    className="mt-2 d-flex"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = e.target.elements.newItem.value;
                      if (text.trim()) {
                        addChecklistItem(cl, text);
                        e.target.reset();
                      }
                    }}
                  >
                    <Form.Control size="sm" type="text" name="newItem" placeholder="Add item..." />
                    <Button size="sm" className="ms-2" type="submit">
                      Add
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDeleteCard(card._id)}>
            Delete
          </Button>
          <Button variant="primary" onClick={handleSaveCard}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Add/Edit Card Title */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editCard ? "Edit Card" : "Add Card"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Card Title</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveCard}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CardItems;
