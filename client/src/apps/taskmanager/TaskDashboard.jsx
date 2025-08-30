import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import AddTaskModal from "./AddTaskModal";


const TaskDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const fetchUsers = async () => {
    // const res = await newRequest.get("/users/user-list");
     const res = await newRequest.get("/users/allusers");
    // const res = await newRequest.get("/users");
    setUsers(res.data);
  };

  // console.log(users);

  const fetchTasks = async () => {
    const res = await newRequest.get("/tasks");
    // console.log("Tasks API Response:", res.data); // 👈 check this in dev tools
    // setTasks(res.data);
    setTasks(res.data.tasks);
  };


  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);

  // console.log(users);

  return (
    <>
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        + Add Task
      </button>

      <AddTaskModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        users={users}
        onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
      />

      <div>
        {Array.isArray(tasks) &&
        tasks.map((task) => (
            <div key={task._id}>{task.title}</div>
        ))}

      </div>
    </>
  );
};

export default TaskDashboard;
