// frontend/src/components/Toolbars.jsx
import React from "react";
import { Button } from "react-bootstrap";
import "./Toolbars.css";

const Toolbars = ({ onAddShape }) => {
  return (
    <div className="toolbar">
      <Button variant="outline-primary" onClick={() => onAddShape("rect")}>⬛ Rectangle</Button>
      <Button variant="outline-success" onClick={() => onAddShape("circle")}>⚪ Circle</Button>
      <Button variant="outline-warning" onClick={() => onAddShape("star")}>⭐ Star</Button>
      <Button variant="outline-danger" onClick={() => onAddShape("line")}>📏 Line</Button>
    </div>
  );
};

export default Toolbars;
