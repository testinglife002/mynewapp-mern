import React from "react";
import { useSelector } from "react-redux";
import { Card, Badge, ListGroup } from "react-bootstrap";

const TaskCardAlt = ({ task }) => {
  console.log("📝 TaskCard - rendering task:", task);

  const { user } = useSelector((state) => state.auth || {});
  const priorityColors = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {task.title}
          <Badge bg={priorityColors[task.priority]} className="ms-2 text-capitalize">
            {task.priority}
          </Badge>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {new Date(task.date).toDateString()}
        </Card.Subtitle>

        <Card.Text>
          Stage: <strong>{task.stage}</strong>
        </Card.Text>

        {task.activities?.length > 0 && (
          <div className="mt-2">
            <strong>Recent Activity:</strong>
            <ul className="mb-0 ps-3">
              {task.activities.map((act) => (
                <li key={act._id}>{act.activity}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3">
          <strong>Assigned Team:</strong>
          <ListGroup variant="flush" className="mt-1">
            {task.team?.map((member) => (
              <ListGroup.Item key={member._id}>{member.email}</ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaskCardAlt;
