import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

const NavbarTop = () => (
  <Navbar className="topbar px-3">
    <Container fluid>
      <Navbar.Brand className="text-light">Welcome Back 👋</Navbar.Brand>
      <Button variant="outline-light" size="sm">Logout</Button>
    </Container>
  </Navbar>
);

export default NavbarTop;
