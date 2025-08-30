// Sidebar.jsx// Sidebar.jsx
import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
// import { setOpenSidebar } from '../redux/slices/authSlice';
import clsx from 'clsx';

import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from 'react-icons/md';
import { FaTasks, FaTrashAlt, FaUsers } from 'react-icons/fa';

const linkData = [
  { label: 'Dashboard', link: 'dashboard', icon: <MdDashboard /> },
  { label: 'Tasks', link: 'tasks', icon: <FaTasks /> },
  { label: 'Completed', link: 'completed/completed', icon: <MdTaskAlt /> },
  { label: 'In Progress', link: 'in-progress/in progress', icon: <MdOutlinePendingActions /> },
  { label: 'To Do', link: 'todo/todo', icon: <MdOutlinePendingActions /> },
  { label: 'Team', link: 'team', icon: <FaUsers /> },
  { label: 'Trash', link: 'trashed', icon: <FaTrashAlt /> },
];

const Sidebar = ({user}) => {
  // const { user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split('/')[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

 /* const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  }; */

  return (
    <div className="d-flex flex-column h-100 p-3">
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-primary p-2 rounded-circle">
          <MdOutlineAddTask className="text-white fs-4" />
        </div>
        <h4 className="fw-bold m-0">TaskMe</h4>
      </div>

      <ListGroup variant="flush" className="flex-grow-1 mb-4">
        {sidebarLinks.map((item) => (
          <Link
            key={item.label}
            to={`/${item.link}`}
            // onClick={closeSidebar}
            className={clsx(
              'list-group-item list-group-item-action d-flex align-items-center gap-2 rounded',
              path === item.link.split('/')[0]
                ? 'bg-primary text-white'
                : 'text-dark hover-bg-light'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </ListGroup>

      <button className="btn btn-light d-flex align-items-center gap-2 text-start w-100">
        <MdSettings />
        <span>Settings</span>
      </button>
    </div>
  );
};

export default Sidebar;
