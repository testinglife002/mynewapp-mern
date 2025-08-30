import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import newRequest from "../../../../utils/newRequest";
import { Card, Modal } from "react-bootstrap";

const CalendarView = () => {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalTodos, setModalTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await newRequest.get("/todos");
      setTodos(res.data);
    };
    fetchTodos();
  }, []);

  const tileContent = ({ date }) => {
    const formatted = date.toISOString().split("T")[0];
    const tasks = todos.filter((t) => t.dueDate?.startsWith(formatted));
    return tasks.length > 0 ? <span className="badge bg-primary">{tasks.length}</span> : null;
  };

  const handleDateClick = (date) => {
    const formatted = date.toISOString().split("T")[0];
    const dayTodos = todos.filter((t) => t.dueDate?.startsWith(formatted));
    setModalTodos(dayTodos);
    setSelectedDate(date);
  };

  return (
    <div className="p-3">
      <h4>Calendar View</h4>
      <Calendar onClickDay={handleDateClick} tileContent={tileContent} />

      <Modal show={!!selectedDate} onHide={() => setSelectedDate(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Todos for {selectedDate?.toDateString()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTodos.length > 0 ? (
            modalTodos.map((todo) => (
              <Card key={todo._id} className="mb-2 p-2">
                <strong>{todo.title}</strong>
                <div>{todo.description}</div>
              </Card>
            ))
          ) : (
            <p className="text-muted">No tasks for this day</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CalendarView;
