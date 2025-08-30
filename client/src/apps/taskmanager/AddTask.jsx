import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import { BiImages } from "react-icons/bi";
import ModalWrapper from "./layout/ModalWrapper";
import UserList from "./UserList";
import SelectList from "./SelectList";
import Button from "./layout/Button";
import newRequest from "../../utils/newRequest";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen }) => {
  const task = null; // replace with actual task if editing

  const [formData, setFormData] = useState({
    title: task?.title || "",
    date: task?.date || "",
  });

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelect = (e) => {
    setAssets([...e.target.files]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        stage,
        priority,
        team,
        // Optionally handle assets upload and include URLs
      };

      const res = await newRequest.post("/tasks", payload);
      console.log("Task Created:", res.data);
      setOpen(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={submitHandler}>
        <Typography
          variant="h6"
          component="h2"
          className="mb-4"
          sx={{ fontWeight: 700, color: "#212529" }}
        >
          {task ? "UPDATE TASK" : "ADD / CREATE TASK"}
        </Typography>

        <div className="d-flex flex-column gap-4">
          {/* Title */}
          <Form.Group controlId="taskTitle">
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter task title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Assigned Team */}
          <UserList team={team} setTeam={setTeam} />

          {/* Stage and Date */}
          <Row className="g-3">
            <Col md={6}>
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />
            </Col>
            <Col md={6}>
              <Form.Group controlId="taskDate">
                <Form.Label>Task Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Priority and File Upload */}
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <SelectList
                label="Priority Level"
                lists={PRIORITY}
                selected={priority}
                setSelected={setPriority}
              />
            </Col>
            <Col md={6} className="d-flex justify-content-center mt-3 mt-md-0">
              <Form.Label
                htmlFor="imgUpload"
                className="d-flex align-items-center gap-2 text-primary cursor-pointer mb-0"
                style={{ userSelect: "none", cursor: "pointer" }}
              >
                <BiImages size={24} />
                <span>Add Assets</span>
              </Form.Label>
              <Form.Control
                type="file"
                id="imgUpload"
                className="d-none"
                onChange={handleSelect}
                accept=".jpg, .png, .jpeg"
                multiple
              />
            </Col>
          </Row>

          {/* Buttons */}
          <div className="bg-light py-3 d-flex justify-content-end gap-3">
            {uploading ? (
              <span className="text-danger py-2">Uploading assets...</span>
            ) : (
              <>
                <Button
                  type="submit"
                  className="bg-primary px-4 text-white fw-semibold"
                  label="Submit"
                />
                <Button
                  type="button"
                  className="bg-white border px-4 fw-semibold text-dark"
                  onClick={() => setOpen(false)}
                  label="Cancel"
                />
              </>
            )}
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
