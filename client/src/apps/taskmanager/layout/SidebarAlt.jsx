// Sidebar.jsx
import React from "react";
import { Nav } from 'react-bootstrap';
import { MdSettings, MdOutlineAddTask } from 'react-icons/md';
import { useLocation, Link } from 'react-router-dom';
import { ListGroup } from "react-bootstrap";

const SidebarAlt = ( { selectedProject, setSelectedProject, projects, user } ) => {

  const location = useLocation();
  const path = location.pathname.split('/')[1];

  console.log(projects);

  const links = [
    { label: 'Dashboard', path: 'dashboard', icon: <MdSettings /> },
    // ...other links
  ];
  // mconst user = null;
  const filteredLinks = user?.isAdmin ? links : links.slice(0, 5);
  return (
  <div className="p-4 ">
      <h3 className="d-flex align-items-center mb-4">
        <MdOutlineAddTask size={28} className="me-2 text-primary" />
        <span>TaskMe</span>
      </h3>
  
        {
            <div className=" p-3 border-end bg-light">
            <h5 className="mb-3">Projects</h5>
            <ListGroup>
            {projects.map((project) => (
                <ListGroup.Item
                key={project._id}
                // key={i}
                action
                active={selectedProject === project.name}
                onClick={() => setSelectedProject(project.name)}
                >
                {project?.name}
                </ListGroup.Item>
            ))}
            </ListGroup>
            </div>
        }

    <Nav className="flex-column">
    {filteredLinks.map(({ label, path: linkPath, icon }) => (
        <Nav.Link
        as={Link}
        to={`/${linkPath}`}
        key={label}
        active={path === linkPath}
        className="d-flex align-items-center gap-2"
        onClick={() => dispatch(setOpenSidebar(false))}
        >
        {icon}
        {label}
        </Nav.Link>
    ))}
    </Nav>

  </div>
    )
};


export default SidebarAlt;


/*
import { Nav } from 'react-bootstrap';
import { MdSettings, MdOutlineAddTask } from 'react-icons/md';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setOpenSidebar } from '../redux/slices/authSlice';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split('/')[1];

  const links = [
    { label: 'Dashboard', path: 'dashboard', icon: <MdSettings /> },
    // ...other links
  ];

  const filteredLinks = user?.isAdmin ? links : links.slice(0, 5);

  return (
    <div className="p-4">
      <h3 className="d-flex align-items-center mb-4">
        <MdOutlineAddTask size={28} className="me-2 text-primary" />
        <span>TaskMe</span>
      </h3>
      <Nav className="flex-column">
        {filteredLinks.map(({ label, path: linkPath, icon }) => (
          <Nav.Link
            as={Link}
            to={`/${linkPath}`}
            key={label}
            active={path === linkPath}
            className="d-flex align-items-center gap-2"
            onClick={() => dispatch(setOpenSidebar(false))}
          >
            {icon}
            {label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;

*/

