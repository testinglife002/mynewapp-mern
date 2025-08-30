import React, { useState, useEffect, useRef } from "react";
import newRequest from "../../../utils/newRequest";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  Modal,
  Table,
  ProgressBar,
} from "react-bootstrap";

const CreateTodo = ({ user, onTodoCreated }) => {
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    start: "",
    end: "",
    projectId: "",
    recurrence: "none",
    status: "pending",
    priority: "medium",
    tags: [],
    color: "#000000",
    reminder: "",
    marked: false,
    completed: false,
    remindMe: "",
    comments: "",
    subtodos: [],
  });

  const [showSubtodoModal, setShowSubtodoModal] = useState(false);
  const [subtodo, setSubtodo] = useState({
    title: "",
    priority: "medium",
    completed: false,
  });

  // For drag & drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects/my-projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTagsFromTodos = async () => {
      try {
        const res = await newRequest.get("/todos/tags-only");
        setTagSuggestions(res.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTagsFromTodos();
  }, []);

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (
      trimmed &&
      !tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubtodoChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSubtodo({ ...subtodo, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddSubtodo = () => {
    if (!subtodo.title.trim()) return alert("Subtodo title is required");
    setForm({ ...form, subtodos: [...form.subtodos, { ...subtodo }] });
    setSubtodo({ title: "", priority: "medium", completed: false });
    setShowSubtodoModal(false);
  };

  const handleRemoveSubtodo = (index) => {
    const subtodos = [...form.subtodos];
    subtodos.splice(index, 1);
    setForm({ ...form, subtodos });
  };

  // Inline edit for subtodo properties in table:
  const handleSubtodoInlineChange = (index, field, value) => {
    const subtodos = [...form.subtodos];
    subtodos[index] = { ...subtodos[index], [field]: value };
    setForm({ ...form, subtodos });
  };

  // Drag & drop handlers:
  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const items = [...form.subtodos];
    const draggedItemContent = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setForm({ ...form, subtodos: items });
  };

  // Calculate completed percent of subtodos
  const completedCount = form.subtodos.filter((st) => st.completed).length;
  const totalCount = form.subtodos.length;
  const completedPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.projectId || !user) {
      alert("Title, Project and User are required");
      return;
    }

    try {
      const res = await newRequest.post("/todos", {
        ...form,
        tags,
        userId: user?._id,
        completedPercent,
      });
      alert("Todo created!");
      onTodoCreated?.(res.data);

      // Reset form
      setForm({
        title: "",
        description: "",
        dueDate: "",
        start: "",
        end: "",
        projectId: "",
        recurrence: "none",
        status: "pending",
        priority: "medium",
        tags: [],
        color: "#000000",
        reminder: "",
        marked: false,
        completed: false,
        remindMe: "",
        comments: "",
        subtodos: [],
      });
      setTags([]);
      setTagInput("");
    } catch (err) {
      console.error("Error creating todo", err);
      alert(err?.response?.data?.error || "Failed to create todo");
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
        return { backgroundColor: "#f8d7da" }; // light red
      case "medium":
        return { backgroundColor: "#fff3cd" }; // light yellow
      case "low":
        return { backgroundColor: "#e2e3e5" }; // light gray
      default:
        return {};
    }
  };

  return (
    <div className="container mt-4">
      <h4>Create Todo</h4>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-2">
          <label>Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-2">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Start / End / Due Dates */}
        <div className="row">
          <div className="col">
            <label>Start DateTime</label>
            <input
              type="datetime-local"
              className="form-control"
              name="start"
              value={form.start}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label>End DateTime</label>
            <input
              type="datetime-local"
              className="form-control"
              name="end"
              value={form.end}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label>Due Date</label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Project */}
        <div className="mt-2 mb-2">
          <label>Project</label>
          <select
            className="form-select"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority / Recurrence / Status */}
        <div className="row">
          <div className="col">
            <label>Priority</label>
            <select
              className="form-select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="col">
            <label>Recurrence</label>
            <select
              className="form-select"
              name="recurrence"
              value={form.recurrence}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="col">
            <label>Status</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Completed</option>
            </select>
          </div>
        </div>

        {/* Completed / Marked */}
        <div className="form-check mt-2">
          <input
            type="checkbox"
            className="form-check-input"
            name="completed"
            checked={form.completed}
            onChange={handleChange}
            id="completed"
          />
          <label htmlFor="completed" className="form-check-label">
            Completed
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="marked"
            checked={form.marked}
            onChange={handleChange}
            id="marked"
          />
          <label htmlFor="marked" className="form-check-label">
            Mark as Important
          </label>
        </div>

        {/* Reminders */}
        <div className="mb-2">
          <label>Remind Me</label>
          <input
            type="datetime-local"
            className="form-control"
            name="remindMe"
            value={form.remindMe}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Reminder (Date only)</label>
          <input
            type="datetime-local"
            className="form-control"
            name="reminder"
            value={form.reminder}
            onChange={handleChange}
          />
        </div>

        {/* Comments */}
        <div className="mb-2">
          <label>Comments</label>
          <textarea
            className="form-control"
            name="comments"
            value={form.comments}
            onChange={handleChange}
          />
        </div>

        {/* Tags Input */}
        <div className="mb-2">
          <label>Tags</label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
            />
            <Button onClick={handleTagAdd}>Add</Button>
          </InputGroup>
          {tagInput && (
            <div className="mt-1 p-2 border bg-light">
              {tagSuggestions
                .filter(
                  (t) =>
                    t.toLowerCase().includes(tagInput.toLowerCase()) &&
                    !tags.includes(t)
                )
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setTags([...tags, t]);
                      setTagInput("");
                    }}
                  >
                    {t}
                  </div>
                ))}
            </div>
          )}
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} bg="secondary">
                {tag}
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
        </div>

        {/* Color */}
        <div className="mb-3">
          <label>Color Label</label>
          <input
            type="color"
            className="form-control form-control-color"
            name="color"
            value={form.color}
            onChange={handleChange}
          />
        </div>

        {/* Subtodos */}
        <div className="mb-3">
          <Button variant="info" onClick={() => setShowSubtodoModal(true)}>
            + Add Subtodo
          </Button>

          {form.subtodos.length > 0 && (
            <>
              {/* Progress Bar */}
              <div className="mt-2 mb-2">
                <label>Subtodos Completion: {completedPercent}%</label>
                <ProgressBar
                  now={completedPercent}
                  label={`${completedPercent}%`}
                  variant={completedPercent === 100 ? "success" : "info"}
                />
              </div>

              <Table
                striped
                bordered
                hover
                size="sm"
                className="mt-2"
                style={{ userSelect: "none" }}
              >
                <thead>
                  <tr>
                    <th>Drag</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Completed</th>
                    <th>Status</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {form.subtodos.map((st, i) => (
                    <tr
                      key={i}
                      style={getRowStyle(st.priority)}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragEnter={() => handleDragEnter(i)}
                      onDragEnd={handleDragEnd}
                    >
                      <td
                        style={{ cursor: "grab", textAlign: "center" }}
                        title="Drag to reorder"
                      >
                        ☰
                      </td>

                      {/* Editable Title */}
                      <td>
                        <Form.Control
                          type="text"
                          value={st.title}
                          onChange={(e) =>
                            handleSubtodoInlineChange(i, "title", e.target.value)
                          }
                        />
                      </td>

                      {/* Editable Priority */}
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

                      {/* Editable Completed */}
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={st.completed}
                          onChange={(e) =>
                            handleSubtodoInlineChange(i, "completed", e.target.checked)
                          }
                          aria-label="Mark completed"
                        />
                      </td>

                      {/* Badge Status */}
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
            </>
          )}
        </div>

        <button type="submit" className="btn btn-success">
          Create Todo
        </button>
      </form>

      {/* Subtodo Modal */}
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

          <Form.Group>
            <Form.Check
              type="checkbox"
              name="completed"
              checked={subtodo.completed}
              onChange={handleSubtodoChange}
              label="Completed"
            />
          </Form.Group>
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
    </div>
  );
};

export default CreateTodo;
