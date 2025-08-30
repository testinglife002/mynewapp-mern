// Tasks.jsx
import React, { useState, useRef, useEffect } from "react";
import { Card } from "react-bootstrap";
import AddNewTaskModal from "./AddNewTaskModal";
import newRequest from "../../utils/newRequest";

const AllTasks = ({ selectedProject, tasks, setTasks }) => {

  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await newRequest.get("/users/allusers"); // Assume this exists
      setUsers(res.data.users);
    };
    fetchUsers();
  }, []);


  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const copyTasks = [...tasks];
    const dragItemContent = copyTasks[dragItem.current];
    copyTasks.splice(dragItem.current, 1);
    copyTasks.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(copyTasks);
  };

  return (
    <div>
      <h4>{selectedProject ? `Tasks for ${selectedProject}` : "Select a project"}</h4>
      {tasks.map((task, index) => (
        <Card
          key={index}
          className="mb-2"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDrop}
        >
          <Card.Body>{task}</Card.Body>
        </Card>
      ))}

      <div>
        <h2>Task Manager</h2>
        <button onClick={() => setShow(true)}>+ Add Task</button>
        <AddNewTaskModal show={show} onHide={() => setShow(false)} allUsers={users} />
      </div>
    </div>
  );
};

export default AllTasks;
