// DisplayTodos.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";


const DisplayAllTodos = ({ projectId }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await newRequest.get(`/todos/project/${projectId}`);
        setTodos(res.data);
      } catch (err) {
        console.error("Failed to fetch todos", err);
      }
    };
    if (projectId) {
      fetchTodos();
    }
  }, [projectId]);

  return (
    <ul className="list-group mt-3">
      {todos.map((todo) => (
        <li key={todo._id} className="list-group-item">
          {todo.title}
        </li>
      ))}
    </ul>
  );
};

export default DisplayAllTodos;
