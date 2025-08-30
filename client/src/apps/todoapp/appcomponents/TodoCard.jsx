import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Card, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  CheckCircle,
  Cancel,
  ListAlt,
  HourglassEmpty,
  PlayCircle,
  DoneAll,
  PauseCircle,
  Category as CategoryIcon,
  Label as LabelIcon,
} from '@mui/icons-material';
import { showBrowserNotification } from "../../../utils/notificationUtils";

const getStatusIcon = (status) => {
  switch (status) {
    case 'done':
      return <DoneAll className="text-success me-1" />;
    case 'in-progress':
      return <PlayCircle className="text-warning me-1" />;
    case 'pending':
      return <HourglassEmpty className="text-secondary me-1" />;
    case 'todo':
      return <PauseCircle className="text-muted me-1" />;
    default:
      return <Cancel className="text-danger me-1" />;
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'done':
      return 'success';
    case 'in-progress':
      return 'warning';
    case 'pending':
      return 'secondary';
    case 'todo':
      return 'dark';
    default:
      return 'danger';
  }
};

const TodoCard = ({ todo, onShowDetails }) => {
  const priorityColor =
    todo.priority === 'high'
      ? 'danger'
      : todo.priority === 'medium'
      ? 'warning'
      : 'secondary';

  const { title, start, end } = todo;

  const [timeLeft, setTimeLeft] = useState("");
  const [endLeft, setEndLeft] = useState("");
  const [shownReminders, setShownReminders] = useState([]);


  const calculateCountdown = () => {
    const now = dayjs();
    const startDiff = dayjs(start).diff(now, "second");
    const endDiff = dayjs(end).diff(now, "second");

    // Reminder: less than 1 hour
    const oneHourKey = `${todo._id}-1h`;
    if (
      startDiff <= 3600 &&
      startDiff > 0 &&
      !shownReminders.includes(oneHourKey)
    ) {
      const msg = `⏰ "${title}" starts in less than an hour!`;
      toast(msg);
      alert(msg); // for dev
      showBrowserNotification('Todo Reminder ⏰', { body: msg }, oneHourKey);
      setShownReminders((prev) => [...prev, oneHourKey]);
    }

    // Reminder: within 1 day but more than 1 hour
    const oneDayKey = `${todo._id}-1d`;
    if (
      startDiff <= 86400 &&
      startDiff > 3600 &&
      !shownReminders.includes(oneDayKey)
    ) {
      const msg = `⚠️ "${title}" starts within a day!`;
      toast(msg);
      showBrowserNotification('Todo Reminder ⚠️', { body: msg }, oneDayKey);
      setShownReminders((prev) => [...prev, oneDayKey]);
    }

    setTimeLeft(formatDuration(startDiff));
    setEndLeft(formatDuration(endDiff));
  };

    

  const formatDuration = (seconds) => {
    if (seconds <= 0) return "Started or expired";
    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hrs}h ${mins}m ${secs}s`;
  };

  useEffect(() => {
    calculateCountdown(); // initial call
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [shownReminders]); // Re-run if reminders change

  return (
    <Card
      className="mb-3 shadow-sm"
      onClick={() => onShowDetails(todo)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card p-3 my-2 border">
      <h5>{title}</h5>
      <div className="text-muted">Starts in: <span className="text-info">{timeLeft}</span></div>
      <div className="text-muted">Ends in: <span className="text-success">{endLeft}</span></div>
    </div>
      <Card.Body>
        {/* Title and Priority Badge */}
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title className="mb-0">{todo.title}</Card.Title>
          <Badge bg={priorityColor} pill>
            {todo.priority}
          </Badge>
        </div>

        {/* Time Range */}
        <div className="text-muted small mb-2">
          {new Date(todo.start).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          month: 'short',
                                          day: 'numeric'
                                        }) } 
          →{' '}
          {new Date(todo.end).toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          month: 'short',
                                          day: 'numeric'
                                        }) }
        </div>

        {/* Status and Subtasks */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Status: {todo.status}</Tooltip>}
          >
            <div className="d-flex align-items-center">
              {getStatusIcon(todo.status)}
              <Badge bg={getStatusBadgeColor(todo.status)} className="text-uppercase">
                {todo.status}
              </Badge>
            </div>
          </OverlayTrigger>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Subtasks count</Tooltip>}
          >
            <div className="d-flex align-items-center">
              <ListAlt className="me-1 text-primary" />
              <span>{todo.subtodos?.length || 0}</span>
            </div>
          </OverlayTrigger>
        </div>

        {/* Category and List Title */}
        <div className="d-flex flex-wrap gap-2 mb-2">
          {todo.category && (
            <Badge bg="info" className="d-flex align-items-center">
              <CategoryIcon fontSize="small" className="me-1" />
              {todo.category}
            </Badge>
          )}
          {todo.listTitle && (
            <Badge bg="dark" className="d-flex align-items-center">
              <LabelIcon fontSize="small" className="me-1" />
              {todo.listTitle}
            </Badge>
          )}
        </div>

        {/* Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mt-1">
            {todo.tags.map((tag, idx) => (
              <Badge key={idx} bg="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TodoCard;
