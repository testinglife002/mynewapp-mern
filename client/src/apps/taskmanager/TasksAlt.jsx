import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button as RBButton, Tab, Nav, Spinner } from "react-bootstrap";
import { MdGridView } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import AddTask from "../components/task/AddTask";
import Title from "../components/Title";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import { tasks } from "../assets/data";


export const PRIOTITYSTYELS = {
  high: "#d32f2f", // red
  medium: "#f57c00", // orange
  low: "#388e3c", // green
};

export const TASK_TYPE = {
  "to-do": "#1976d2",
  "in-progress": "#fbc02d",
  completed: "#2e7d32",
};


const TasksAlt = () => {
  const params = useParams();
  const status = params?.status || "";

  const [selected, setSelected] = useState("board");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const TASK_TYPE = {
    todo: "bg-primary text-white px-3 py-2 rounded",
    "in progress": "bg-warning text-dark px-3 py-2 rounded",
    completed: "bg-success text-white px-3 py-2 rounded",
  };

  return loading ? (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
    </div>
  ) : (
    <Container fluid className="pt-3">
      <Row className="align-items-center mb-3">
        <Col><Title title={status ? `${status} Tasks` : "Tasks"} /></Col>
        {!status && (
          <Col className="text-end">
            <RBButton
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={() => setOpen(true)}
            >
              <IoMdAdd /> Create Task
            </RBButton>
          </Col>
        )}
      </Row>

      <Tab.Container activeKey={selected} onSelect={k => setSelected(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="board">
              <MdGridView /> Board View
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="list">
              <FaList /> List View
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="board">
            {!status && (
              <Row className="gy-3 gx-4 mb-4">
                <Col><TaskTitle label="To Do" className={TASK_TYPE.todo} /></Col>
                <Col><TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} /></Col>
                <Col><TaskTitle label="Completed" className={TASK_TYPE.completed} /></Col>
              </Row>
            )}
            <BoardView tasks={tasks} />
          </Tab.Pane>

          <Tab.Pane eventKey="list">
            <Table tasks={tasks} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <AddTask open={open} setOpen={setOpen} />
    </Container>
  );
};

export default TasksAlt;
