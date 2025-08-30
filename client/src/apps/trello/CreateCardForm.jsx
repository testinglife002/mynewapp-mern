import React, { useState } from 'react';
import { Button, Form, InputGroup, Card } from 'react-bootstrap';

function CreateCardForm({ onCreateCard }) {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateCard(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <Button
        variant="light"
        onClick={() => setIsAdding(true)}
        className="w-100 text-start d-flex align-items-center justify-content-center gap-2 border border-secondary-subtle py-2"
        aria-label="Add a new card"
      >
        <span className="fs-5">＋</span>
        <span>Add a card</span>
      </Button>
    );
  }

  return (
    <Card className="p-3 shadow-sm">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2" controlId="cardTitleInput">
          <Form.Control
            type="text"
            placeholder="Enter a title for this card..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={() => {
              if (!title.trim()) setIsAdding(false);
            }}
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Add Card
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setTitle('');
              setIsAdding(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default CreateCardForm;
