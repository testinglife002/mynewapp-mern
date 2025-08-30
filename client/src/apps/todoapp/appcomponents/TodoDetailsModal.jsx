
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Button, Form, Badge, ProgressBar, Table } from 'react-bootstrap';
import newRequest from '../../../utils/newRequest';
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const formatTimeLeft = (diff) => {
  if (diff <= 0) return 'Started';
  const d = dayjs.duration(diff);
  return `${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`;
};

const getStartBadge = (diff) => {
  const hours = diff / (1000 * 60 * 60);
  if (hours <= 1) return { className: 'badge bg-danger', icon: '🔥' };
  if (hours <= 24) return { className: 'badge bg-warning text-dark', icon: '⚠️' };
  return { className: 'badge bg-info', icon: '⏰' };
};

const getBadgeVariant = (priority, completed) => {
  if (completed) return 'success';
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'secondary';
};

const getRowStyle = (priority) => ({
  high: { backgroundColor: '#f8d7da' },
  medium: { backgroundColor: '#fff3cd' },
  low: { backgroundColor: '#e2e3e5' }
}[priority] || {});

const SubtodoRow = ({ subtodo, index, onChange, onRemove, onDragStart, onDragEnter, onDragEnd }) => (
  <tr
    style={getRowStyle(subtodo.priority)}
    draggable
    onDragStart={() => onDragStart(index)}
    onDragEnter={() => onDragEnter(index)}
    onDragEnd={onDragEnd}
  >
    <td style={{ cursor: 'grab', textAlign: 'center' }}>☰</td>
    <td>
      <Form.Control
        type="text"
        value={subtodo.title}
        onChange={(e) => onChange(index, 'title', e.target.value)}
      />
    </td>
    <td>
      <Form.Select
        value={subtodo.priority}
        onChange={(e) => onChange(index, 'priority', e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Form.Select>
    </td>
    <td className="text-center">
      <Form.Check
        type="checkbox"
        checked={subtodo.completed}
        onChange={(e) => onChange(index, 'completed', e.target.checked)}
      />
    </td>
    <td>
      <Badge bg={getBadgeVariant(subtodo.priority, subtodo.completed)}>
        {subtodo.completed ? 'Completed' : subtodo.priority}
      </Badge>
    </td>
    <td className="text-center">
      <Button variant="danger" size="sm" onClick={() => onRemove(index)}>×</Button>
    </td>
  </tr>
);

const TodoDetailsModal = ({ show, onHide, todo, onTodoUpdated }) => {
  const [editTodo, setEditTodo] = useState({});
  const [username, setUsername] = useState('');
  const [startCountdown, setStartCountdown] = useState('');
  const [startBadge, setStartBadge] = useState({});
  const [endCountdown, setEndCountdown] = useState('');
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Load todo data
  useEffect(() => {
    if (!todo) return;
    setEditTodo({
      title: todo.title || '',
      description: todo.description || '',
      start: todo.start || '',
      end: todo.end || '',
      priority: todo.priority || 'medium',
      subtodos: todo.subtodos || [],
      ...todo
    });
    if (todo.userId) {
      newRequest.get(`/users/${todo.userId}`)
        .then(res => setUsername(res.data.username))
        .catch(() => setUsername('Unknown'));
    }
  }, [todo]);

  // Countdown updater
  useEffect(() => {
    if (!editTodo.start) return;
    const updateCountdowns = () => {
      const now = dayjs();
      const startDiff = dayjs(editTodo.start).diff(now);
      setStartCountdown(formatTimeLeft(startDiff));
      setStartBadge(getStartBadge(startDiff));

      if (editTodo.end) {
        const endDiff = dayjs(editTodo.end).diff(now);
        setEndCountdown(formatTimeLeft(endDiff));
      }
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [editTodo.start, editTodo.end]);

  // Subtodo inline editing
  const handleSubtodoChange = (index, field, value) => {
    setEditTodo(prev => {
      const updated = [...prev.subtodos];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, subtodos: updated };
    });
  };

  const handleRemoveSubtodo = (index) => {
    setEditTodo(prev => ({
      ...prev,
      subtodos: prev.subtodos.filter((_, i) => i !== index)
    }));
  };

  const handleDragStart = (index) => { dragItem.current = index; };
  const handleDragEnter = (index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    setEditTodo(prev => {
      const items = [...prev.subtodos];
      const dragged = items[dragItem.current];
      items.splice(dragItem.current, 1);
      items.splice(dragOverItem.current, 0, dragged);
      return { ...prev, subtodos: items };
    });
    dragItem.current = dragOverItem.current = null;
  };

  const completedCount = editTodo.subtodos?.filter(st => st.completed).length || 0;
  const completedPercent = editTodo.subtodos?.length
    ? Math.round((completedCount / editTodo.subtodos.length) * 100)
    : 0;

  const handleSave = async () => {
    try {
      const payload = {
        ...editTodo,
        completedPercent,
        start: editTodo.start ? new Date(editTodo.start).toISOString() : null,
        end: editTodo.end ? new Date(editTodo.end).toISOString() : null
      };
      const res = await newRequest.put(`/todos/${todo._id}`, payload);
      onTodoUpdated(res.data);
      onHide();
    } catch {
      toast.error('Failed to save changes');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Todo - {editTodo.title || 'Loading...'}</Modal.Title>
        {editTodo.start && (
          <div className="ms-4 bg-light rounded p-2 text-center">
            <strong>Starts:</strong> <span className={startBadge.className}>{startBadge.icon} {startCountdown}</span>
          </div>
        )}
        {editTodo.end && (
          <div className="ms-4 bg-light rounded p-2 text-center">
            <strong>Ends:</strong> <span className="badge bg-secondary">{endCountdown}</span>
          </div>
        )}
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={editTodo.title || ''}
              onChange={(e) => setEditTodo(prev => ({ ...prev, title: e.target.value }))}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={editTodo.description || ''}
              onChange={(e) => setEditTodo(prev => ({ ...prev, description: e.target.value }))}
            />
          </Form.Group>

          <Form.Group className="d-flex gap-3">
            <div>
              <Form.Label>Start</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editTodo.start ? editTodo.start.slice(0, 16) : ''}
                onChange={(e) => setEditTodo(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <Form.Label>End</Form.Label>
              <Form.Control
                type="datetime-local"
                value={editTodo.end ? editTodo.end.slice(0, 16) : ''}
                onChange={(e) => setEditTodo(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={editTodo.priority}
              onChange={(e) => setEditTodo(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          {editTodo.subtodos?.length > 0 && (
            <>
              <div className="mt-3">
                <label>Subtodos Completion: {completedPercent}%</label>
                <ProgressBar now={completedPercent} label={`${completedPercent}%`} />
              </div>
              <Table striped bordered hover size="sm" className="mt-2">
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
                  {editTodo.subtodos.map((st, i) => (
                    <SubtodoRow
                      key={i}
                      subtodo={st}
                      index={i}
                      onChange={handleSubtodoChange}
                      onRemove={handleRemoveSubtodo}
                      onDragStart={handleDragStart}
                      onDragEnter={handleDragEnter}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Form>

        <div className="small text-muted mt-3">
          Created by: <Badge bg="info">{username}</Badge><br />
          Created: {editTodo.createdAt && new Date(editTodo.createdAt).toLocaleString()}<br />
          Last Updated: {editTodo.updatedAt && new Date(editTodo.updatedAt).toLocaleString()}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => {
          if (window.confirm('Delete this todo?')) {
            newRequest.delete(`/todos/${editTodo._id}`)
              .then(() => { onTodoUpdated(null); onHide(); })
              .catch(() => toast.error('Failed to delete todo'));
          }
        }}>Delete</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TodoDetailsModal;



/*
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Badge, ProgressBar, Table } from 'react-bootstrap';
import newRequest from '../../../utils/newRequest';
import toast from "react-hot-toast";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const formatTimeLeft = (diff) => {
  if (diff <= 0) return 'Started';
  const d = dayjs.duration(diff);
  return `${d.days()}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`;
};

const getStartBadgeClassWithIcon = (diff) => {
  const durationInHours = diff / (1000 * 60 * 60);
  if (durationInHours <= 1) {
    return { className: 'badge bg-danger', icon: '🔥' };
  } else if (durationInHours <= 24) {
    return { className: 'badge bg-warning text-dark', icon: '⚠️' };
  } else {
    return { className: 'badge bg-info', icon: '⏰' };
  }
};

const getBadgeVariant = (priority, completed) => {
  if (completed) return 'success';
  if (priority === 'high') return 'danger';
  if (priority === 'medium') return 'warning';
  return 'secondary';
};

const getRowStyle = (priority) => {
  switch (priority) {
    case 'high':
      return { backgroundColor: '#f8d7da' };
    case 'medium':
      return { backgroundColor: '#fff3cd' };
    case 'low':
      return { backgroundColor: '#e2e3e5' };
    default:
      return {};
  }
};

const TodoDetailsModal = ({ show, onHide, todo, onTodoUpdated }) => {
  const [editTodo, setEditTodo] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    priority: 'medium',
    subtodos: [],
    ...todo,
  });
  const [username, setUsername] = useState('');
  const [startCountdown, setStartCountdown] = useState('');
  const [startBadge, setStartBadge] = useState({ className: '', icon: '' });
  const [endCountdown, setEndCountdown] = useState('');

  const [showSubtodoModal, setShowSubtodoModal] = useState(false);
  const [subtodo, setSubtodo] = useState({ title: '', priority: 'medium', completed: false });

  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    if (todo) {
      setEditTodo({
        title: todo.title || '',
        description: todo.description || '',
        start: todo.start || '',
        end: todo.end || '',
        priority: todo.priority || 'medium',
        subtodos: todo.subtodos || [],
        _id: todo._id,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
        userId: todo.userId,
      });
      if (todo.userId) {
        newRequest.get(`/users/${todo.userId}`).then(res => setUsername(res.data.username)).catch(() => setUsername('Unknown'));
      }
    }
  }, [todo]);

  useEffect(() => {
    if (!editTodo.start) return;

    const updateCountdowns = () => {
      const now = dayjs();
      const startDiff = dayjs(editTodo.start).diff(now);
      setStartCountdown(formatTimeLeft(startDiff));
      setStartBadge(getStartBadgeClassWithIcon(startDiff));

      const titleForReminder = editTodo.title || 'Todo';

      if (startDiff <= 3600000 && startDiff > 0) { // 1 hour in ms
        toast(`⏰ "${titleForReminder}" starts in less than an hour!`);
      } else if (startDiff <= 86400000 && startDiff > 3600000) { // 24h and 1h in ms
        toast(`⚠️ "${titleForReminder}" starts within a day!`);
      }

      if (editTodo.end) {
        const endDiff = dayjs(editTodo.end).diff(now);
        setEndCountdown(formatTimeLeft(endDiff));
      }
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [editTodo.start, editTodo.end, editTodo.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTodo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubtodoChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSubtodo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddSubtodo = async () => {
    if (!subtodo.title.trim()) return;
    try {
      // Here you can add subtodo via API or just update locally
      const updatedSubtodos = [...(editTodo.subtodos || []), subtodo];
      setEditTodo(prev => ({ ...prev, subtodos: updatedSubtodos }));
      setSubtodo({ title: '', priority: 'medium', completed: false });
      setShowSubtodoModal(false);
      toast.success('Subtodo added');
    } catch (error) {
      toast.error('Failed to add subtodo');
    }
  };

  const handleRemoveSubtodo = (index) => {
    const subtodos = [...editTodo.subtodos];
    subtodos.splice(index, 1);
    setEditTodo({ ...editTodo, subtodos });
  };

  const handleSubtodoInlineChange = (index, field, value) => {
    const subtodos = [...editTodo.subtodos];
    subtodos[index] = { ...subtodos[index], [field]: value };
    setEditTodo({ ...editTodo, subtodos });
  };

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const items = [...editTodo.subtodos];
    const draggedItem = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItem);
    dragItem.current = null;
    dragOverItem.current = null;
    setEditTodo({ ...editTodo, subtodos: items });
  };

  const completedCount = editTodo.subtodos?.filter(st => st.completed).length || 0;
  const totalCount = editTodo.subtodos?.length || 0;
  const completedPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleSave = async () => {
    try {
      const payload = { ...editTodo, completedPercent };
      console.log("Saving todo payload:", payload);

      // Ensure dates are ISO strings:
      if (payload.start) payload.start = new Date(payload.start).toISOString();
      if (payload.end) payload.end = new Date(payload.end).toISOString();

      const res = await newRequest.put(`/todos/${todo._id}`, payload);
      onTodoUpdated(res.data);
      onHide();
    } catch (err) {
      console.error('Failed to update todo', err);
      toast.error('Failed to save changes');
    }
  };



  return (
    <Modal show={show} onHide={onHide} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Edit Todo - {editTodo.title || 'Loading...'}</Modal.Title>
        <div className="ms-4 todo-card text-center rounded shadow-sm bg-light">
          <h6><small>Timings</small></h6>
          {editTodo.start && (
            <p>
              <strong><small>Starts</small></strong>{' '}
              <span className={startBadge.className}>
                {startBadge.icon} {startCountdown}
              </span>
            </p>
          )}
          {editTodo.end && (
            <p>
              <strong><small>Ends</small></strong>{' '}
              <span className="badge bg-secondary">{endCountdown}</span>
            </p>
          )}
        </div>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={editTodo.title || ''} onChange={handleChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} value={editTodo.description || ''} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="d-flex gap-3">
            <div>
              <Form.Label>Start</Form.Label>
              <Form.Control 
                type="datetime-local"
                name="start"
                value={editTodo.start ? editTodo.start.slice(0, 16) : ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Form.Label>End</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end"
                value={editTodo.end ? editTodo.end.slice(0, 16) : ''}
                onChange={handleChange}
              />
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select name="priority" value={editTodo.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 mt-3">
            <Button variant="info" onClick={() => setShowSubtodoModal(true)}>+ Add Subtodo</Button>

            {totalCount > 0 && (
              <>
                <div className="mt-2 mb-2">
                  <label>Subtodos Completion: {completedPercent}%</label>
                  <ProgressBar now={completedPercent} label={`${completedPercent}%`} variant={completedPercent === 100 ? 'success' : 'info'} />
                </div>

                <Table striped bordered hover size="sm">
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
                    {editTodo.subtodos?.map((st, i) => (
                      <tr
                        key={i}
                        style={getRowStyle(st.priority)}
                        draggable
                        onDragStart={() => handleDragStart(i)}
                        onDragEnter={() => handleDragEnter(i)}
                        onDragEnd={handleDragEnd}
                      >
                        <td style={{ cursor: 'grab', textAlign: 'center' }}>☰</td>
                        <td>
                          <Form.Control type="text" value={st.title} onChange={(e) => handleSubtodoInlineChange(i, 'title', e.target.value)} />
                        </td>
                        <td>
                          <Form.Select value={st.priority} onChange={(e) => handleSubtodoInlineChange(i, 'priority', e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </Form.Select>
                        </td>
                        <td className="text-center">
                          <Form.Check type="checkbox" checked={st.completed} onChange={(e) => handleSubtodoInlineChange(i, 'completed', e.target.checked)} />
                        </td>
                        <td>
                          <Badge bg={getBadgeVariant(st.priority, st.completed)}>
                            {st.completed ? 'Completed' : st.priority}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Button variant="danger" size="sm" onClick={() => handleRemoveSubtodo(i)}>×</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </Form.Group>

          <hr />
          <div className="small text-muted">
            Created by: <Badge bg="info">{username || 'Loading...'}</Badge><br />
            Created: {editTodo.createdAt ? new Date(editTodo.createdAt).toLocaleString() : 'N/A'}<br />
            Last Updated: {editTodo.updatedAt ? new Date(editTodo.updatedAt).toLocaleString() : 'N/A'}
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={() => {
          if (window.confirm('Delete this todo?')) {
            newRequest.delete(`/todos/${editTodo._id}`).then(() => {
              onTodoUpdated(null);
              onHide();
            }).catch(() => toast.error('Failed to delete todo'));
          }
        }}>Delete</Button>
        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>

    
      <Modal show={showSubtodoModal} onHide={() => setShowSubtodoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subtodo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control name="title" value={subtodo.title} onChange={handleSubtodoChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select name="priority" value={subtodo.priority} onChange={handleSubtodoChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Check name="completed" label="Completed" checked={subtodo.completed} onChange={handleSubtodoChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubtodoModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSubtodo}>Add Subtodo</Button>
        </Modal.Footer>
      </Modal>
    </Modal>
  );
};

export default TodoDetailsModal;
*/
