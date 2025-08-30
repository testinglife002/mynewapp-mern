// components/Filters.jsx
import React from "react";
import { Form, Row, Col } from "react-bootstrap";

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Form className="mb-3">
      <Row>
        <Col md={3}>
          <Form.Select name="priority" onChange={handleChange} value={filters.priority}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select name="status" onChange={handleChange} value={filters.status}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </Form.Select>
        </Col>
        {/* You can add project filter here if needed */}
      </Row>
    </Form>
  );
};

export default Filters;
