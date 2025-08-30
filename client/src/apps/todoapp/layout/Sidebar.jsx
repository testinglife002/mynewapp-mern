import React from 'react';
import { Nav } from 'react-bootstrap';
import { FaTasks, FaProjectDiagram, FaStickyNote, FaUserCircle } from 'react-icons/fa';

const Sidebar = () => (
  <div className="sidebar d-flex flex-column p-3">
    <h4 className="text-white mb-4">🧠 TaskBoard</h4>
    <Nav className="flex-column gap-2">
      <Nav.Link href="#" className="text-white"><FaTasks /> Tasks</Nav.Link>
      <Nav.Link href="#" className="text-white"><FaProjectDiagram /> Projects</Nav.Link>
      <Nav.Link href="#" className="text-white"><FaStickyNote /> Notes</Nav.Link>
      <Nav.Link href="#" className="text-white"><FaUserCircle /> Profile</Nav.Link>
    </Nav>
  </div>
);

export default Sidebar;
