// components/TaskTitleMUI.jsx
import React from "react";
import { IoMdAdd } from "react-icons/io";
import { Box, Typography, IconButton } from "@mui/material";

const TaskTitleMUI = ({ label, className, onAddClick }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={1}
      bgcolor="white"
      borderRadius={1}
      boxShadow={1}
      width="100%"
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Box
          className={className}
          sx={{ width: 16, height: 16, borderRadius: "50%" }}
        />
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>

      <IconButton
        size="small"
        sx={{ display: { xs: "none", md: "inline-flex" } }}
        onClick={onAddClick}
      >
        <IoMdAdd />
      </IconButton>
    </Box>
  );
};

export default TaskTitleMUI;
