import React, { useState, useRef } from 'react';
import CardItem from './CardItem';
import CreateCardForm from './CreateCardForm';
import { Card, CloseButton, Form } from 'react-bootstrap';
import CardItems from './CardItems';

function ListColumn({
  list,
  onUpdateList,
  onDeleteList,
  onCreateCard,
  onOpenCardDetails,
  onCardDragStart,
  onCardDragEnter,
  onCardDragLeave,
  onCardDrop,
  onCardDragOver,
  onCardDragEnd,
  onListDragStart,
  onListDragEnter,
  onListDragLeave,
  onListDrop,
  onListDragOver,
  onListDragEnd,
  listIndex,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const refListColumn = useRef(null);

  const handleTitleChange = (e) => setNewTitle(e.target.value);

  const handleTitleSubmit = () => {
    if (newTitle.trim() && newTitle !== list.title) {
      onUpdateList(list._id, newTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setNewTitle(list.title);
      setIsEditingTitle(false);
    }
  };

  // List drag handlers
  const handleListDragStart = (e) => {
    e.dataTransfer.setData('text/plain', listIndex);
    refListColumn.current.classList.add('dragging-list');
    onListDragStart && onListDragStart(e, listIndex);
  };

  const handleListDrop = (e) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    refListColumn.current.classList.remove('drag-over-list');
    onListDrop && onListDrop(e, sourceIndex, listIndex);
  };

  const dragHandlers = {
    onDragStart: handleListDragStart,
    onDragEnter: (e) => {
      refListColumn.current.classList.add('drag-over-list');
      onListDragEnter && onListDragEnter(e, listIndex);
    },
    onDragOver: (e) => {
      e.preventDefault();
      refListColumn.current.classList.add('drag-over-list');
      onListDragOver && onListDragOver(e, listIndex);
    },
    onDragLeave: (e) => {
      refListColumn.current.classList.remove('drag-over-list');
      onListDragLeave && onListDragLeave(e, listIndex);
    },
    onDrop: handleListDrop,
    onDragEnd: (e) => {
      refListColumn.current.classList.remove('drag-over-list', 'dragging-list');
      onListDragEnd && onListDragEnd(e, listIndex);
    },
  };

  return (
    <div
     // className="flex flex-col bg-gray-100 rounded-lg p-3 shadow-md w-64 mr-4"
    >
    <Card
      ref={refListColumn}
      className="me-3 mb-3"
      style={{ minWidth: '250px', maxWidth: '280px' }}
      draggable
      {...dragHandlers}
    >
      <Card.Body className="p-2">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          {isEditingTitle ? (
            <Form.Control
              size="sm"
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <Card.Title
              className="fs-6 text-truncate w-100"
              onClick={() => setIsEditingTitle(true)}
              style={{ cursor: 'pointer' }}
              title={list.title}
            >
              {list.title}
            </Card.Title>
          )}
          <CloseButton
            variant="white"
            onClick={() => onDeleteList(list._id)}
            title="Delete list"
          />
        </div>

        {/* Cards */}
        <div
          style={{ minHeight: '50px' }}
          onDragEnter={(e) => e.preventDefault()}
          onDragOver={onCardDragOver}
          onDrop={(e) => onCardDrop(e, list._id, list.cards.length)}
        >
          {list.cards && list.cards.length > 0 ? (
             list.cards.map((card, index) => (
            // list.cards.map((card) => (
              <CardItem
                key={card._id}
                card={card}
                onOpenCardDetails={onOpenCardDetails}
                onDragStart={onCardDragStart}
                onDragEnter={onCardDragEnter}
                onDragLeave={onCardDragLeave}
                onDrop={onCardDrop}
                onDragOver={onCardDragOver}
                onDragEnd={onCardDragEnd}
                index={index}
              />
            ))
          ) : (
            <p className="text-muted text-center small py-2">No cards in this list.</p>
          )}

        
          QW
        <div className="d-grid gap-2">
        {list.cards.map((card) => (
            <CardItems key={card._id} card={card} />
        ))}
        </div>

        </div>

        

        {/* Add Card */}
        <div className="mt-3">
          <CreateCardForm onCreateCard={(title) => onCreateCard(list._id, title)} />
        </div>
      </Card.Body>
    </Card>
        

    </div>
  );
}

export default ListColumn;
