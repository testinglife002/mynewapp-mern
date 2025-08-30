
// src/components/dashboard/DashboardNavbarUI.jsx
import React from 'react';
import { Navbar, Container, Button, Dropdown } from 'react-bootstrap';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import './DashboardNavbarUI.css';

const DashboardNavbarUI = ({ toggleSidebar }) => {
  return (
    <Navbar bg="dark" variant="dark" className="shadow-sm px-3">
      <Container fluid>
        <Button
          variant="outline-light"
          className="me-2 d-flex align-items-center"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </Button>

        <Navbar.Brand className="me-auto fw-semibold text-white">
          Admin Panel
        </Navbar.Brand>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="outline-light"
            className="d-flex align-items-center"
          >
            <FaUserCircle className="me-1" size={20} />
            <span className="d-none d-md-inline">Admin</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/dashboard/profile">Profile</Dropdown.Item>
            <Dropdown.Item href="/dashboard/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
};

export default DashboardNavbarUI;
