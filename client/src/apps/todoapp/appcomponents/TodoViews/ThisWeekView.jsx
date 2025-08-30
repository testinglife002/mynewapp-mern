import React, { useEffect, useState } from "react";
import newRequest from "../../../../utils/newRequest";
import TodoCard from "../TodoCard";
import { format, parseISO } from "date-fns";

const ThisWeekView = () => {
  const [todosByDay, setTodosByDay] = useState({});

  useEffect(() => {
    const fetchThisWeekTodos = async () => {
      try {
        const res = await newRequest.get("/todos/next-7-days");
        setTodosByDay(res.data);
      } catch (err) {
        console.error("Error fetching this week’s todos:", err);
      }
    };
    fetchThisWeekTodos();
  }, []);

  return (
    <div className="p-3">
      <h4 className="mb-4">📅 Todos This Week</h4>

      {Object.entries(todosByDay).map(([dateStr, todos]) => {
        const parsedDate = parseISO(dateStr);
        const formatted = format(parsedDate, "EEEE, MMM d"); // Tuesday, Jul 30

        return (
          <div key={dateStr} className="mb-4">
            <h5 className="text-primary border-bottom pb-1">{formatted}</h5>
            {todos.length === 0 ? (
              <p className="text-muted ms-3">No todos</p>
            ) : (
              todos.map((todo) => (
                <div className="ms-3" key={todo._id}>
                  <TodoCard todo={todo} />
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ThisWeekView;
