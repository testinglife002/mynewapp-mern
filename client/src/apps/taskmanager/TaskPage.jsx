// TaskPage.jsx or wherever you manage the modal state
import { useState, useEffect } from "react";
import AddNewTaskModal from "./AddNewTaskModal";
import newRequest from "../../utils/newRequest";
import Example from "./Example";

const TaskPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [teamUsers, setTeamUsers] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await newRequest.get("/users/user-list");
        setTeamUsers(res.data);
        // console.log(teamUsers);
        // console.log(res.data);
      } catch (err) {
        console.error("Failed to load team:", err);
      }
    };

    fetchTeam();
  }, []);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn btn-primary">
        + Add Task
      </button>

      <AddNewTaskModal
        show={showModal}
        onHide={() => setShowModal(false)}
        team={team}
        setTeam={setTeam}
        allUsers={teamUsers}
      />

      <Example allUsers={teamUsers} />

    </>
  );
};

export default TaskPage;
