// TaskCard.jsx
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Card, Badge, Button, Stack, OverlayTrigger, Tooltip, ListGroup, Modal, Form, Row, Col } from "react-bootstrap";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import clsx from "clsx";
// import { useSelector } from "react-redux";
// import AddSubTask from "./task/AddSubTask";
// import TaskDialog from "./task/TaskDialog";
// import UserInfo from "./UserInfo";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import TaskDialog from "./appcomponents/TaskDialog";
import UserInfo from "./appcomponents/UserInfo";
import AddSubTask from "./appcomponents/AddSubTask";
import EditTaskDialog from "./appcomponents/EditTaskDialog";
import TaskDialogs from "./appcomponents/TaskDialogs";
// import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../../utils";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  // const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  // For Add Subtask modal visibility
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  // Subtask form data
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskTag, setSubtaskTag] = useState("");
  // console.log("📝 TaskCard - rendering task:", task);
  // useEffect(() => {
   // console.log("✅ Updated tasks from API:", task);
  // }, [task]);

  // Add Subtask submit handler
  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) {
      alert("Subtask title is required");
      return;
    }
    try {
      const res = await newRequest.post(`/tasks/${task._id}/subtasks`, {
        title: subtaskTitle,
        tag: subtaskTag,
      });
      if (res.data.status) {
        // Update task subtasks locally
        onTaskUpdated({
          ...task,
          subTasks: res.data.subTasks,
        });
        setShowSubtaskModal(false);
        setSubtaskTitle("");
        setSubtaskTag("");
      }
    } catch (err) {
      console.error("Error adding subtask:", err);
    }
  };

    const priorityColors = {
        low: "success",
        medium: "warning",
        high: "danger",
    };
  return (
    <>
      <Card className="shadow-sm h-100">
        <Card.Body>
           <Card.Title>
            {task.title}
            <Badge bg={priorityColors[task.priority]} className="ms-2 text-capitalize">
                {task.priority}
            </Badge>
          </Card.Title>
          <Stack direction="horizontal" className="justify-content-between mb-2">
            <div className={clsx("d-flex align-items-center gap-1", PRIOTITYSTYELS[task?.priority])}>
              {ICONS[task?.priority]}
              <span className="text-uppercase fw-semibold small">
                {task?.priority} Priority
              </span>
            </div>

            {/* user?.isAdmin && <TaskDialog task={task} />*/}
            <TaskDialogs task={task} />
            {/*<EditTaskDialog task={task} />*/}
          </Stack>

          <div className="d-flex align-items-center gap-2 mb-1">
            <span className={clsx("rounded-circle", TASK_TYPE[task?.stage])} style={{ width: 10, height: 10 }}></span>
            <h5 className="mb-0 text-truncate">{task?.title}</h5>
          </div>
          <small className="text-muted">{formatDate(new Date(task?.date))}</small>

          <hr />

          <Stack direction="horizontal" className="justify-content-between mb-3">
            <Stack direction="horizontal" gap={3}>
              <div className="d-flex align-items-center gap-1 text-muted small">
                <BiMessageAltDetail />
                <span>{task?.activities?.length}</span>
              </div>
              <div className="d-flex align-items-center gap-1 text-muted small">
                <MdAttachFile />
                <span>{task?.assets?.length}</span>
              </div>
              <div className="d-flex align-items-center gap-1 text-muted small">
                <FaList />
                <span>0/{task?.subTasks?.length}</span>
              </div>
            </Stack>

            <Stack direction="horizontal" gap={-1} className="flex-row-reverse">
              {task?.team?.map((member, index) => (
                <OverlayTrigger
                  key={index}
                  placement="top"
                  overlay={<Tooltip>{member.name}</Tooltip>}
                >
                  <div
                    className={clsx(
                      "rounded-circle text-white text-center d-flex align-items-center justify-content-center",
                      BGS[index % BGS.length]
                    )}
                    style={{ width: "28px", height: "28px", marginLeft: "-8px" }}
                  >
                    <UserInfo user={member} />
                  </div>
                </OverlayTrigger>
              ))}
            </Stack>
          </Stack>

          {/* Subtasks */}
          {task?.subTasks?.length > 0 ? (
            <div className="border-top pt-3">
              <h6 className="mb-1">{task?.subTasks[0].title}</h6>
              <small className="text-muted">{formatDate(new Date(task?.subTasks[0].date))}</small>
              <Badge bg="primary" className="ms-2">{task?.subTasks[0].tag}</Badge>
            </div>
          ) : (
            <div className="border-top pt-3 text-muted">No Sub Task</div>
          )}

          {/* Add Subtask Button 
          <div className="pt-3">
            <Button
              variant="outline-secondary"
              size="sm"
              className="w-100 d-flex align-items-center gap-2"
              onClick={() => setOpen(true)}
              // disabled={!user?.isAdmin}
            >
              <IoMdAdd />
              ADD SUBTASK
            </Button>
          </div>
          */}

          {/* Subtasks Section */}
          <div className="mt-4">
            <h6>
              Subtasks{" "}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowSubtaskModal(true)}
              >
                + Add Subtask
              </Button>
              &nbsp;&nbsp;&nbsp;
              {task.subTasks?.length}
            </h6>
            {task.subTasks?.length === 0 && <p className="text-muted">No subtasks yet.</p>}
            {/*<ListGroup>
              {task.subTasks?.map((subtask, idx) => (
                <ListGroup.Item key={idx}>
                  <Row>
                    <Col xs={8}>{subtask.title}</Col>
                    <Col xs={4} className="text-end text-muted">
                      {subtask.tag && <Badge bg="info" className="me-2">{subtask.tag}</Badge>}
                      {subtask.date && dayjs(subtask.date).format("MMM D, YYYY")}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>*/}
            
          </div>
          
        </Card.Body>
      </Card>

      {/*<AddSubTask open={open} setOpen={setOpen} id={task._id} />*/}
      
      {/* Add Subtask Modal */}
      <Modal
        show={showSubtaskModal}
        onHide={() => setShowSubtaskModal(false)}
        centered
      >
        <Modal.Header closeButton>
            <Modal.Title>Add Subtask</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3">
            <Form.Label>Subtask Title</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter subtask title"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                autoFocus
            />
            </Form.Group>
            <Form.Group>
            <Form.Label>Tag (optional)</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter tag"
                value={subtaskTag}
                onChange={(e) => setSubtaskTag(e.target.value)}
            />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleAddSubtask}>
            Add
            </Button>
            <Button variant="secondary" onClick={() => setShowSubtaskModal(false)}>
            Cancel
            </Button>
        </Modal.Footer>
    </Modal>

    </>
  );
};

export default TaskCard;
