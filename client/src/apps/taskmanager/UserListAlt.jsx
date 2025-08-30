import React, { useEffect, useState } from "react";
import { Form, Dropdown, Badge, ButtonGroup } from "react-bootstrap";
import { Avatar, Chip, Box, Typography } from "@mui/material";
import { getInitials } from "../../utils"; // Utility to get initials

const UserListAlt = ({ setTeam, team, allUsers = [] }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  // console.log(allUsers)
  // Toggle selection
  const handleSelect = (user) => {
    const exists = selectedUsers.some((u) => u._id === user._id);
    const updatedUsers = exists
      ? selectedUsers.filter((u) => u._id !== user._id)
      : [...selectedUsers, user];

    setSelectedUsers(updatedUsers);
    setTeam(updatedUsers.map((u) => u._id));
  };

  useEffect(() => {
    if (allUsers.length > 0) {
      if (!team || team.length < 1) {
        setSelectedUsers([]);
      } else {
        const preselected = allUsers.filter((user) => team.includes(user._id));
        setSelectedUsers(preselected);
      }
    }
  }, [team, allUsers]);

  return (
    <Box className="mb-3">
      <Typography variant="body1" className="mb-1">Assign Task To:</Typography>
      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
          {selectedUsers.length > 0
            ? selectedUsers.map((user) => user.username).join(", ")
            : "Select team member(s)"}
        </Dropdown.Toggle>
            
        <Dropdown.Menu className="w-100">
          {allUsers.map((user) => (
            <Dropdown.Item
              key={user._id}
              onClick={() => handleSelect(user)}
              active={selectedUsers.some((u) => u._id === user._id)}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ bgcolor: "#673ab7", width: 24, height: 24 }}>
                  <Typography sx={{ fontSize: "0.7rem" }}>
                    {getInitials(user?.username || user?.name || "")}
                  </Typography>
                </Avatar>
                <Typography>{user?.username}</Typography>
              </Box>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
          
      {/* Show selected users */}
      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {selectedUsers.map((user) => (
          <Chip
            key={user._id}
            label={user?.username}
            onDelete={() => handleSelect(user)}
            avatar={<Avatar>{getInitials(user?.username)}</Avatar>}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UserListAlt;
