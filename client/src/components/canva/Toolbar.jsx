// src/components/canva/Toolbar.jsx
import React from "react";
import { Navbar, Container, Button, ButtonGroup } from "react-bootstrap";

const Toolbar = ({ shapes, setShapes }) => {
  const addRectangle = () => {
    setShapes([
      ...shapes,
      { type: "rect", x: 50, y: 60, width: 100, height: 100, fill: "red" },
    ]);
  };

  const addText = () => {
    setShapes([
      ...shapes,
      { type: "text", x: 150, y: 80, text: "Edit me", fontSize: 24, fill: "black" },
    ]);
  };

  return (
    <Navbar bg="dark" variant="dark" className="p-2">
      <Container fluid>
        <Navbar.Brand>Canva Clone</Navbar.Brand>
        <ButtonGroup>
          <Button variant="outline-light" onClick={addText}>Add Text</Button>
          <Button variant="outline-light" onClick={addRectangle}>Add Rectangle</Button>
        </ButtonGroup>
      </Container>
    </Navbar>
  );
};

export default Toolbar;
