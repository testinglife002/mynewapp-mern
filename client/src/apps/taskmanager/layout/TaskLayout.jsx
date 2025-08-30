// Layout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import AppNavbar from "./AppNavbar";
import AllTasks from "../AllTasks";
import AddProjectModal from "../AddProjectModal";
import AddTaskModal from "../AddTaskModal";
import AddTaskAlt from "../AddTaskAlt";
import { Button } from '@mui/material';
import SidebarAlt from "./SidebarAlt";
import AddNewTaskModal from "../AddNewTaskModal";
import newRequest from "../../../utils/newRequest";

const TaskLayout = ({user}) => {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState(["Project Alpha", "Project Beta"]);
  const [tasks, setTasks] = useState({
    "Project Alpha": ["Task 1", "Task 2"],
    "Project Beta": ["Task 3"],
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [onTaskModal, setOnTaskModal] = useState(false);

  const handleAddProject = (projectName) => {
    setProjects([...projects, projectName]);
    setTasks({ ...tasks, [projectName]: [] });
  };

  const handleAddTask = (projectName, taskName) => {
    setTasks({
      ...tasks,
      [projectName]: [...(tasks[projectName] || []), taskName],
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
       const res = await newRequest.get("/users/allusers"); // Assume this exists
      // const res = await newRequest.get("/users"); // Assume this exists
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  // console.log(users);

  return (
    <>
      <AppNavbar
        showAddProjectModal={() => setShowProjectModal(true)}
        showAddTaskModal={() => setShowTaskModal(true)}
      />

      <div className="p-2 m-2" >
      <Button onClick={() => setOpenTaskModal(true)} className="btn btn-primary" >+ Add Task</Button>
      <AddTaskModal open={openTaskModal} setOpen={setOpenTaskModal} users={users}  />
      </div>
      <div className="p-2 m-2" >
      <Button onClick={() => setOnTaskModal(true)} className="btn btn-primary" >Add Task</Button>
      <AddNewTaskModal show={onTaskModal} onHide={() => setOnTaskModal(false)} allUsers={users} />
      </div>

      <div className="d-flex">
        <Sidebar
          // selectedProject={selectedProject}
          // setSelectedProject={setSelectedProject}
          // projects={projects}
          user={user}
        />
        <div className="flex-grow-1 p-3 main-content">
          <AllTasks
            selectedProject={selectedProject}
            tasks={tasks[selectedProject] || []}
            setTasks={(updatedTasks) =>
              setTasks({ ...tasks, [selectedProject]: updatedTasks })
            }
          />
        </div>
      </div>

      <AddProjectModal
        show={showProjectModal}
        handleClose={() => setShowProjectModal(false)}
        onAdd={handleAddProject}
      />

      <AddTaskModal
        show={showTaskModal}
        handleClose={() => setShowTaskModal(false)}
        users={users}                // ✅ pass down from state
        onAdd={handleAddTask}
        selectedProject={selectedProject}
      />
    </>
  );
};

export default TaskLayout;