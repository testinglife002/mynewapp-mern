import React from "react";
import { OverlayTrigger, Popover as BootstrapPopover } from "react-bootstrap";
import { Avatar, Paper, Fade } from "@mui/material";
// import { getInitials } from "../utils";
import { getInitials } from "../../../utils";

const UserInfo = ({ user }) => {
  const initials = getInitials(user?.name);

  const popover = (
    <BootstrapPopover id="user-popover">
      <Fade in={true} timeout={300}>
        <Paper elevation={4} className="p-3 d-flex gap-3 align-items-center">
          <Avatar
            sx={{
              bgcolor: "#0d6efd",
              width: 64,
              height: 64,
              fontSize: "1.8rem",
              fontWeight: "bold",
            }}
          >
            {initials}
          </Avatar>
          <div className="d-flex flex-column">
            <div className="fw-bold text-dark fs-5">{user?.name}</div>
            <div className="text-secondary">{user?.title}</div>
            <div className="text-primary">
              {user?.email ?? "email@example.com"}
            </div>
          </div>
        </Paper>
      </Fade>
    </BootstrapPopover>
  );

  return (
    <div className="px-3">
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={popover}
        rootClose
      >
        <div
          role="button"
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light border"
          style={{ width: 40, height: 40, cursor: "pointer" }}
        >
          <span className="fw-bold text-primary">{initials}</span>
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default UserInfo;
