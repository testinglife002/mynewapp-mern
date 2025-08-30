import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
} from "@mui/material";
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import clsx from "clsx";
// import { useSelector } from "react-redux";
// import AddSubTask from "./task/AddSubTask";
// import TaskDialog from "./task/TaskDialog";
// import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import AddSubTask from "../AddSubTask";
import TaskDialog from "./TaskDialog";
import UserInfo from "./UserInfo";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../../utils";
// import UserInfo from "./UserInfo";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  // const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  console.log(task);
  console.log("📝 TaskCard - rendering task:", task);
  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          {/* Priority and Edit */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                color="primary"
                className={PRIOTITYSTYELS[task.priority]}
              >
                {ICONS[task.priority]} {task.priority?.toUpperCase()} Priority
              </Typography>
            </Stack>
            {/* user?.isAdmin && <TaskDialog task={task} /> */}
          </Stack>

          {/* Title */}
          <Stack direction="row" alignItems="center" spacing={1} mt={2}>
            <div className={clsx("rounded-circle", TASK_TYPE[task.stage])} style={{ width: 10, height: 10 }} />
            <Typography variant="h6" noWrap>{task?.title}</Typography>
          </Stack>

          {/* Date */}
          <Typography variant="body2" color="text.secondary">
            {formatDate(new Date(task?.date))}
          </Typography>

          <Divider className="my-2" />

          {/* Task Info */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} className="text-muted">
              <span><BiMessageAltDetail /> {task.activities?.length}</span>
              <span><MdAttachFile /> {task.assets?.length}</span>
              <span><FaList /> 0/{task?.subTasks?.length}</span>
            </Stack>

            <Stack direction="row" spacing={-1}>
              {task.team?.map((m, index) => (
                <Tooltip title={<UserInfo user={m} />} key={index}>
                  <Avatar sx={{ bgcolor: BGS[index % BGS.length], width: 30, height: 30, fontSize: 14 }}>
                    {m?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Stack>
          </Stack>

          {/* Subtask Preview */}
          <Divider className="my-2" />
          {task?.subTasks?.length > 0 ? (
            <Stack>
              <Typography variant="body1">{task.subTasks[0].title}</Typography>
              <Stack direction="row" spacing={2}>
                <Typography variant="caption">{formatDate(new Date(task.subTasks[0].date))}</Typography>
                <Chip
                  label={task.subTasks[0].tag}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" className="text-muted">No Sub Task</Typography>
          )}

          {/* Add Subtask */}
          <Divider className="my-2" />
          <button
            onClick={() => setOpen(true)}
            disabled={!user?.isAdmin}
            className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <IoMdAdd />
            ADD SUBTASK
          </button>
        </CardContent>
      </Card>

      {/* Add Sub Task Modal */}
      <AddSubTask open={open} setOpen={setOpen} id={task._id} />
    </>
  );
};

export default TaskCard;
