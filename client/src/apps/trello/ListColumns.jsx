// src/components/ListColumns.jsx
import React, { useEffect, useState } from "react";
import axios from 'axios';
import CardItem from "./CardItem";
import { Card, Col, Row, Button, Form, Modal } from "react-bootstrap";
import { BsTrash, BsPencil } from 'react-icons/bs';
import CardItems from "./CardItems";
import newRequest from "../../utils/newRequest";
import './ListColumns.css';

function ListColumns({ /* lists, */ boardId, /* onDropCard, onDropList, setDraggedCard */ }) {

  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
 // const [loading, setLoading] = useState(true);
  // const [lists, setLists] = useState(board.lists || []);
  const [newListTitle, setNewListTitle] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [title, setTitle] = useState("");


  const [draggedCard, setDraggedCard] = useState(null);

  // Fetch lists and cards when boardId changes
  // ✅ Move fetchBoard outside useEffect so it's reusable
  const fetchBoard = async () => {
    try {
      const res = await newRequest.get(`/boards/${boardId}`);
      // setBoard(res.data.board);
      setLists(res.data.lists);
    } catch (err) {
      console.error('Failed to fetch board:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const res = await newRequest.get(`/boards/${boardId}/lists`);
      setLists(res.data); // assuming your backend returns an array of lists
    } catch (err) {
      console.error("Failed to fetch lists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) fetchLists();
  }, [boardId]);

  const handleSaveList = async () => {
    if (editList) {
      const res = await newRequest.put(`/lists/${editList._id}`, { title });
      setLists(lists.map((l) => (l._id === editList._id ? res.data : l)));
    } else {
      const res = await newRequest.post(`/lists//boards/${boardId}/lists`, { title });
      setLists([...lists, res.data]);
    }
    setShowModal(false);
    setEditList(null);
    setTitle("");
  };

  const handleDeleteList = async (listId) => {
    await newRequest.delete(`/lists/${listId}`);
    setLists(lists.filter((l) => l._id !== listId));
  };
  

  // Add a card to a specific list
  const addCardToList = async (listId, title) => {
    try {
      const res = await newRequest.post(`/cards/${listId}/cards`, { title, listId, boardId });
      const newCard = res.data;
      onDropList({ _id: listId }); // To refetch board via parent

      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      );
    } catch (err) {
      console.error("Error adding card:", err);
    }
  };

  // Add a new list to the board
  const addNewList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await newRequest.post(`/boards/${boardId}/lists`, {
        boardId,
        title: newListTitle.trim(),
      });
      setLists((prev) => [...prev, { ...res.data, cards: [] }]);
      setNewListTitle("");
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  const onDropCard = async (targetCard) => {
    if (!draggedCard || draggedCard._id === targetCard._id) return;

    try {
      await axios.put(`/api/cards/${draggedCard._id}/move`, {
        targetCardId: targetCard._id
      });
      fetchLists(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  const onDropList = async (targetList) => {
    if (!draggedCard || draggedCard.list === targetList._id) return;

    try {
      await axios.put(`/api/cards/${draggedCard._id}/move`, {
        targetListId: targetList._id
      });
      fetchLists(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = async (cardId, fromListId, toListId, toIndex) => {
    console.log('🟡 Dropping:', { cardId, fromListId, toListId, toIndex });

    const sourceCard = board.lists
        .find(list => list._id === fromListId)
        ?.cards.find(card => card._id === cardId);

    if (!sourceCard) return;

    const newBoardState = JSON.parse(JSON.stringify(board));
    const fromList = newBoardState.lists.find(list => list._id === fromListId);
    const toList = newBoardState.lists.find(list => list._id === toListId);

    // Remove from old list
    fromList.cards = fromList.cards.filter(card => card._id !== cardId);

    // Insert into new list (or same list)
    if (typeof toIndex === 'number') {
        toList.cards.splice(toIndex, 0, sourceCard);
    } else {
        toList.cards.push(sourceCard);
    }

    setBoard(newBoardState);

    // const baseURL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
    try {
        // await api.moveCard({ cardId, fromListId, toListId, toIndex });
       /* const res = await newRequest.get(`/boards/${boardId}`);
        const res = await axios.put(`${baseURL}/cards/move`,
            { 
                cardId, 
                fromListId, 
                toListId, 
                toIndex 
            },  
            {
            withCredentials: true
            }
        ); 
        console.log(res.data); */
    } catch (error) {
        toast.error('Failed to move card.');
        // fetchBoardData();
    }
  };

  // Inside ListColumns.jsx, before return()

  // Update a card in the correct list
  const onCardUpdate = (updatedCard) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list._id === updatedCard.list
          ? {
              ...list,
              cards: list.cards.map((c) =>
                c._id === updatedCard._id ? updatedCard : c
              ),
            }
          : list
      )
    );
  };

  // Delete a card from the correct list
  const onCardDelete = (cardId) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({
        ...list,
        cards: list.cards.filter((c) => c._id !== cardId),
      }))
    );
  };


  // Drag & drop card handler
 /* const onDropCard = async (targetListId, cardData) => {
    try {
      await newRequest.patch(`/lists/${targetListId}/cards/reorder`, {
        cardId: cardData._id,
        sourceListId: cardData.list, // card must include source list
      });

      setLists((prevLists) => {
        const updatedLists = prevLists.map((list) => {
          if (list._id === cardData.list) {
            return {
              ...list,
              cards: list.cards.filter((c) => c._id !== cardData._id),
            };
          } else if (list._id === targetListId) {
            return {
              ...list,
              cards: [...list.cards, { ...cardData, list: targetListId }],
            };
          }
          return list;
        });
        return updatedLists;
      });
    } catch (err) {
      console.error("Error moving card:", err);
    }
  }; */
  
  /*
  const onDropCard = (targetListId, cardData) => {
    setLists((prev) =>
      prev.map((list) =>
        list._id === targetListId
          ? { ...list, cards: [...list.cards, cardData] }
          : {
              ...list,
              cards: list.cards.filter((c) => c._id !== cardData._id),
            }
      )
    );
  };
  */

  return (
    <>
    <Row className="flex-nowrap overflow-auto gx-3" style={{ minHeight: "80vh", marginRight:'300px' }}>
      {lists.map((list) => (
        <Col key={list._id} xs={10} sm={6} md={4} lg={3}>
          <Card
            className="h-100 list-item"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onDropList(list);
            }}
          >
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                {list.title}
                <div className="list-actions d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => {
                      setEditList(list);
                      setTitle(list.title);
                      setShowModal(true);
                    }}
                  >
                    <BsPencil />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteList(list._id)}
                  >
                    <BsTrash />
                  </Button>
                </div>
              </Card.Title>

              <div
                className="mt-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropList(list)}
              >
                {list.cards.map((card) => (
                  <CardItems
                    key={card._id}
                    card={{ ...card, list: list._id }}
                    onDropCard={onDropCard}
                    setDraggedCard={setDraggedCard}
                    onCardUpdate={onCardUpdate}    // <-- pass update function
                    onCardDelete={onCardDelete}    // <-- pass delete function
                  />
                ))}
              </div>


              <Form.Control
                className="mt-3"
                placeholder="Add card..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    addCardToList(list._id, e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      ))}

      {/* Add New List Column 
      <Col xs={10} sm={6} md={4} lg={3}>
        <Card className="h-100 text-center align-items-center justify-content-center d-flex">
          <Card.Body>
            <Form.Control
              placeholder="New list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              className="mb-2"
            />
            <Button onClick={addNewList}>Add New List</Button>
          </Card.Body>
        </Card>
      </Col>*/}

      {/*<Button
        variant="success"
        onClick={() => {
          setEditList(null);
          setTitle("");
          setShowModal(true);
        }}
      >
        + Add List
      </Button>*/}

      {/* Modal for Add/Edit List */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editList ? "Edit List" : "Add List"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>List Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveList}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      
    </Row>

    <br/>
    </>
  );
}

export default ListColumns;
