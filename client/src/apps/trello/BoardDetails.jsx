// client/src/pages/BoardDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ListColumn from './ListColumn';

function BoardDetails() {
  const { boardId } = useParams();
  
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);

  // Fetch board data
  useEffect(() => {
    const fetchBoardDetails = async () => {
      try {
        const res = await axios.get(`/api/boards/${boardId}`);
        setBoard(res.data);
        setLists(res.data.lists || []);
      } catch (err) {
        console.error('Failed to fetch board:', err);
      }
    };

    fetchBoardDetails();
  }, [boardId]);

  const handleCreateCard = async (listId, title) => {
    try {
      const res = await axios.post(`/api/cards`, { title, listId });
      const updatedLists = lists.map((list) =>
        list._id === listId ? { ...list, cards: [...list.cards, res.data] } : list
      );
      setLists(updatedLists);
    } catch (err) {
      console.error('Error creating card:', err);
    }
  };

  const handleUpdateListTitle = async (listId, newTitle) => {
    try {
      await axios.put(`/api/lists/${listId}`, { title: newTitle });
      setLists((prev) =>
        prev.map((list) => (list._id === listId ? { ...list, title: newTitle } : list))
      );
    } catch (err) {
      console.error('Error updating list title:', err);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return;
    try {
      await axios.delete(`/api/lists/${listId}`);
      setLists((prev) => prev.filter((list) => list._id !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  return (
    <div className="p-4">
      {board ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{board.name}</h2>
          <div className="flex overflow-x-auto space-x-4">
            {lists.map((list, index) => (
              <ListColumn
                key={list._id}
                list={list}
                listIndex={index}
                onUpdateList={handleUpdateListTitle}
                onDeleteList={handleDeleteList}
                onCreateCard={handleCreateCard}
                // Pass empty drag props for now or implement drag logic later
                onOpenCardDetails={() => {}}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Loading board...</p>
      )}
    </div>
  );
}

export default BoardDetails;
