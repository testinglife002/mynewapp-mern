import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide
} from '@mui/material';

// Optional: Slide transition (can be removed if not needed)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmatioDialog = ({ open, setOpen, onClick }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onClick(); // Call your delete or confirm action
    handleClose(); // Close dialog after action
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {"Are you sure you want to delete this item?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          This action cannot be undone. Please confirm if you'd like to proceed with deleting the task.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={handleConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmatioDialog;
