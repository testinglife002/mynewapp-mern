import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { FaUser, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import newRequest from "../../utils/newRequest";


const NavbarAlt = () => {
  const [active, setActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

   const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser"));
   });
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
       setCurrentUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <BSNavbar
      expand="lg"
      bg={active || location.pathname !== "/" ? "dark" : "transparent"}
      variant="dark"
      // className={`py-3 shadow-sm sticky-top ${active ? "bg-dark" : ""}`}
      className="py-2 shadow-sm sticky-top bg-dark"
    >
      <Container className="bg-dark" >
        <BSNavbar.Brand as={Link} to="/">
          Lyiverr
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/link">Link</Nav.Link>
            <Nav.Link as={Link} to="/another-link">Another Link</Nav.Link>
            <Nav.Link disabled>Disabled</Nav.Link>

            {currentUser?.isSeller && (
              <>
                <Nav.Link as={Link} to="/myGigs">My Gigs</Nav.Link>
                <Nav.Link as={Link} to="/add">Add New Gig</Nav.Link>
              </>
            )}
          </Nav>

          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>

          <Nav className="ms-auto">
            {currentUser ? (
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center">
                    <img
                      src={currentUser.img || "/img/noavatar.jpg"}
                      alt="avatar"
                      width="30"
                      height="30"
                      className="rounded-circle me-2"
                    />
                    {currentUser.username}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                {!currentUser?.isSeller && (
                  <NavDropdown.Item>Become a Seller</NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} to="/orders">Orders</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/messages">Messages</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-1" />
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <FaUserPlus className="me-1" />
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default NavbarAlt;
