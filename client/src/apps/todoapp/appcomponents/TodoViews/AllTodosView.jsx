import React, { useEffect, useState } from 'react';
import newRequest from '../../../../utils/newRequest';
import TodoCard from '../TodoCard';
import DisplayTodos from '../DisplayTodos';

const AllTodosView = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchAllTodos = async () => {
      try {
        const res = await newRequest.get('/todos');
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching all todos:', err);
      }
    };
    fetchAllTodos();
  }, []);

  return (
    <div>
      {/*<h4 className="mb-3">📋 All Todos</h4>
      {todos.length === 0 ? (
        <p>No todos available.</p>
      ) : (
        todos.map((todo) => <TodoCard key={todo._id} todo={todo} />)
      )} */}

      <DisplayTodos />
    </div>
  );
};

export default AllTodosView;
