// src/components/ActivityFeeds.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Button,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewListIcon from "@mui/icons-material/ViewList";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// ⏱️ Format relative time
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const ActivityFeeds = ({ board }) => {
  const [openModal, setOpenModal] = useState(false);
  const [tab, setTab] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleModalToggle = () => setOpenModal(!openModal);

  // 🟢 Collect and sort activities of this board
  const activities = useMemo(() => {
    if (!board || !board.activity) return [];
    return [...board.activity].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [board]);

  // console.log(board);

  return (
    <Box
      sx={{
        p: 2,
        background: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 3,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Activity & Notifications
        </Typography>

        <Box>
          <IconButton onClick={handleModalToggle} title="Toggle View">
            {tab === 0 ? <ViewListIcon /> : <ViewKanbanIcon />}
          </IconButton>
          <IconButton color="primary" onClick={handleModalToggle}>
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mt: 1 }}
        variant={isMobile ? "scrollable" : "standard"}
      >
        <Tab label="Activity Feed" />
        <Tab label="Notifications" />
      </Tabs>

      <Box mt={2}>
        <List>
          {activities.length > 0 ? (
            activities.map((activity, idx) => (
              <ListItem
                key={activity._id || idx}
                sx={{
                  backgroundColor: "#ffffff",
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit" size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <>
                      <strong>{activity.user?.username || "A user"}</strong>{" "}
                      {activity.action} {activity.details}
                    </>
                  }
                  secondary={timeSince(activity.timestamp)}
                />
              </ListItem>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ py: 2 }}
            >
              No activity recorded yet.
            </Typography>
          )}
        </List>
      </Box>

      {/* Modal for toggling board/list */}
      <Modal open={openModal} onClose={handleModalToggle}>
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : 400,
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Switch Board View</Typography>
            <IconButton onClick={handleModalToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              startIcon={<ViewKanbanIcon />}
            >
              Kanban View
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<ViewListIcon />}
            >
              List View
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default ActivityFeeds;
