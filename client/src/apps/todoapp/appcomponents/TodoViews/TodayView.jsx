import React, { useEffect, useState } from 'react';
import newRequest from '../../../../utils/newRequest';
import TodoCard from '../TodoCard';


const TodayView = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodayTodos = async () => {
      try {
        const res = await newRequest.get('/todos/today');
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching today’s todos:', err);
      }
    };
    fetchTodayTodos();
  }, []);

  return (
    <div>
      <h4 className="mb-3">🗓️ Today’s Todos</h4>
      {todos.length === 0 ? (
        <p>No todos due today.</p>
      ) : (
        todos.map((todo) => <TodoCard key={todo._id} todo={todo} />)
      )}
    </div>
  );
};

export default TodayView;
