import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { MdEdit } from "react-icons/md";
import axios from "axios"; // Replace with your newRequest if needed

const EditTaskDialog = ({ task, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || "",
    priority: task?.priority || "medium",
    stage: task?.stage || "todo",
  });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(`http://localhost:8800/api/tasks/${task._id}`, form);
      setSnack({ open: true, message: "Task updated successfully!", severity: "success" });
      onUpdate?.(data.task); // Trigger optional callback
      handleClose();
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        message: err?.response?.data?.message || "Failed to update task",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton size="small" color="primary" onClick={handleOpen}>
        <MdEdit />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={form.priority} onChange={handleChange} label="Priority">
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Stage</InputLabel>
            <Select name="stage" value={form.stage} onChange={handleChange} label="Stage">
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="inprogress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={22} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          variant="filled"
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditTaskDialog;
