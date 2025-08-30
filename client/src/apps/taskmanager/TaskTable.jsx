import React, { useState } from "react";
import { Table, Container, Row, Col, Button as BsButton, Image } from "react-bootstrap";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  KeyboardDoubleArrowUp,
  AttachFile,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { FaList } from "react-icons/fa";
import clsx from "clsx";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../utils";
import UserInfo from "../UserInfo"; // assuming custom avatar popup
import ConfirmatioDialog from "../Dialogs"; // confirm delete dialog

const ICONS = {
  high: <KeyboardDoubleArrowUp />,
  medium: <KeyboardArrowUp />,
  low: <KeyboardArrowDown />,
};

const TaskTable = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = () => {
    // TODO: implement deletion
  };

  return (
    <>
      <Container fluid className="bg-white p-3 shadow rounded mt-3">
        <Row>
          <Col>
            <div className="table-responsive">
              <Table bordered hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Task Title</th>
                    <th>Priority</th>
                    <th>Created At</th>
                    <th>Assets</th>
                    <th>Team</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={clsx("rounded-circle", TASK_TYPE[task.stage])}
                            style={{ width: "12px", height: "12px" }}
                          />
                          <span className="fw-medium">{task?.title}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <span
                            className={clsx("fs-5", PRIOTITYSTYELS[task?.priority])}
                          >
                            {ICONS[task?.priority]}
                          </span>
                          <span className="text-capitalize">{task?.priority} Priority</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{formatDate(new Date(task?.date))}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-3 text-muted">
                          <div className="d-flex align-items-center gap-1">
                            <ChatBubbleOutline fontSize="small" />
                            <span>{task?.activities?.length}</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <AttachFile fontSize="small" />
                            <span>{task?.assets?.length}</span>
                          </div>
                          <div className="d-flex align-items-center gap-1">
                            <FaList size={14} />
                            <span>0/{task?.subTasks?.length}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex">
                          {task?.team?.map((user, i) => (
                            <div
                              key={user._id}
                              className={clsx(
                                "rounded-circle text-white text-center me-1",
                                BGS[i % BGS.length]
                              )}
                              style={{
                                width: "30px",
                                height: "30px",
                                fontSize: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title={user?.username}
                            >
                              <UserInfo user={user} />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="text-end">
                        <BsButton
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          Edit
                        </BsButton>
                        <BsButton
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteClicks(task._id)}
                        >
                          Delete
                        </BsButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Confirmation Dialog */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskTable;
