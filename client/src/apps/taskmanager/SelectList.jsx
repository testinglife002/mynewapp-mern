import React from "react";
import { Form } from "react-bootstrap";
import Typography from "@mui/material/Typography";

const SelectList = ({ label, lists, selected, setSelected }) => {
  return (
    <Form.Group>
      <Typography variant="subtitle1" component="label" className="mb-2 d-block">
        {label}
      </Typography>
      <Form.Select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        aria-label={label}
      >
        {lists.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectList;
