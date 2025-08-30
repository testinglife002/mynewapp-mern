// components/TitleMUI.jsx
import React from "react";
import Typography from "@mui/material/Typography";

const TitleMUI = ({ title, className }) => {
  return (
    <Typography variant="h6" component="h2" className={className} sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
      {title}
    </Typography>
  );
};

export default TitleMUI;
