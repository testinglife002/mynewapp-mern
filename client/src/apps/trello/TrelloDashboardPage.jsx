// client/src/pages/TrelloDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Spinner } from 'react-bootstrap';
import { PlusLg, BoxArrowRight } from 'react-bootstrap-icons';
import BoardList from './BoardList';
import CreateBoardModal from './CreateBoardModal';
import newRequest from '../../utils/newRequest';

function TrelloDashboardPage({ user }) {
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) fetchBoards();
  }, [user]);

  const fetchBoards = async () => {
    setLoadingBoards(true);
    try {
      const { data } = await newRequest.get('/boards');
      setBoards(data);
    } catch (err) {
      console.error('Failed to fetch boards:', err.response?.data?.message || err.message);
    } finally {
      setLoadingBoards(false);
    }
  };

  console.log(boards);

  const handleCreateBoard = async (boardData) => {
    try {
      const { data } = await newRequest.post('/boards', boardData);
      setBoards((prev) => [...prev, data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create board:', err.response?.data?.message || err.message);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm('Are you sure you want to delete this board and all its contents?')) return;
    try {
      await newRequest.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
    } catch (err) {
      console.error('Failed to delete board:', err.response?.data?.message || err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar bg="white" expand="lg" className="shadow-sm py-3 px-4">
        <Container fluid>
          <Navbar.Brand
            href="/"
            className="text-xl font-bold text-gray-800"
          >
            Your Boards
          </Navbar.Brand>

            <div className="flex items-center gap-3">
              {user && (
                <span className="text-gray-600 font-medium">
                  Welcome, {user?.username}!
                </span>
              )}
            </div>

          <Navbar.Collapse className="justify-content-end">
            
              <div className="justify-content-end" >
                <Button
                variant="primary"
                className="d-flex align-items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusLg size={16} />
                <span>Create Board</span>
              </Button>
              {/*<Button
                variant="outline-danger"
                className="d-flex align-items-center gap-2"
                // onClick={() => {
                  // TODO: hook logout logic
                //   console.log('Logout handler not implemented');
                // }}
              >
                <BoxArrowRight size={16} />
                <span>Logout</span>
              </Button>*/}
              </div>
            
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        {loadingBoards ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" role="status" aria-hidden="true" />
            <span className="ms-3 text-gray-600 text-lg">Loading boards...</span>
          </div>
        ) : (
          <BoardList boards={boards} onDeleteBoard={handleDeleteBoard} />
        )}
      </Container>

     

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBoard={handleCreateBoard}
      />
    </div>
  );
}

export default TrelloDashboardPage;
