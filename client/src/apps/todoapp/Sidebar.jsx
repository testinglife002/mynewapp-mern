import React from 'react';
import { ListGroup } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="bg-light vh-100 p-3">
      <h5>Dashboard</h5>
      <ListGroup variant="flush">
        <ListGroup.Item action href="#">Options</ListGroup.Item>
        <ListGroup.Item action href="#">Projects</ListGroup.Item>
        <ListGroup.Item action href="#">Todos</ListGroup.Item>
        <ListGroup.Item action href="#">Completed</ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
