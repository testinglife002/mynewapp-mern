import React, { useState } from "react";
import { Button as MUIButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, Stack } from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { summary } from "../assets/data";
import { getInitials } from "../utils";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import AddUser from "../components/AddUser";



const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography variant="h5">Team Members</Typography>
        <MUIButton
          variant="contained"
          color="primary"
          startIcon={<IoMdAdd />}
          onClick={() => setOpen(true)}
        >
          Add New User
        </MUIButton>
      </div>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.users.map((user, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography>{user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.title}</TableCell>
                  <TableCell>{user.email || "user.email.com"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <MUIButton
                      variant="contained"
                      size="small"
                      color={user.isActive ? "primary" : "warning"}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </MUIButton>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <MUIButton
                        variant="text"
                        color="primary"
                        onClick={() => editClick(user)}
                      >
                        Edit
                      </MUIButton>
                      <MUIButton
                        variant="text"
                        color="error"
                        onClick={() => deleteClick(user._id)}
                      >
                        Delete
                      </MUIButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <AddUser open={open} setOpen={setOpen} userData={selected} />
      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={() => {}} />
      <UserAction open={openAction} setOpen={setOpenAction} onClick={() => {}} />
    </div>
  );
};

export default Users;
