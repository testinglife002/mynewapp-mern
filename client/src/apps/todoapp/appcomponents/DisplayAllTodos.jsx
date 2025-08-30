// DisplayAllTodos.jsx
import React, { useEffect, useState } from 'react';
import TodoCard from './TodoCard';
import TodoDetailsModal from './TodoDetailsModal';

import { Container } from 'react-bootstrap';
import newRequest from '../../../utils/newRequest';
import { scheduleRemindersForTodo } from '../../../utils/reminderScheduler';

const DisplayAllTodos = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);

  const fetchTodos = async () => {
    const res = await newRequest.get('/todos/my-todos');
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
    // todos.forEach(todo => {
    //   scheduleRemindersForTodo(todo);
    // });
  }, []);

  const handleUpdatedTodo = (updated) => {
    if (updated === null) {
      // deleted
      setTodos(todos.filter((t) => t._id !== selectedTodo._id));
    } else {
      setTodos(todos.map((t) => t._id === updated._id ? updated : t));
    }
  };

  return (
    <Container className="mt-3">
      {todos.map((todo) => (
        <TodoCard key={todo._id} todo={todo} onShowDetails={setSelectedTodo} />
      ))}
      {selectedTodo && (
        <TodoDetailsModal
          show={!!selectedTodo}
          todo={selectedTodo}
          onHide={() => setSelectedTodo(null)}
          onTodoUpdated={handleUpdatedTodo}
        />
      )}
    </Container>
  );
};

export default DisplayAllTodos;
