import React, { useEffect, useState } from "react";

import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import newRequest from "../../../utils/newRequest";

const TodosByProject = ({ selectedProjectId }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProjectId) return;
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const res = await newRequest.get(`/todos/project/${selectedProjectId}`);
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to load todos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [selectedProjectId]);

  if (!selectedProjectId) return <p>Select a project to view todos.</p>;
  if (loading) return <Spinner animation="border" />;

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <Card key={todo._id} className="mb-2">
          <Card.Body>
            <Card.Title>{todo.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{todo.priority}</Card.Subtitle>
            <Card.Text>{todo.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TodosByProject;
