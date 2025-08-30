// src/layout/TodoFloatingActions.jsx
import React, { useState } from "react";
import { Fab, Menu, MenuItem } from "@mui/material";
import { Add, AddTask, Notes, Category } from "@mui/icons-material";

const TodoFloatingActions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div style={{ position: "fixed", bottom: 30, right: 30 }}>
      <Fab color="primary" onClick={handleClick}>
        <Add />
      </Fab>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => window.location.href = "/add-todos"}>
          <AddTask className="me-2" /> Add Todos
        </MenuItem>
        <MenuItem onClick={() => window.location.href = "/add-note"}>
          <Notes className="me-2" /> Add Note
        </MenuItem>
        <MenuItem onClick={() => window.location.href = "/add-tag"}>
          <Category className="me-2" /> Add Tag
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TodoFloatingActions;
