// BoardView.jsx
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TaskCard from "./TaskCard";
import TaskCardAlt from "./TaskCardAlt";

const BoardView = ({ tasks }) => {
  return (
    <Container fluid className="py-4">
      <Row xs={1} sm={2} md={3} className="g-4">
        {tasks.map((task, index) => (
          <Col key={index} >
            {<TaskCard task={task} />}
            {/*<TaskCardAlt task={task} />*/}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BoardView;
