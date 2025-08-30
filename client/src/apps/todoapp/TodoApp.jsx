import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import AppNavbar from './AppNavbar';
import Sidebar from './Sidebar';
import TodoList from './TodoList';
import newRequest from '../../utils/newRequest';
import DisplayAllTodos from './DisplayAllTodos';
import DisplayTodos from './DisplayTodos';
import TodoManager from './TodoManager';
import TodoManagerAlt from './TodoManagerAlt';



const TodoApp = ({user}) => {

   // const [user, setUser] = useState(JSON.parse(localStorage.getItem('currentUser')))
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    try {
      const res = await newRequest.get("/dashboard-stats");
       console.log("response:", res.data); // ← add this
      setStats(res.data); // assuming res.data.tasks is the array
      console.log(stats);
    } catch (err) {
      console.error("Error loading todos:", err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    // api.get("/dashboard-stats").then(res => setStats(res.data));
     fetchStats();
  }, []);

  return (
    <>
      <AppNavbar
        user={user}

      />
      <Container fluid className="p-0">
        <Row noGutters>
          {user && (
            <Col md={2}>
              <Sidebar />
            </Col>
          )}

          <Col md={user ? 10 : 12}>

          <TodoList />

          <DisplayTodos />

          </Col>

          <DisplayAllTodos />

          <TodoManager />
          <TodoManagerAlt />

          <Card>
            <Card.Body>
              <Card.Title>Total Projects</Card.Title>
              <h2>{stats.totalProjects}</h2>
              <h2>{stats[0]}</h2>
            </Card.Body>
          </Card>

        </Row>
      </Container>
    </>
  );
};

export default TodoApp;
