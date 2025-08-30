import React from "react";
import { Fab, Zoom } from "@mui/material";
import { Add } from "@mui/icons-material";

const FloatingActionButtonAlt = () => {
  const handleClick = () => {
    // Open modal or navigate
    alert("Open Add Todo Modal");
  };

  return (
    <Zoom in={true}>
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1200,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        onClick={handleClick}
      >
        <Add />
      </Fab>
    </Zoom>
  );
};

export default FloatingActionButtonAlt;
