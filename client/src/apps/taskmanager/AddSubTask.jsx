import React from "react";
// import ModalWrapper from "../ModalWrapper";
import { useForm } from "react-hook-form";
import { Form, Row, Col, Button as RBButton } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import ModalWrapper from "./layout/ModalWrapper";
import Button from "./layout/Button";
import Textbox from "./layout/Textbox";
// import Textbox from "../Textbox";
// import Button from "../Button";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async (data) => {
    // Your submit logic here
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <Typography variant="h6" component="h2" className="mb-4">
          ADD SUB-TASK
        </Typography>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Sub-Task title"
            {...register("title", { required: "Title is required!" })}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
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

          <Col md={6}>
            <Form.Group>
              <Form.Label>Tag</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tag"
                {...register("tag", { required: "Tag is required!" })}
                isInvalid={!!errors.tag}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tag?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-3 py-3 border-top">
          <Button
            type="submit"
            label="Add Task"
            className="bg-primary text-white"
          />

          <RBButton variant="outline-secondary" onClick={() => setOpen(false)}>
            Cancel
          </RBButton>
        </div>
      </Form>
    </ModalWrapper>
  );
};

export default AddSubTask;
