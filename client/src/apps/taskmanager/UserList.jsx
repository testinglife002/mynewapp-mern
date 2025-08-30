import React, { useState } from "react";
import { Form, Badge, Button, InputGroup } from "react-bootstrap";
import Typography from "@mui/material/Typography";

const UserList = ({ team, setTeam }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddMember = () => {
    if (inputValue.trim() && !team.includes(inputValue.trim())) {
      setTeam([...team, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveMember = (member) => {
    setTeam(team.filter((m) => m !== member));
  };

  return (
    <Form.Group className="mb-3">
      <Typography variant="subtitle1" component="label" className="mb-2 d-block">
        Task Team
      </Typography>

      <div className="mb-2">
        {team.length === 0 && <div className="text-muted">No team members added.</div>}
        {team.map((member) => (
          <Badge
            key={member}
            bg="primary"
            className="me-2 mb-2 d-inline-flex align-items-center"
          >
            {member}
            <Button
              variant="light"
              size="sm"
              className="ms-2 p-0"
              onClick={() => handleRemoveMember(member)}
              aria-label={`Remove ${member}`}
              style={{ lineHeight: 1 }}
            >
              &times;
            </Button>
          </Badge>
        ))}
      </div>

      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Add team member"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddMember();
            }
          }}
        />
        <Button variant="primary" onClick={handleAddMember}>
          Add
        </Button>
      </InputGroup>
    </Form.Group>
  );
};

export default UserList;
