import React, { useEffect } from "react";
// import TaskCard from "./TaskCard";
import { Container, Row, Col } from "react-bootstrap";
import TaskCard from "../TaskCard";

const BoardView = ({ tasks }) => {
    console.log(tasks);
    console.log("BoardView tasks:", tasks); // should be an array
    console.log("📦 BoardView - received tasks:", tasks);   
    useEffect(() => {
        console.log("✅ Updated tasks from API:", tasks);
    }, [tasks]);

    // if (!tasks || tasks.length === 0) return <div>No tasks to display.</div>;
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return <div>No tasks found.</div>;
    }

  return (
    <Container className="py-4">
      <Row xs={1} sm={2} md={3} className="g-4">
        {tasks.map((task) => (
          <Col key={task._id}>
            <TaskCard task={task} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BoardView;
