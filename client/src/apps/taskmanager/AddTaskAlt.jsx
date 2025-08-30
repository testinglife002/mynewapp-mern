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
  FormControl
} from '@mui/material';

const AddTaskAlt = ( { open, setOpen } ) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent dividers>
        <TextField fullWidth label="Task Title" variant="outlined" margin="normal" />
        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select defaultValue="medium" label="Priority">
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth type="date" label="Due Date" variant="outlined" margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={() => setOpen(false)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddTaskAlt;

