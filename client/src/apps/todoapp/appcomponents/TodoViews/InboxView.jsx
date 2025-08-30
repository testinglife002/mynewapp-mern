import React, { useEffect, useState } from 'react';
import newRequest from '../../../../utils/newRequest';
import TodoCard from '../TodoCard';

const InboxView = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchInboxTodos = async () => {
      try {
        // const res = await newRequest.get('/todos?inbox=true');
        const res = await newRequest.get('/marked');
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching inbox todos:', err);
      }
    };
    fetchInboxTodos();
  }, []);

  return (
    <div>
      <h4 className="mb-3">📥 Inbox</h4>
      {todos.length === 0 ? (
        <p>No todos in inbox.</p>
      ) : (
        todos.map((todo) => <TodoCard key={todo._id} todo={todo} />)
      )}
    </div>
  );
};

export default InboxView;
