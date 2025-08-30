// MainLayout.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

import AppNavbar from './AppNavbar';
import AddProjectModal from '../AddProjectModal';
import AddTaskModal from '../AddTaskModal';
import SidebarAlt from './SidebarAlt';
import newRequest from '../../../utils/newRequest';

const MainLayout = ({user}) => {

  // const [projects, setProjects] = useState(["Project Alpha", "Project Beta"]);
  // const [tasks, setTasks] = useState({
  //  "Project Alpha": ["Task 1", "Task 2"],
  //  "Project Beta": ["Task 3"],
  // });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [openTaskModal, setOpenTaskModal] = useState(false);

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
    const fetchMyProjects = async () => {
      try {
        const res = await newRequest.get("/projects/my-projects"); // uses the new route
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch my projects", err);
      }
    };

    fetchMyProjects();
}, []);


  console.log(projects);



  return (
    <main className="bg-light" style={{ minHeight: '100vh' }}>
      <Container fluid className="p-0">
        
        <AppNavbar 
          showAddProjectModal={() => setShowProjectModal(true)}
          showAddTaskModal={() => setShowTaskModal(true)} 
        />

        <Row className="g-0">
          <Col md={2} className="d-none d-md-block bg-white border-end vh-100 sticky-top">
            {/*<Sidebar user={user} />*/}
            {<SidebarAlt
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              projects={projects}
              user={user}
            />}
          </Col>

          <MobileSidebar />

          <Col className="vh-100 overflow-auto">
            
            <div className="p-3 px-md-4">
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>

      <AddProjectModal
        show={showProjectModal}
        handleClose={() => setShowProjectModal(false)}
        onAdd={handleAddProject}
      />

      <AddTaskModal
        show={showTaskModal}
        handleClose={() => setShowTaskModal(false)}
        onAdd={handleAddTask}
        selectedProject={selectedProject}
      />

    </main>
  );
};

export default MainLayout;
