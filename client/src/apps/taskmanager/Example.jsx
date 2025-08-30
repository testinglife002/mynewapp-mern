import { useState } from "react";
import SelectList from "./SelectListAlt";
import UserListAlt from "./UserListAlt";


const Example = ({allUsers = []}) => {
  const [team, setTeam] = useState([]);
  const [status, setStatus] = useState("To Do");
  // console.log(allUsers)

  const statusOptions = ["To Do", "In Progress", "Completed"];

  return (
    <div className="container mt-4">
      <UserListAlt setTeam={setTeam} team={team} allUsers={allUsers} />
      <SelectList
        lists={statusOptions}
        selected={status}
        setSelected={setStatus}
        label="Task Status"
      />
    </div>
  );
};

export default Example;