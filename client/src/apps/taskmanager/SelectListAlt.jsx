// components/SelectList.jsx
import React from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { MdCheck } from "react-icons/md";

const SelectListAlt = ({ lists, selected, setSelected, label }) => {
  return (
    <Box className="mb-3">
      {label && (
        <Typography variant="body1" className="mb-1">
          {label}
        </Typography>
      )}
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
          {selected || "Select an option"}
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100">
          {lists.map((item, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => setSelected(item)}
              active={selected === item}
              className="d-flex justify-content-between align-items-center"
            >
              {item}
              {selected === item && <MdCheck className="text-warning" />}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Box>
  );
};

export default SelectListAlt;
