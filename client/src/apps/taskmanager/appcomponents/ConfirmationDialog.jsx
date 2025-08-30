import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import { FaQuestion } from "react-icons/fa";

export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  const isRestore = type === "restore" || type === "restoreAll";

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>
        <Box
          sx={{
            p: 2,
            borderRadius: "50%",
            display: "inline-flex",
            backgroundColor: isRestore ? "yellow.100" : "error.light",
            color: isRestore ? "warning.main" : "error.main",
          }}
        >
          <FaQuestion size={60} />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" align="center" color="text.secondary">
          {msg ?? "Are you sure you want to delete the selected record?"}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="contained"
          color={isRestore ? "warning" : "error"}
          onClick={onClick}
        >
          {isRestore ? "Restore" : "Delete"}
        </Button>
        <Button variant="outlined" onClick={closeDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
