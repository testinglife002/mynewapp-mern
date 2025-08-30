import React, { useState } from "react";
import { Table, Button as RBButton, Container, Row, Col } from "react-bootstrap";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { tasks } from "../assets/data";
import Title from "../components/Title";
import Button from "../components/Button";
import { PRIOTITYSTYELS, TASK_TYPE } from "../utils";
import ConfirmatioDialog from "../components/Dialogs";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

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


const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id) => {
    setType("delete");
    setSelected(id);
    setMsg("Do you want to permanently delete this item?");
    setOpenDialog(true);
  };

  const restoreClick = (id) => {
    setSelected(id);
    setType("restore");
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const TableHeader = () => (
    <thead className="table-light">
      <tr>
        <th>Task Title</th>
        <th>Priority</th>
        <th>Stage</th>
        <th>Modified On</th>
        <th className="text-end">Actions</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }) => (
    <tr>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: TASK_TYPE[item.stage] || "#ccc",
            }}
          ></div>
          <span>{item.title}</span>
        </div>
      </td>
      <td className="text-capitalize">
        <div className="d-flex align-items-center gap-1">
          <span style={{ color: PRIOTITYSTYELS[item.priority] }}>{ICONS[item.priority]}</span>
          <span>{item.priority}</span>
        </div>
      </td>
      <td className="text-capitalize">{item.stage}</td>
      <td>{new Date(item.date).toDateString()}</td>
      <td className="text-end">
        <RBButton variant="outline-success" size="sm" onClick={() => restoreClick(item._id)} className="me-2">
          <MdOutlineRestore />
        </RBButton>
        <RBButton variant="outline-danger" size="sm" onClick={() => deleteClick(item._id)}>
          <MdDelete />
        </RBButton>
      </td>
    </tr>
  );

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4 align-items-center justify-content-between">
        <Col>
          <Title title="Trashed Tasks" />
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <RBButton variant="outline-success" onClick={restoreAllClick}>
            <MdOutlineRestore className="me-1" /> Restore All
          </RBButton>
          <RBButton variant="outline-danger" onClick={deleteAllClick}>
            <MdDelete className="me-1" /> Delete All
          </RBButton>
        </Col>
      </Row>

      <div className="bg-white rounded shadow-sm p-3">
        <div className="table-responsive">
          <Table striped hover className="align-middle">
            <TableHeader />
            <tbody>
              {tasks.map((tk, id) => (
                <TableRow key={id} item={tk} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={() => console.log("Confirm clicked")}
      />
    </Container>
  );
};

export default Trash;
