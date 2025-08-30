// layouts/TodoMainLayout.jsx
import React from "react";

import { Box } from "@mui/material";
import SidebarUI from "./SidebarUI";

const TodoMainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarUI />
      <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: "100vh", background: "#f8f9fa" }}>
        {children}
      </Box>
    </Box>
  );
};

export default TodoMainLayout;
