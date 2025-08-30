// client/src/components/CardDetailsModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal, Button, Form, InputGroup,
  Badge, ProgressBar, ListGroup, Spinner, CloseButton
} from 'react-bootstrap';
import newRequest from '../../utils/newRequest';

function CardDetailsModal({ isOpen, onClose, cardId, onUpdateCard, onDeleteCard, boardMembers }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistItemText, setNewChecklistItemText] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const fileInputRef = useRef(null);
  const availableLabels = ['Bug', 'Feature', 'Urgent', 'Documentation', 'Improvement', 'Question'];

  useEffect(() => {
    if (isOpen && cardId) fetchCardDetails();
    else resetState();
  }, [isOpen, cardId]);

  const resetState = () => {
    setCard(null);
    setLoading(true);
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setNewCommentText('');
    setNewChecklistTitle('');
    setNewChecklistItemText('');
    setSelectedMembers([]);
    setSelectedLabels([]);
    setDueDate('');
    setUploadingAttachment(false);
  };

  const fetchCardDetails = async () => {
    setLoading(true);
    try {
      const { data } = await newRequest.get(`/cards/${cardId}`);
      setCard(data);
      setNewTitle(data.title);
      setNewDescription(data.description || '');
      setSelectedMembers(data.members.map(m => m._id));
      setSelectedLabels(data.labels || []);
      setDueDate(data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '');
    } catch {
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = async (field, value) => {
    try {
      const updated = { ...card, [field]: value };
      const { data } = await newRequest.put(`/cards/${card._id}`, updated);
      setCard(data);
      onUpdateCard(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ... other handlers (title, description, comments, checklists, attachments)...

  const totalItems = card?.checklists?.reduce((a, cl) => a + cl.items.length, 0) || 0;
  const completedItems = card?.checklists?.reduce((a, cl) => a + cl.items.filter(i => i.completed).length, 0) || 0;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" backdrop="static">
      <Modal.Header>
        {isEditingTitle ? (
          <Form.Control
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={() => { handleUpdateField('title', newTitle.trim()); setIsEditingTitle(false); }}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setIsEditingTitle(false); }}
            autoFocus
            style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none' }}
          />
        ) : (
          <Modal.Title style={{ cursor: 'pointer' }} onClick={() => setIsEditingTitle(true)}>
            {card?.title}
          </Modal.Title>
        )}
        <CloseButton onClick={onClose} />
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" />
            <span className="ms-2">Loading card details...</span>
          </div>
        ) : (
          <>
            <div className="mb-3 text-muted">
              In list "{card.list.title}" on board "{card.board.name}"
            </div>

            {/* Members */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Members</strong></Form.Label>
              <Form.Control
                as="select"
                multiple
                value={selectedMembers}
                onChange={e => {
                  const vals = Array.from(e.target.selectedOptions, o => o.value);
                  setSelectedMembers(vals);
                  handleUpdateField('members', vals);
                }}
              >
                {boardMembers.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </Form.Control>
              <div className="mt-2">
                {card.members.map(m => (
                  <Badge bg="primary" key={m._id} className="me-1">{m.name}</Badge>
                ))}
              </div>
            </Form.Group>

            {/* Labels */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Labels</strong></Form.Label>
              <Form.Control
                as="select"
                multiple
                value={selectedLabels}
                onChange={e => {
                  const vals = Array.from(e.target.selectedOptions, o => o.value);
                  setSelectedLabels(vals);
                  handleUpdateField('labels', vals);
                }}
              >
                {availableLabels.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </Form.Control>
              <div className="mt-2">
                {card.labels.map((l, idx) => (
                  <Badge bg="info" text="dark" key={idx} className="me-1">{l}</Badge>
                ))}
              </div>
            </Form.Group>

            {/* Due Date */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Due Date</strong></Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={e => {
                  setDueDate(e.target.value);
                  handleUpdateField('dueDate', e.target.value || null);
                }}
              />
              {card.dueDate && (
                <div className={`mt-1 ${new Date(card.dueDate) < new Date() && !card.completed ? 'text-danger' : 'text-muted'}`}>
                  {new Date(card.dueDate).toLocaleDateString()}
                  {new Date(card.dueDate) < new Date() && !card.completed && ' (Overdue)'}
                </div>
              )}
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Description</strong></Form.Label>
              {isEditingDescription ? (
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  onBlur={() => { handleUpdateField('description', newDescription); setIsEditingDescription(false); }}
                  autoFocus
                />
              ) : (
                <div
                  className="border rounded p-2"
                  onClick={() => setIsEditingDescription(true)}
                  style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }}
                >
                  {card.description || 'Add a more detailed description...'}
                </div>
              )}
            </Form.Group>

            {/* Checklists */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Checklists</strong></Form.Label>
              {card.checklists.map(cl => (
                <div key={cl._id} className="border rounded mb-3 p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{cl.title}</strong>
                    <Button variant="outline-danger" size="sm" onClick={() => {/* delete checklist logic */}}>
                      Delete
                    </Button>
                  </div>
                  { totalItems > 0 && (
                    <>
                      <ProgressBar now={progress} label={`${completedItems}/${totalItems}`} className="mb-2" />
                    </>
                  )}
                  <ListGroup variant="flush" className="mb-2">
                    {cl.items.map(item => (
                      <ListGroup.Item key={item._id} className="d-flex align-items-center justify-content-between">
                        <Form.Check
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => {/* toggle item */}
                          }
                          label={<span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.text}</span>}
                        />
                        <Button variant="outline-danger" size="sm" onClick={() => {/* delete item */}}>
                          &times;
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <InputGroup>
                    <Form.Control
                      placeholder="Add an item..."
                      value={newChecklistItemText}
                      onChange={e => setNewChecklistItemText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); /* add item */ } }}
                    />
                    <Button variant="primary" onClick={() => {/* add item */}}>Add</Button>
                  </InputGroup>
                </div>
              ))}
              <InputGroup>
                <Form.Control
                  placeholder="New checklist title..."
                  value={newChecklistTitle}
                  onChange={e => setNewChecklistTitle(e.target.value)}
                />
                <Button variant="success" onClick={() => {/* add checklist */}}>Add Checklist</Button>
              </InputGroup>
            </Form.Group>

            {/* Comments */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Comments</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
              />
              <Button variant="primary" className="mt-2" onClick={() => {/* add comment */}}>
                Add Comment
              </Button>
              <ListGroup variant="flush" className="mt-3">
                {card.comments.length ? card.comments.map(c => (
                  <ListGroup.Item key={c._id} className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{c.user?.name || 'Unknown User'}</strong>
                      <div className="text-muted small">
                        {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => {/* delete comment */}}>
                      &times;
                    </Button>
                  </ListGroup.Item>
                )) : (
                  <div className="text-muted">No comments yet.</div>
                )}
              </ListGroup>
            </Form.Group>

            {/* Attachments */}
            <Form.Group className="mb-3">
              <Form.Label><strong>Attachments</strong></Form.Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={() => {/* upload attachment */}}
                style={{ display: 'none' }}
                id="attachment-upload-input"
              />
              <Button
                as="label"
                htmlFor="attachment-upload-input"
                variant="primary"
                disabled={uploadingAttachment}
              >
                {uploadingAttachment ? (
                  <><Spinner animation="border" size="sm" /> Uploading...</>
                ) : 'Upload Attachment'}
              </Button>
              <ListGroup variant="flush" className="mt-3">
                {card.attachments.length ? card.attachments.map(att => (
                  <ListGroup.Item key={att._id} className="d-flex justify-content-between">
                    <a href={`http://localhost:8800${att.url}`} target="_blank" rel="noopener noreferrer">
                      {att.filename}
                    </a>
                    <Button variant="outline-danger" size="sm" onClick={() => {/* delete attachment */}}>
                      &times;
                    </Button>
                  </ListGroup.Item>
                )) : (
                  <div className="text-muted">No attachments yet.</div>
                )}
              </ListGroup>
            </Form.Group>

            {/* Delete card */}
            <div className="pt-3 border-top">
              <Button variant="danger" onClick={() => {
                if (window.confirm('Are you sure you want to delete this card?')) {
                  onDeleteCard(card._id, card.list);
                  onClose();
                }
              }}>
                Delete Card
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default CardDetailsModal;
