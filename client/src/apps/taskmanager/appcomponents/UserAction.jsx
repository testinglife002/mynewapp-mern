import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from "@mui/material";
import { FaQuestion } from "react-icons/fa";

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>
        <Box
          sx={{
            p: 2,
            borderRadius: "50%",
            display: "inline-flex",
            backgroundColor: "error.light",
            color: "error.main",
          }}
        >
          <FaQuestion size={60} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" align="center" color="text.secondary">
          Are you sure you want to activate or deactivate this account?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button variant="contained" color="error" onClick={onClick}>
          Yes
        </Button>
        <Button variant="outlined" onClick={closeDialog}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
