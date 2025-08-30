import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import SidebarAlt from "./SidebarAlt";
import NavbarAlt from "./NavbarAlt";
import FooterAlt from "./FooterAlt";
import FloatingActionButtonAlt from "./FloatingActionButtonAlt";

const LayoutTodo = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9f9f9" }}>
        <SidebarAlt open={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Box sx={{ flexGrow: 1 }}>
          <NavbarAlt toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <Box component="main" sx={{ p: 2, mt: 8 }}>
            {/* Replace with your routes/pages */}
            <h2>Welcome to your Dashboard!</h2>
          </Box>
          <FooterAlt />
        </Box>
        <FloatingActionButtonAlt />
      </Box>
    </>
  );
};

export default LayoutTodo;
