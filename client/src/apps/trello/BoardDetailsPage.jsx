import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import ListColumn from './ListColumn';
import CreateListForm from './CreateListForm';
import CardDetailsModal from './CardDetailsModal';
import ListColumns from './ListColumns';

function BoardDetailsPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const dragListItem = useRef(null);
  const dragOverListItem = useRef(null);

  const dragCard = useRef({ cardId: null, sourceListId: null, originalIndex: null });
  const dragOverCard = useRef({ targetCardId: null, targetListId: null, targetIndex: null });

  const fetchBoardDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const boardRes = await newRequest.get(`/boards/${boardId}`);
       setBoard(boardRes.data);
     {/* setBoard({
        title: "Demo Project",
        lists: [
            {
            _id: "list-1",
            title: "To Do",
            cards: [
                { _id: "card-1", title: "Setup MongoDB" },
                { _id: "card-2", title: "Design schema" },
            ],
            },
            {
            _id: "list-2",
            title: "In Progress",
            cards: [{ _id: "card-3", title: "Build backend routes" }],
            },
            {
            _id: "list-3",
            title: "Done",
            cards: [],
            },
        ],
        }); */}


      const listsRes = await newRequest.get(`/boards/${boardId}/lists`);
      setLists(listsRes.data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load board.');
      if ([403, 404].includes(err.response?.status)) navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardDetails();
  }, [boardId, navigate]);

  const findListById = (id) => lists.find(list => list._id === id);
  const findCardInList = (listId, cardId) => findListById(listId)?.cards.find(card => card._id === cardId);

 const handleCreateList = async (title) => {
  try {
    const { data } = await newRequest.post(`/boards/${boardId}/lists`, { title });
    
    // Manually add an empty cards array for frontend use
    const newList = { ...data, cards: [] };

    setLists(prev => [...prev, newList].sort((a, b) => a.order - b.order));
  } catch (err) {
    console.error('Create list failed:', err);
  }
};


  const handleUpdateList = async (listId, newTitle) => {
    try {
      const { data } = await newRequest.put(`/lists/${listId}`, { title: newTitle });
      setLists(prev => prev.map(list => list._id === listId ? data : list));
    } catch (err) {
      console.error('Update list failed:', err);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list and all its cards?')) return;
    try {
      await newRequest.delete(`/lists/${listId}`);
      setLists(prev => prev.filter(list => list._id !== listId));
    } catch (err) {
      console.error('Delete list failed:', err);
    }
  };

  const handleListDragStart = (e, index) => {
    dragListItem.current = index;
    e.currentTarget.classList.add('dragging');
  };

  const handleListDragEnter = (e, index) => {
    dragOverListItem.current = index;
    e.currentTarget.classList.add('drag-over');
  };

  const handleListDragLeave = (e) => e.currentTarget.classList.remove('drag-over');
  const handleListDragOver = (e) => e.preventDefault();

  const handleListDrop = async (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const copy = [...lists];
    const moved = copy.splice(dragListItem.current, 1)[0];
    copy.splice(dragOverListItem.current, 0, moved);

    setLists(copy);

    try {
      await newRequest.put(`/lists/boards/${boardId}/lists/reorder`, {
        listIdsInOrder: copy.map(l => l._id),
      });
    } catch (err) {
      console.error('Reorder list failed:', err);
      fetchBoardDetails(); // fallback
    } finally {
      dragListItem.current = null;
      dragOverListItem.current = null;
    }
  };

  const handleListDragEnd = () => {
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
  };

  const handleCreateCard = async (listId, title) => {
    try {
      const { data } = await newRequest.post(`/cards/lists/${listId}/cards`, { title });
      setLists(prev =>
        prev.map(list => list._id === listId
          ? { ...list, cards: [...list.cards, data].sort((a, b) => a.order - b.order) }
          : list
        )
      );
    } catch (err) {
      console.error('Create card failed:', err);
    }
  };

  const handleOpenCardDetails = (cardId) => {
    setSelectedCardId(cardId);
    setIsCardModalOpen(true);
  };

  const handleCloseCardDetails = () => {
    setIsCardModalOpen(false);
    setSelectedCardId(null);
    fetchBoardDetails();
  };

  const handleUpdateCard = (updatedCard) => {
    setLists(prev =>
      prev.map(list => ({
        ...list,
        cards: list.cards.map(c => c._id === updatedCard._id ? updatedCard : c).sort((a, b) => a.order - b.order)
      }))
    );
  };

  const handleDeleteCard = async (cardId, listId) => {
    try {
      await newRequest.delete(`/cards/${cardId}`);
      setLists(prev =>
        prev.map(list => list._id === listId
          ? { ...list, cards: list.cards.filter(c => c._id !== cardId) }
          : list
        )
      );
    } catch (err) {
      console.error('Delete card failed:', err);
    }
  };

  const handleCardDragStart = (e, cardId, sourceListId, originalIndex) => {
    dragCard.current = { cardId, sourceListId, originalIndex };
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId, sourceListId }));
    e.currentTarget.classList.add('dragging-card');
  };

  const handleCardDragEnter = (e, targetCardId, targetListId, targetIndex) => {
    e.preventDefault();
    dragOverCard.current = { targetCardId, targetListId, targetIndex };
    if (targetCardId) e.currentTarget.classList.add('drag-over-card');
  };

  const handleCardDragLeave = (e) => e.currentTarget.classList.remove('drag-over-card');
  const handleCardDragOver = (e) => e.preventDefault();

  const handleCardDrop = async (e, destinationListId, dropIndex = null) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over-card');

    const { cardId, sourceListId } = dragCard.current;
    const targetIndex = dropIndex ?? dragOverCard.current.targetIndex ?? 0;

    if (!cardId || !sourceListId || !destinationListId) return;

    const draggedCard = findCardInList(sourceListId, cardId);
    if (!draggedCard) return;

    /*
    const updatedLists = lists.map(list => {
      if (list._id === sourceListId) {
        return { ...list, cards: list.cards.filter(c => c._id !== cardId) };
      } else if (list._id === destinationListId) {
        const cards = [...list.cards];
        cards.splice(targetIndex, 0, { ...draggedCard, list: destinationListId });
        return { ...list, cards };
      }
      return list;
    });
    */

    const updatedLists = lists.map(list => {
        if (list._id === sourceListId) {
            return {
            ...list,
            cards: list.cards.filter(c => c._id !== cardId)
            };
        }

        if (list._id === destinationListId) {
            const updatedCard = { ...draggedCard, list: destinationListId };
            const cards = [...list.cards];
            cards.splice(targetIndex, 0, updatedCard);
            return {
            ...list,
            cards
            };
        }

        return list;
    });


    setLists(updatedLists.map(list => ({
      ...list,
      cards: list.cards.sort((a, b) => a.order - b.order)
    })));

    try {
      if (sourceListId === destinationListId) {
        const cards = updatedLists.find(l => l._id === destinationListId).cards;
        await newRequest.put(`/cards/lists/${destinationListId}/cards/reorder`, {
          cardIdsInOrder: cards.map(c => c._id),
        });
      } else {
        await newRequest.put(`/cards/${cardId}/move`, {
          sourceListId,
          destinationListId,
          newIndex: targetIndex
        });
      }
    } catch (err) {
      console.error('Move card failed:', err);
      fetchBoardDetails();
    } finally {
      dragCard.current = {};
      dragOverCard.current = {};
      await fetchBoardDetails(); // re-fetch everything to ensure correctness
    }
  };

  const handleCardDragEnd = () => {
    document.querySelectorAll('.dragging-card, .drag-over-card').forEach(el =>
      el.classList.remove('dragging-card', 'drag-over-card')
    );
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading board...</div>;
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;

  // console.log(board.owner);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundColor: board?.background?.startsWith('#') ? board.background : undefined,
        backgroundImage: board?.background?.startsWith('http') ? `url(${board.background})` : undefined,
      }}
    >
      <header className="flex justify-between items-center p-4 mb-4 rounded-lg bg-black bg-opacity-20 text-white">
        <h1 className="text-3xl font-bold">{board.name}</h1>
        <div className="flex space-x-4">
          <span>Owner: {board.owner?.username}</span>
          
          <button
            onClick={() => navigate('/trello-board')}
            className="pull-right bg-gray-700 hover:bg-gray-600 px-4  rounded-md"
          >
            Back
          </button>
        </div>
      </header>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {lists.map((list, index) => (
        <>    
          <div
            key={list._id}
            draggable
            onDragStart={(e) => handleListDragStart(e, index)}
            onDragEnter={(e) => handleListDragEnter(e, index)}
            onDragLeave={handleListDragLeave}
            onDragOver={handleListDragOver}
            onDrop={handleListDrop}
            onDragEnd={handleListDragEnd}
            className="min-w-[280px] bg-gray-100 rounded-lg shadow-md p-3"
          >
            <ListColumn
              list={list}
              onUpdateList={handleUpdateList}
              onDeleteList={handleDeleteList}
              onCreateCard={handleCreateCard}
              onOpenCardDetails={handleOpenCardDetails}
              onCardDragStart={handleCardDragStart}
              onCardDragEnter={handleCardDragEnter}
              onCardDragLeave={handleCardDragLeave}
              onCardDrop={handleCardDrop}
              onCardDragOver={handleCardDragOver}
              onCardDragEnd={handleCardDragEnd}
            />
          </div>

          {/*<div fluid className="p-3">
            <h2 className="mb-4">{board.title}</h2>
            <ListColumns board={board} />
          </div>*/}
        </>
        ))}

        W
        {<div fluid className="p-3">
        <h2 className="mb-4">{board.title}</h2>
        <ListColumns board={board} />
        </div>}

        <div className="min-w-[280px] bg-gray-200 bg-opacity-80 rounded-lg p-3">
          <CreateListForm onCreateList={handleCreateList} />
        </div>
      </div>

      {isCardModalOpen && selectedCardId && (
        <CardDetailsModal
          isOpen={isCardModalOpen}
          onClose={handleCloseCardDetails}
          cardId={selectedCardId}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          boardMembers={board.members}
        />
      )}
    </div>
  );
}

export default BoardDetailsPage;
