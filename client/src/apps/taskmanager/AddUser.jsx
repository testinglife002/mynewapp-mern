import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Modal, Button as BootstrapButton, Form, Spinner } from "react-bootstrap";
import { DialogTitle } from "@mui/material";

const AddUser = ({ open, setOpen, userData }) => {
  const defaultValues = userData ?? {};
  const { user } = useSelector((state) => state.auth);

  const isLoading = false;
  const isUpdating = false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const handleOnSubmit = (data) => {
    console.log("Submitted", data);
  };

  return (
    <Modal show={open} onHide={() => setOpen(false)} centered>
      <Form onSubmit={handleSubmit(handleOnSubmit)}>
        <Modal.Header closeButton>
          <DialogTitle>
            {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
          </DialogTitle>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Full Name"
              isInvalid={errors.name}
              {...register("name", { required: "Full name is required!" })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              isInvalid={errors.title}
              {...register("title", { required: "Title is required!" })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email Address"
              isInvalid={errors.email}
              {...register("email", { required: "Email is required!" })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="Role"
              isInvalid={errors.role}
              {...register("role", { required: "Role is required!" })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.role?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          {isLoading || isUpdating ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <BootstrapButton type="submit" variant="primary">
                Submit
              </BootstrapButton>
              <BootstrapButton variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </BootstrapButton>
            </>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUser;
