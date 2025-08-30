import React, { useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { MdOutlineEdit, MdAdd } from "react-icons/md";
import { HiDuplicate } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AddTask from "../AddTask";
import AddSubTask from "../AddSubTask";
import ConfirmationDialog from "./ConfirmationDialog";
import newRequest from "../../../utils/newRequest";

const TaskDialogs = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAddSub, setOpenAddSub] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  const openMenu = Boolean(anchorEl);

  const fetchTasks = async () => {
    try {
      const res = await newRequest.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const duplicateHandler = async () => {
    try {
      const res = await newRequest.post(`/tasks/duplicate/${task._id}`);
      if (res.data.status) {
        // Show success toast
        console.log(res.data.message);
        // Optionally refresh tasks or navigate
         fetchTasks(); // if you have a list refresh function
      }
    } catch (err) {
      console.error("Error duplicating task:", err);
    }
  };


  const deleteHandler = async () => {
    try {
      const res = await newRequest.delete(`/tasks/delete/${task._id}?actionType=delete`);
      if (res.data.status) {
        console.log(res.data.message);
        // Optionally refresh task list after deletion
        // fetchTasks();
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };


  const menuItems = [
    {
      label: "Open Task",
      icon: <AiTwotoneFolderOpen size={20} />,
      onClick: () => navigate(`/task/${task._id}`),
    },
    {
      label: "Edit",
      icon: <MdOutlineEdit size={20} />,
      onClick: () => setOpenEdit(true),
    },
    {
      label: "Add Sub-Task",
      icon: <MdAdd size={20} />,
      onClick: () => setOpenAddSub(true),
    },
    {
      label: "Duplicate",
      icon: <HiDuplicate size={20} />,
      onClick: duplicateHandler,
    },
  ];

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <BsThreeDots />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              item.onClick();
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}

        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            setOpenConfirm(true);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <RiDeleteBin6Line size={20} color="red" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} />
      <AddSubTask open={openAddSub} setOpen={setOpenAddSub} />
      <ConfirmationDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskDialogs;
