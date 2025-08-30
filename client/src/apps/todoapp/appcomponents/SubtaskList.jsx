import React, { useState } from "react";
import { Collapse, ListGroup, Button } from "react-bootstrap";

const SubtaskList = ({ subtasks = [] }) => {
  const [open, setOpen] = useState(false);

  if (!subtasks.length) return null;

  return (
    <div className="px-3 pb-2">
      <Button
        variant="link"
        size="sm"
        className="p-0"
        onClick={() => setOpen(!open)}
        aria-controls="subtask-collapse"
        aria-expanded={open}
      >
        {open ? "Hide" : "Show"} Subtasks
      </Button>
      <Collapse in={open}>
        <ListGroup id="subtask-collapse" className="mt-2">
          {subtasks.map((sub, index) => (
            <ListGroup.Item key={index} className="py-1 small">
              ✅ {sub.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Collapse>
    </div>
  );
};

export default SubtaskList;
