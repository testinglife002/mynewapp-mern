import React, { useEffect, useState } from "react";
// import { getNext7Days } from "./getNext7Days";
import { Card, Spinner } from "react-bootstrap";
import newRequest from "../../../../utils/newRequest";
// import { getNext7Days } from "./getNext7Days";

const ThisWeekView = ({ userId }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const next7Days = getNext7Days();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const res = await newRequest.get("/todos");
        setTodos(res.data);
      } catch (err) {
        console.error("Error loading todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  return (
    <div className="p-3">
      <h4>This Week</h4>
      {loading && <Spinner animation="border" />}

      {next7Days.map((day) => {
        const todosForDay = todos.filter((todo) => todo.dueDate?.startsWith(day.date));
        return (
          <div key={day.date} className="mb-4">
            <h6 className="mb-2 text-primary">{day.label}</h6>
            {todosForDay.length > 0 ? (
              todosForDay.map((todo) => (
                <Card key={todo._id} className="mb-2 p-2">
                  <strong>{todo.title}</strong>
                  <div>{todo.description}</div>
                </Card>
              ))
            ) : (
              <p className="text-muted">No tasks</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ThisWeekView;
