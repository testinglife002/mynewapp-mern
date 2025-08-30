import React from "react";
import { Button as BootstrapButton, Spinner } from "react-bootstrap";

const Button = ({ label, type = "submit", isLoading = false, onClick, variant = "primary", ...rest }) => {
  return (
    <BootstrapButton type={type} variant={variant} onClick={onClick} disabled={isLoading} {...rest}>
      {isLoading ? <Spinner size="sm" animation="border" /> : label}
    </BootstrapButton>
  );
};

export default Button;
