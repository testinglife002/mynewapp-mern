import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  ListGroup,
  Badge,
  InputGroup,
} from "react-bootstrap";

const TodoList = ({ selectedProject }) => {
  const [todos, setTodos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    priority: "low",
  });
  const [search, setSearch] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get(
        `/api/todos/project/${selectedProject._id}`
      );
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedProject) fetchTodos();
  }, [selectedProject]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/todos", {
        ...formData,
        projectId: selectedProject._id,
      });
      setShowModal(false);
      setFormData({ title: "", dueDate: "", priority: "low" });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`/api/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h5 className="d-flex justify-content-between align-items-center">
        Todos under <span className="text-primary">{selectedProject?.title}</span>
        <Button size="sm" onClick={() => setShowModal(true)}>
          + Add Todo
        </Button>
      </h5>

      <InputGroup className="mb-2">
        <Form.Control
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <ListGroup>
        {filteredTodos.map((todo) => (
          <ListGroup.Item
            key={todo._id}
            className="d-flex justify-content-between align-items-center"
          >
            <Form.Check
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
              label={
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </span>
              }
            />
            <div className="d-flex gap-2 align-items-center">
              <Badge bg="info">{todo.priority}</Badge>
              <Badge bg="secondary">
                {new Date(todo.dueDate).toLocaleDateString()}
              </Badge>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(todo._id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreate}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TodoList;
