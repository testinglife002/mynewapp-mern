import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Modal, Card, Row, Col, Badge, InputGroup } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaSearch } from "react-icons/fa";
import { useTheme } from "@emotion/react";

const TodoManager = ({ selectedProjectId }) => {
  const [todos, setTodos] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", status: "pending", dueDate: "", priority: "low" });
  const [recurrence, setRecurrence] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });

  useEffect(() => {
    if (selectedProjectId) fetchTodos();
  }, [selectedProjectId]);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(`/api/todo/project/${selectedProjectId}`);
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        await axios.put(`/api/todo/${editingId}`, form);
      } else {
        await axios.post("/api/todo", { ...form, projectId: selectedProjectId });
      }
      setForm({ title: "", status: "pending", dueDate: "", priority: "low" });
      setEditingId(null);
      setShow(false);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (todo) => {
    setForm(todo);
    setEditingId(todo._id);
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this todo?")) {
      try {
        await axios.delete(`/api/todo/${id}`);
        fetchTodos();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (todo) => {
    try {
      await axios.put(`/api/todo/${todo._id}`, { ...todo, status: todo.status === "done" ? "pending" : "done" });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    return (
      (filters.status ? todo.status === filters.status : true) &&
      (filters.priority ? todo.priority === filters.priority : true) &&
      (filters.search ? todo.title.toLowerCase().includes(filters.search.toLowerCase()) : true)
    );
  });

  return (
    <div className="mt-4">
      <h5>Todos</h5>

      {/* Filters */}
      <Row className="mb-3">
        <Col md={2}>
          <Form.Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Status</option>
            <option value="pending">Pending</option>
            <option value="done">Completed</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </Form.Select>
        </Col>
        <Col md={2}>
            <Form.Group>
            <Form.Label>Repeat</Form.Label>
            <Form.Select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </Form.Select>
            </Form.Group>
        </Col>
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search todos..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={() => setShow(true)}>
            <FaPlus /> Add Todo
          </Button>
        </Col>
      </Row>

      {/* Todo List */}
      <Row xs={1} md={2} lg={3}>
        {filteredTodos.map((todo) => (
          <Col key={todo._id} className="mb-3">
            <Card className={todo.status === "done" ? "bg-light text-muted" : ""}>
              <Card.Body>
                <Card.Title>
                  <input
                    type="checkbox"
                    checked={todo.status === "done"}
                    onChange={() => handleToggleStatus(todo)}
                    className="me-2"
                  />
                  {todo.title}
                  <Badge bg="secondary" className="ms-2">{todo.priority}</Badge>
                </Card.Title>
                <Card.Text>
                  <small>Due: {new Date(todo.dueDate).toLocaleDateString()}</small>
                </Card.Text>
                <Button size="sm" variant="outline-secondary" onClick={() => handleEdit(todo)} className="me-2">
                  <FaEdit />
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(todo._id)}>
                  <FaTrash />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit" : "Add"} Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2" >
            <Form.Label>Repeat</Form.Label>
            <Form.Select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                <option value="">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateOrUpdate}>{editingId ? "Update" : "Create"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TodoManager;
