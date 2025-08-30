
// TodosDetailsModal.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Table,
  ProgressBar,
} from "react-bootstrap";
import newRequest from "../../../utils/newRequest";
import useCountdownWithReminder from "../../../utils/useCountdownWithReminder";

const TodosDetailsModal = ({ show, onHide, todo, refreshTodos }) => {
  const [formData, setFormData] = useState({ ...todo });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);

  const [showSubtodoModal, setShowSubtodoModal] = useState(false);
  const [subtodo, setSubtodo] = useState({
    title: "",
    priority: "medium",
    completed: false,
  });

  // Drag & drop refs
  const dragItem = useRef();
  const dragOverItem = useRef();

  const targetDate = todo.start || todo.dueDate;
  const reminders = todo.reminders || [];
  const countdown = useCountdownWithReminder(targetDate, reminders);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await newRequest.get("/todos/tags-only");
        const uniqueTags = [...new Set(res.data)];
        setTagSuggestions(uniqueTags);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (
      trimmed &&
      !formData.tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const completedCount = formData.subtodos.filter((st) => st.completed).length;
      const totalCount = formData.subtodos.length;
      const completedPercent =
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

      await newRequest.put(`/todos/${todo._id}`, {
        ...formData,
        completedPercent,
        completed: formData.completed || formData.status === "done",
      });
      refreshTodos();
      onHide();
    } catch (err) {
      console.error("Failed to update todo", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      setLoading(true);
      await newRequest.delete(`/todos/${todo._id}`);
      refreshTodos();
      onHide();
    } catch (err) {
      console.error("Failed to delete todo", err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (priority, completed) => {
    if (completed) return "success";
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    return "secondary";
  };

  const getRowStyle = (priority) => {
    switch (priority) {
      case "high":
        return { backgroundColor: "#f8d7da" };
      case "medium":
        return { backgroundColor: "#fff3cd" };
      case "low":
        return { backgroundColor: "#e2e3e5" };
      default:
        return {};
    }
  };

  // Subtodo logic
  const handleSubtodoChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSubtodo({ ...subtodo, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddSubtodo = () => {
    if (!subtodo.title.trim()) return alert("Subtodo title is required");
    setFormData({
      ...formData,
      subtodos: [...formData.subtodos, { ...subtodo }],
    });
    setSubtodo({ title: "", priority: "medium", completed: false });
    setShowSubtodoModal(false);
  };

  const handleRemoveSubtodo = (index) => {
    const subtodos = [...formData.subtodos];
    subtodos.splice(index, 1);
    setFormData({ ...formData, subtodos });
  };

  // ✅ Inline edit for subtodo (same as CreateTodo)
  const handleSubtodoInlineChange = (index, field, value) => {
    const subtodos = [...formData.subtodos];
    subtodos[index] = { ...subtodos[index], [field]: value };
    setFormData({ ...formData, subtodos });
  };

  // Drag & drop handlers
  const handleDragStart = (index) => {
    dragItem.current = index;
  };
  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = () => {
    const items = [...formData.subtodos];
    const draggedItemContent = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFormData({ ...formData, subtodos: items });
  };

  const completedCount = formData.subtodos.filter((st) => st.completed).length;
  const totalCount = formData.subtodos.length;
  const completedPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Countdown */}
          {targetDate && countdown.totalMs > 0 ? (
            <p className="text-success small">
              ⏳ Starts in: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
            </p>
          ) : (
            <p className="text-danger small">✅ Started or overdue</p>
          )}

          {/* Main form */}
          <Form>
            <Row>
              <Col md={8}>
                {/* Title */}
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control name="title" value={formData.title} onChange={handleChange} />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Status */}
                <Form.Group className="mb-2">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Check type="checkbox" name="completed" checked={formData.completed} onChange={handleChange} label="Mark as Completed" />
                <Form.Check type="checkbox" name="marked" checked={formData.marked} onChange={handleChange} label="Mark as Important" />

                {/* Tags */}
                <Form.Group className="mb-2 mt-2">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {formData.tags?.map((tag) => (
                      <Badge key={tag} bg="secondary">
                        {tag}
                        <Button variant="link" size="sm" className="ms-1 text-white" onClick={() => handleTagRemove(tag)}>×</Button>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <h5>
                    <Badge bg={getBadgeVariant(formData.priority, formData.completed)}>
                      {formData.completed ? "Completed" : formData.priority}
                    </Badge>
                  </h5>
                </Form.Group>

                <Form.Group className="mb-2 mt-2">
                  <Form.Label>Color Label</Form.Label>
                  <Form.Control type="color" name="color" value={formData.color} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Reminder</Form.Label>
                  <Form.Control type="date" name="reminder" value={formData.reminder || ""} onChange={handleChange} />
                </Form.Group>

                <Button variant="danger" className="w-100" onClick={handleDelete} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Delete Todo"}
                </Button>
              </Col>
            </Row>
          </Form>

          <hr />

          {/* Subtodos section */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Subtodos</h5>
            <Button size="sm" onClick={() => setShowSubtodoModal(true)}>+ Add Subtodo</Button>
          </div>

          <ProgressBar now={completedPercent} label={`${completedPercent}%`} variant={completedPercent === 100 ? "success" : "info"} className="mb-2" />

          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>Drag</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Done</th>
                <th>Status</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {formData.subtodos?.map((st, i) => (
                <tr
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  style={getRowStyle(st.priority)}
                >
                  <td style={{ cursor: "grab", textAlign: "center" }}>☰</td>
                  <td>
                    <Form.Control
                      value={st.title}
                      onChange={(e) => handleSubtodoInlineChange(i, "title", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={st.priority}
                      onChange={(e) => handleSubtodoInlineChange(i, "priority", e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={st.completed}
                      onChange={(e) => handleSubtodoInlineChange(i, "completed", e.target.checked)}
                    />
                  </td>
                  <td>
                    <Badge bg={getBadgeVariant(st.priority, st.completed)}>
                      {st.completed ? "Completed" : st.priority}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="danger" size="sm" onClick={() => handleRemoveSubtodo(i)}>×</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Subtodo Modal */}
      <Modal show={showSubtodoModal} onHide={() => setShowSubtodoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subtodo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={subtodo.title} onChange={handleSubtodoChange} placeholder="Subtodo title" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select name="priority" value={subtodo.priority} onChange={handleSubtodoChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>
          <Form.Check type="checkbox" name="completed" checked={subtodo.completed} onChange={handleSubtodoChange} label="Completed" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubtodoModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSubtodo}>Add Subtodo</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodosDetailsModal;


/*
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Spinner,
  Table,
  ProgressBar,
} from "react-bootstrap";
import newRequest from "../../../utils/newRequest";
import useCountdownWithReminder from "../../../utils/useCountdownWithReminder";

const TodosDetailsModal = ({ show, onHide, todo, refreshTodos }) => {
  const [formData, setFormData] = useState({ ...todo });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);

  const [showSubtodoModal, setShowSubtodoModal] = useState(false);
  const [subtodo, setSubtodo] = useState({
    title: "",
    priority: "medium",
    completed: false,
  });

  const dragItem = useRef();
  const dragOverItem = useRef();

  const targetDate = todo.start || todo.dueDate;
  const reminders = todo.reminders || [];
  const countdown = useCountdownWithReminder(targetDate, reminders);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await newRequest.get("/todos/tags-only");
        const uniqueTags = [...new Set(res.data)];
        setTagSuggestions(uniqueTags);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (
      trimmed &&
      !formData.tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const completedCount = formData.subtodos.filter((st) => st.completed).length;
      const totalCount = formData.subtodos.length;
      const completedPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

      await newRequest.put(`/todos/${todo._id}`, {
        ...formData,
        completedPercent,
        completed: formData.completed || formData.status === "done",
      });
      refreshTodos();
      onHide();
    } catch (err) {
      console.error("Failed to update todo", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this todo?")) return;
    try {
      setLoading(true);
      await newRequest.delete(`/todos/${todo._id}`);
      refreshTodos();
      onHide();
    } catch (err) {
      console.error("Failed to delete todo", err);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (priority, completed) => {
    if (completed) return "success";
    if (priority === "high") return "danger";
    if (priority === "medium") return "warning";
    return "secondary";
  };

  const getRowStyle = (priority) => {
    switch (priority) {
      case "high":
        return { backgroundColor: "#f8d7da" };
      case "medium":
        return { backgroundColor: "#fff3cd" };
      case "low":
        return { backgroundColor: "#e2e3e5" };
      default:
        return {};
    }
  };

  // Subtodo logic
  const handleSubtodoChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSubtodo({ ...subtodo, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddSubtodo = () => {
    if (!subtodo.title.trim()) return alert("Subtodo title is required");
    setFormData({
      ...formData,
      subtodos: [...formData.subtodos, { ...subtodo }],
    });
    setSubtodo({ title: "", priority: "medium", completed: false });
    setShowSubtodoModal(false);
  };

  const handleRemoveSubtodo = (index) => {
    const subtodos = [...formData.subtodos];
    subtodos.splice(index, 1);
    setFormData({ ...formData, subtodos });
  };

  const handleSubtodoInlineChange = (index, field, value) => {
    const subtodos = [...formData.subtodos];
    subtodos[index] = { ...subtodos[index], [field]: value };
    setFormData({ ...formData, subtodos });
  };

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const items = [...formData.subtodos];
    const draggedItemContent = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFormData({ ...formData, subtodos: items });
  };

  const completedCount = formData.subtodos.filter((st) => st.completed).length;
  const totalCount = formData.subtodos.length;
  const completedPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {targetDate && countdown.totalMs > 0 ? (
            <p className="text-success small">
              ⏳ Starts in: {countdown.days}d {countdown.hours}h{" "}
              {countdown.minutes}m {countdown.seconds}s
            </p>
          ) : (
            <p className="text-danger small">✅ Started or overdue</p>
          )}

          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Completed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Check
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  label="Mark as Completed"
                />

                <Form.Check
                  type="checkbox"
                  name="marked"
                  checked={formData.marked}
                  onChange={handleChange}
                  label="Mark as Important"
                />

                <Form.Group className="mb-2 mt-2">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {formData.tags?.map((tag) => (
                      <Badge key={tag} bg="secondary">
                        {tag}{" "}
                        <Button
                          variant="link"
                          size="sm"
                          className="ms-1 text-white"
                          onClick={() => handleTagRemove(tag)}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <h5>
                    <Badge
                      bg={getBadgeVariant(formData.priority, formData.completed)}
                    >
                      {formData.completed ? "Completed" : formData.priority}
                    </Badge>
                  </h5>
                </Form.Group>

                <Form.Group className="mb-2 mt-2">
                  <Form.Label>Color Label</Form.Label>
                  <Form.Control
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Reminder</Form.Label>
                  <Form.Control
                    type="date"
                    name="reminder"
                    value={formData.reminder || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  variant="danger"
                  className="w-100"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Delete Todo"}
                </Button>
              </Col>
            </Row>
          </Form>

          <hr />

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Subtodos</h5>
            <Button size="sm" onClick={() => setShowSubtodoModal(true)}>
              + Add Subtodo
            </Button>
          </div>

         
          <ProgressBar
            now={completedPercent}
            label={`${completedPercent}%`}
            variant={completedPercent === 100 ? "success" : "info"}
            className="mb-2"
          />

          <Table bordered hover size="sm">
            <thead>
              <tr>
                <th>Drag</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Done</th>
                <th>Status</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {formData.subtodos?.map((st, i) => (
                <tr
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  style={getRowStyle(st.priority)}
                >
                  <td style={{ cursor: "grab", textAlign: "center" }}>☰</td>
                  <td>
                    <Form.Control
                      value={st.title}
                      onChange={(e) =>
                        handleSubtodoInlineChange(i, "title", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={st.priority}
                      onChange={(e) =>
                        handleSubtodoInlineChange(i, "priority", e.target.value)
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </td>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={st.completed}
                      onChange={(e) =>
                        handleSubtodoInlineChange(i, "completed", e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <Badge bg={getBadgeVariant(st.priority, st.completed)}>
                      {st.completed ? "Completed" : st.priority}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveSubtodo(i)}
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

     
      <Modal show={showSubtodoModal} onHide={() => setShowSubtodoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subtodo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={subtodo.title}
              onChange={handleSubtodoChange}
              placeholder="Subtodo title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={subtodo.priority}
              onChange={handleSubtodoChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>
          <Form.Check
            type="checkbox"
            name="completed"
            checked={subtodo.completed}
            onChange={handleSubtodoChange}
            label="Completed"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubtodoModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSubtodo}>
            Add Subtodo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodosDetailsModal;
*/

