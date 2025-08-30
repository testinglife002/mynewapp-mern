// TodosMainLayout.jsx
import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SidebarProjects from "./SidebarProjects";
import TodosByProject from "./TodosByProject";

const TodosMainLayout = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <Row>
      <Col md={3}>
        <SidebarProjects onSelectProject={setSelectedProjectId} />
      </Col>
      <Col md={9}>
        <TodosByProject selectedProjectId={selectedProjectId} />
      </Col>
    </Row>
  );
};

export default TodosMainLayout;
