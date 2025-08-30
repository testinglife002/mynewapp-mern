import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { format } from "date-fns";

const AddSubTask = ({ open, setOpen, id }) => {
  const [form, setForm] = useState({
    title: "",
    tag: "Feature",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // TODO: Add your API call to create a subtask with `form` and `id`
    console.log("New SubTask for task ID:", id, form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>Add Subtask</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Tag</InputLabel>
          <Select name="tag" value={form.tag} onChange={handleChange} label="Tag">
            <MenuItem value="Feature">Feature</MenuItem>
            <MenuItem value="Bug">Bug</MenuItem>
            <MenuItem value="Task">Task</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSubTask;
