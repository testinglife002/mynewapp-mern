// client/src/pages/BoardDetailsPageAlt.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import newRequest from '../../utils/newRequest';
import ListColumns from './ListColumns';
import ActivityFeeds from './ActivityFeeds';

function BoardDetailsPageAlt() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [newListTitle, setNewListTitle] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [draggedCard, setDraggedCard] = useState(null);

  // ✅ Move fetchBoard outside useEffect so it's reusable
  
  const fetchBoard = async () => {
    try {
      const res = await newRequest.get(`/boards/${boardId}`);
      // setBoard(res.data.board);
      setBoard(res.data);
      setLists(res.data.lists);
      // console.log(res.data);  
    } catch (err) {
      console.error('Failed to fetch board:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      // const res = await newRequest.get(`/users`);
      const res = await newRequest.get("/users/allusers"); // Assume this exists
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };
  

  // Fetch board + users
  /* useEffect(() => {
    const fetchData = async () => {
      const boardRes = await newRequest.get(`/boards/${boardId}`);
      setBoard(boardRes.data);
      setLists(boardRes.data.lists);
      const usersRes = await newRequest.get("/users");
      setUsers(usersRes.data);
    };
    fetchData();
  }, [boardId]);*/

   useEffect(() => {
    fetchBoard();
     fetchUsers();
  }, [boardId]);

  // console.log(board?.members);

  // ✅ Add member
  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      const res = await newRequest.put(`/boards/${boardId}/members`, {
        email: selectedUser,
      });
      setBoard((prev) => ({ ...prev, members: res.data }));
      // setSelectedUser("");
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  // ✅ Remove member
  const handleRemoveMember = async (memberId) => {
    try {
      await newRequest.delete(`/boards/${boardId}/members/${memberId}`);
      setBoard((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m._id !== memberId),
      }));
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  // ✅ Edit board
  const handleEditBoard = async () => {
    try {
      const res = await newRequest.put(`/boards/${boardId}`, {
        name: board.name,
        description: board.description,
      });
      setBoard(res.data);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update board:", err);
    }
  };

  // ✅ Delete board
  const handleDeleteBoard = async () => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await newRequest.delete(`/boards/${boardId}`);
      navigate("/boards");
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await newRequest.post(`/boards/${boardId}/lists`, {
        boardId,
        title: newListTitle.trim(),
      });
      setLists((prev) => [...prev, { ...res.data, cards: [] }]);
      setNewListTitle('');
    } catch (err) {
      console.error('Create list error:', err);
    }
  };

  const handleDropOnCard = async (targetCard) => {
    if (!draggedCard || draggedCard._id === targetCard._id) return;
    if (draggedCard.list !== targetCard.list) return;

    try {
      await newRequest.patch(`/lists/${draggedCard.list}/cards/reorder`, {
        cardId: draggedCard._id,
        targetCardId: targetCard._id,
        position: 'before',
      });
      fetchBoard();
    } catch (err) {
      console.error('Reordering cards failed', err);
    }
  };

  const handleDropOnList = async (targetList) => {
    if (!draggedCard || draggedCard.list === targetList._id) return;

    try {
      await newRequest.put(`/cards/${draggedCard._id}/move`, {
        newListId: targetList._id,
      });
      fetchBoard();
    } catch (err) {
      console.error('Moving card failed', err);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="container mt-4">
      
      {/* Board header with Edit/Delete */}
      <div className="d-flex justify-content-between align-items-center">
       Board: {board?.name}
       <p className="text-muted">{board?.description}</p>
      </div>
      

      {/* Members Section */}
      <Card className="p-3 mb-4">
        <h5>Members</h5>
        <Row>
          <Col md={6}>
            <Form.Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select user...</option>
              {users.map((u) => (
                <option key={u._id} value={u.email}>
                  {u.username} ({u.email})
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Button onClick={handleAddMember} disabled={!selectedUser}>
              Add Member
            </Button>
          </Col>
        </Row>

        <ul className="mt-3 list-unstyled">
          {board.members?.map((m) => (
            <li key={m._id} className="d-flex justify-content-between">
             {m?.username} ({m?.email})   {/* ✅ will now work */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveMember(m._id)}
              >
                ❌
              </Button>
            </li>
          ))}
        </ul>

      </Card>

      {/* Add new list */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="New list title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
        />
        <Button className='pull-right' variant="primary" onClick={handleCreateList}>
          + Add List
        </Button>
      </div>
      <br/>

      <h2>{board?.title}</h2>

      <div className="d-flex flex-row overflow-auto gap-3 mt-3">

        {<ListColumns boardId={boardId} />}
        {/*<ListColumns
          // lists={lists}
          boardId={boardId}
          onDropCard={handleDropOnCard}
          onDropList={handleDropOnList}
          setDraggedCard={setDraggedCard}
        />*/}

        

        
      </div>


      <div className='pull-right' style={{marginLeft:'550px', marginTop:'-450px', maxWidth:'280px'}}>
          {/*<ActivityFeed activity={activity} />*/}
          {<ActivityFeeds board={board}  />}
        </div>
      
    </div>
  );
}

export default BoardDetailsPageAlt;
