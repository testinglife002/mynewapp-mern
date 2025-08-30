import React from "react";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Collapse, Typography
} from "@mui/material";
import {
  Dashboard, ExpandLess, ExpandMore, Settings,
  ListAlt, Folder, Menu
} from "@mui/icons-material";

const drawerWidth = 240;

const SidebarAlt = ({ open, toggleSidebar }) => {
  const [openProjects, setOpenProjects] = React.useState(false);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 60,
          transition: "0.3s",
          overflowX: "hidden",
          bgcolor: "#212121",
          color: "#fff",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
        <Menu onClick={toggleSidebar} style={{ cursor: "pointer", color: "white" }} />
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#90caf9" }}><Dashboard /></ListItemIcon>
            {open && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding onClick={() => setOpenProjects(!openProjects)}>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#f48fb1" }}><Folder /></ListItemIcon>
            {open && <ListItemText primary="Projects" />}
            {open && (openProjects ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={openProjects} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#aed581" }}><ListAlt /></ListItemIcon>
                {open && <ListItemText primary="My Todos" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon sx={{ color: "#ffcc80" }}><Settings /></ListItemIcon>
            {open && <ListItemText primary="Settings" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SidebarAlt;
