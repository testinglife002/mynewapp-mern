// views/KanbanView.jsx
import React, { useEffect, useState } from "react";

import { Card, Container, Row, Col } from "react-bootstrap";
import newRequest from "../../../../utils/newRequest";

const statusColumns = ["pending", "in-progress", "done"];

const KanbanView = () => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await newRequest80.jget("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Container fluid>
      <Row>
        {statusColumns.map((status) => (
          <Col key={status}>
            <h5 className="text-capitalize">{status}</h5>
            {todos
              .filter((todo) => todo.status === status)
              .map((todo) => (
                <Card key={todo._id} className="mb-2 shadow-sm">
                  <Card.Body>
                    <Card.Title>{todo.title}</Card.Title>
                    <Card.Text className="small text-muted">
                      Priority: {todo.priority}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KanbanView;
