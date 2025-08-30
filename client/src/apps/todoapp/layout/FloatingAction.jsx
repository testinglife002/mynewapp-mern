import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const FloatingAction = () => (
  <Button className="fab shadow-lg" variant="primary">
    <FaPlus />
  </Button>
);

export default FloatingAction;
