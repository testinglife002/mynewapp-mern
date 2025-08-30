// components/todos/SubtasksList.jsx
import React, { useEffect, useState } from "react";
import { ListGroup, Form, Button } from "react-bootstrap";
import newRequest from "../../../utils/newRequest";

const SubtasksList = ({ todoId }) => {
  const [subtasks, setSubtasks] = useState([]);

  const fetchSubtasks = async () => {
    try {
      const res = await newRequest.get(`/todos/${todoId}/subtasks`);
      setSubtasks(res.data);
    } catch (err) {
      console.error("Failed to fetch subtasks", err);
    }
  };

  useEffect(() => {
    fetchSubtasks();
  }, [todoId]);

  const toggleSubtask = async (subtaskId, currentStatus) => {
    try {
      await newRequest.put(`/todos/${todoId}/subtasks/${subtaskId}`, {
        completed: !currentStatus,
      });
      fetchSubtasks();
    } catch (err) {
      console.error("Failed to update subtask", err);
    }
  };

  const deleteSubtask = async (subtaskId) => {
    if (!window.confirm("Delete this subtask?")) return;
    try {
      await newRequest.delete(`/todos/${todoId}/subtasks/${subtaskId}`);
      fetchSubtasks();
    } catch (err) {
      console.error("Failed to delete subtask", err);
    }
  };

  return (
    <ListGroup>
      {subtasks.map((sub) => (
        <ListGroup.Item key={sub._id} className="d-flex justify-content-between align-items-center">
          <Form.Check
            type="checkbox"
            label={sub.title}
            checked={sub.completed}
            onChange={() => toggleSubtask(sub._id, sub.completed)}
          />
          <Button variant="outline-danger" size="sm" onClick={() => deleteSubtask(sub._id)}>
            Delete
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SubtasksList;
