import React, { useState } from "react";
// import "./navbar.css";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";

import {
  FaHiking,
  FaVideo,
  FaStar,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  // Fake login status (replace with auth context or real user data)
  // const isLoggedIn = true;
  const username = "Trekker";

  const handleNavClick = () => setExpanded(false); // collapse after click

  // const currentUser = null

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = async () => {
      try {
          await newRequest.post("/auth/logout");
          localStorage.setItem("currentUser", null);
          navigate("/");
      } catch (err) {
          console.log(err);
      }
  };

  return (
    <div className="main_banner sticky-top">
      <BSNavbar
        expand="lg"
        variant="dark"
        bg="dark"
        className="p-3 nav-js"
        expanded={expanded}
      >
        <Container>
          <BSNavbar.Brand as={NavLink} to="/" onClick={handleNavClick}>
            TREK
          </BSNavbar.Brand>
          <BSNavbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={NavLink}
                to="/"
                onClick={handleNavClick}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/me"
                onClick={handleNavClick}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                About
              </Nav.Link>

              <NavDropdown title="Explore" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/treks" onClick={handleNavClick}>
                  <FaHiking className="me-2" />
                  Treks
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/videos" onClick={handleNavClick}>
                  <FaVideo className="me-2" />
                  Videos
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/reviews" onClick={handleNavClick}>
                  <FaStar className="me-2" />
                  Reviews
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/contact" onClick={handleNavClick}>
                  <FaEnvelope className="me-2" />
                  Contact Us
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link as={NavLink} to="/gallery" onClick={handleNavClick}>
                Gallery
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blog" onClick={handleNavClick}>
                Blog
              </Nav.Link>
            </Nav>

             {/* RIGHT SIDE: Login / Register */}
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">
                <FaSignInAlt className="me-2" />
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <FaUserPlus className="me-2" />
                Register
              </Nav.Link>
            </Nav>

            {/* RIGHT SIDE: Auth Links or Profile */}
            <Nav className="ms-auto">
              {!currentUser ? (
                <>
                  <Nav.Link as={NavLink} to="/login" onClick={handleNavClick}>
                    <FaSignInAlt className="me-2" />
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register" onClick={handleNavClick}>
                    <FaUserPlus className="me-2" />
                    Register
                  </Nav.Link>
                </>
              ) : (
                <NavDropdown
                  title={
                    <>
                      <FaUserCircle className="me-2" />
                      <span>{currentUser?.username}</span>
                    </>
                  }
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={NavLink} to="/profile" onClick={handleNavClick}>
                    <FaUserCog className="me-2" />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/logout" onClick={handleNavClick}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>

            
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </div>
  );
}

export default Navbar;
