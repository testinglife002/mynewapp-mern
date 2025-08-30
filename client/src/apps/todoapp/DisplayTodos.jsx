import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest"; // Adjust the path if needed
import { Table, Badge } from "react-bootstrap";

const DisplayTodos = ({ projectId }) => {
  const [todos, setTodos] = useState([]);

  

  useEffect(() => {
    if (!projectId) return;

    newRequest
      .get(`/todos?projectId=${projectId}`)
      .then((res) => setTodos(res.data))
      .catch((err) => console.error("Failed to fetch todos:", err));
  }, [projectId]);

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Todos for Selected Project</h4>
      {todos.length === 0 ? (
        <p>No todos found for this project.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Todo</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo._id}>
                <td>{todo.title}</td>
                <td>
                  <Badge bg={todo.completed ? "success" : "warning"}>
                    {todo.completed ? "Completed" : "Pending"}
                  </Badge>
                </td>
                <td>{todo.priority || "Normal"}</td>
                <td>{new Date(todo.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default DisplayTodos;
