import React from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Textbox = ({ name, label, register, error, required = false, ...rest }) => {

   /* const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm(); */

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type="text"
        placeholder={label}
        isInvalid={!!error}
         {...register(name, required ? { required: `${label} is required` } : {})}
        {...rest}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error.message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Textbox;
