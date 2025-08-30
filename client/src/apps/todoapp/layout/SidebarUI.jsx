// components/SidebarUI.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Home,
  Folder,
  Task,
  Settings,
  Menu,
  ExpandLess,
  ExpandMore,
  Category,
  LabelImportant,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidthExpanded = 250;
const drawerWidthCollapsed = 80;

const SidebarUI = () => {
  const [isExpanded, setIsExpanded] = useState(
    localStorage.getItem("sidebarExpanded") === "false" ? false : true
  );
  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded);
  }, [isExpanded]);

  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  const toggleSubmenu = () => setSubmenuOpen((prev) => !prev);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
          transition: "width 0.3s ease",
          boxSizing: "border-box",
          backgroundColor: "#1e1e2f",
          color: "#fff",
          overflowX: "hidden",
        },
      }}
    >
      {/* Top Hamburger Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: isExpanded ? "flex-end" : "center",
          padding: "10px",
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: "#fff" }}>
          <Menu />
        </IconButton>
      </div>

      <List>
        <Tooltip title={!isExpanded ? "Home" : ""} placement="right" arrow>
          <ListItem button component={Link} to="/">
            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
              <Home />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Home" />}
          </ListItem>
        </Tooltip>

        {/* DROPDOWN MENU: Projects */}
        <Tooltip title={!isExpanded ? "Projects" : ""} placement="right" arrow>
          <ListItem button onClick={toggleSubmenu}>
            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
              <Task />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Projects" />}
            {isExpanded && (submenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
        </Tooltip>

        <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/projects/list" sx={{ pl: isExpanded ? 4 : 2 }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <Folder />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="All Projects" />}
            </ListItem>
            <ListItem button component={Link} to="/projects/categories" sx={{ pl: isExpanded ? 4 : 2 }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <Category />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Categories" />}
            </ListItem>
            <ListItem button component={Link} to="/projects/tags" sx={{ pl: isExpanded ? 4 : 2 }}>
              <ListItemIcon sx={{ color: "#fff" }}>
                <LabelImportant />
              </ListItemIcon>
              {isExpanded && <ListItemText primary="Tags" />}
            </ListItem>
          </List>
        </Collapse>

        {/* Settings */}
        <Tooltip title={!isExpanded ? "Settings" : ""} placement="right" arrow>
          <ListItem button component={Link} to="/settings">
            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
              <Settings />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Settings" />}
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default SidebarUI;
