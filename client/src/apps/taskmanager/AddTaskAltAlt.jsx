import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { useForm } from "react-hook-form";
import { Form, Row, Col, Button as RBButton, Spinner } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import UserList from "./UserListAlt";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTaskAltAlt = ({ open, setOpen }) => {
  const task = "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(task?.priority?.toUpperCase() || PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const submitHandler = () => {
    // Your submit logic here
  };

  const handleSelect = (e) => {
    setAssets(e.target.files);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography variant="h6" component="h2" className="mb-4">
          {task ? "UPDATE TASK" : "ADD TASK"}
        </Typography>

        <Form.Group className="mb-3">
          <Form.Label>Task Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Task Title"
            {...register("title", { required: "Title is required" })}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <UserList setTeam={setTeam} team={team} />

        <Row className="mb-3">
          <Col md={6}>
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Task Date</Form.Label>
              <Form.Control
                type="date"
                {...register("date", { required: "Date is required!" })}
                isInvalid={!!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center">
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
              className="d-flex align-items-center gap-2 text-primary fw-semibold cursor-pointer"
              style={{ userSelect: "none" }}
            >
              <BiImages size={24} />
              Add Assets
            </Form.Label>
            <Form.Control
              type="file"
              id="imgUpload"
              multiple
              accept=".jpg,.png,.jpeg"
              onChange={handleSelect}
              hidden
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-3 py-3 border-top">
          {uploading ? (
            <span className="text-danger py-2">Uploading assets</span>
          ) : (
            <Button
              type="submit"
              label="Submit"
              className="bg-primary px-4 text-white"
            />
          )}

          <RBButton variant="outline-secondary" onClick={() => setOpen(false)}>
            Cancel
          </RBButton>
        </div>
      </Form>
    </ModalWrapper>
  );
};

export default AddTaskAltAlt;
