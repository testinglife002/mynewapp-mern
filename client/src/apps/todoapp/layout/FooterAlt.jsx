import React from "react";
import { Box, Typography } from "@mui/material";

const FooterAlt = () => (
  <Box sx={{ textAlign: "center", py: 2, bgcolor: "#eeeeee", mt: "auto" }}>
    <Typography variant="body2">© {new Date().getFullYear()} All rights reserved.</Typography>
  </Box>
);

export default FooterAlt;
