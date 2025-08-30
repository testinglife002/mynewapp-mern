import React, { useEffect, useState } from "react";
// import axios from "../../utils/axios";
import "./TodoManagerAlt.css";

export default function TodoManagerAlt({ selectedProjectId }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [draggedId, setDraggedId] = useState(null);

  const fetchTodos = async () => {
    const res = await axios.get(`/todo/project/${selectedProjectId}`);
    setTodos(res.data.sort((a, b) => a.order - b.order));
  };

  const addTodo = async () => {
    const res = await axios.post("/todo", { title, projectId: selectedProjectId });
    setTodos((prev) => [...prev, res.data]);
    setTitle("");
  };

  const addSubtask = async (todoId, subtaskTitle) => {
    const res = await axios.put(`/todo/subtask/${todoId}`, { title: subtaskTitle });
    setTodos((prev) => prev.map((t) => (t._id === todoId ? res.data : t)));
  };

  const handleDragStart = (id) => setDraggedId(id);

  const handleDrop = async (id) => {
    const draggedIndex = todos.findIndex((t) => t._id === draggedId);
    const droppedIndex = todos.findIndex((t) => t._id === id);

    const reordered = [...todos];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(droppedIndex, 0, draggedItem);

    setTodos(reordered);
    await axios.put(`/todo/reorder/${selectedProjectId}`, {
      orderedIds: reordered.map((t) => t._id),
    });
  };

  useEffect(() => {
    if (selectedProjectId) fetchTodos();
  }, [selectedProjectId]);

  return (
    <div className="todo-container">
      <h4 className="mb-3">Todos</h4>
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo"
        />
        <button className="btn btn-primary" onClick={addTodo}>
          Add
        </button>
      </div>

      {todos.map((todo) => (
        <div
          key={todo._id}
          className="card mb-2"
          draggable
          onDragStart={() => handleDragStart(todo._id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(todo._id)}
        >
          <div className="card-body">
            <strong>{todo.title}</strong>

            <div className="subtasks mt-2">
              {todo.subtasks.map((s, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    checked={s.completed}
                    onChange={async () =>
                      await axios.put(`/todo/subtask/toggle/${todo._id}/${i}`)
                        .then(() => fetchTodos())
                    }
                  />
                  <span className={s.completed ? "text-decoration-line-through" : ""}>
                    {s.title}
                  </span>
                </div>
              ))}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const subtaskTitle = e.target.subtask.value;
                  if (subtaskTitle.trim()) addSubtask(todo._id, subtaskTitle);
                  e.target.reset();
                }}
                className="d-flex mt-2"
              >
                <input
                  name="subtask"
                  placeholder="New subtask"
                  className="form-control me-2"
                />
                <button type="submit" className="btn btn-outline-secondary btn-sm">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
