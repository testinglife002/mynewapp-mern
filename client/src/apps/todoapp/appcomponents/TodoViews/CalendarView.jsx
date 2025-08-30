// components/views/CalendarView.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css';
import newRequest from '../../../../utils/newRequest';
import TodoCard from '../TodoCard';
import './CalendarView.css';

const CalendarView = () => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchAllTodos = async () => {
      try {
        const res = await newRequest.get('/todos');
        setTodos(res.data);
      } catch (err) {
        console.error('Error fetching todos for calendar:', err);
      }
    };
    fetchAllTodos();
  }, []);

  // Group todos by formatted 'YYYY-MM-DD'
  const groupedByDate = todos.reduce((acc, todo) => {
    const dateKey = todo.dueDate ? dayjs(todo.dueDate).format('YYYY-MM-DD') : 'No Due Date';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(todo);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dateKey = dayjs(date).format('YYYY-MM-DD');
    const dayTodos = groupedByDate[dateKey] || [];
    if (dayTodos.length === 0) return null;

    return (
      <div className="tile-todo-count">
        <span className="badge bg-primary">{dayTodos.length}</span>
      </div>
    );
  };

  const selectedKey = dayjs(selectedDate).format('YYYY-MM-DD');
  const todosForSelectedDate = groupedByDate[selectedKey] || [];

  return (
    <div className="calendar-container">
      <h4 className="mb-3">📆 Calendar View</h4>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
      />

      <div className="mt-4">
        <h5>Todos on {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}:</h5>
        {todosForSelectedDate.length > 0 ? (
          todosForSelectedDate.map((todo) => (
            <TodoCard key={todo._id} todo={todo} />
          ))
        ) : (
          <p className="text-muted">No todos for this date.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
