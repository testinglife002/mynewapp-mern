import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button, Form, NavDropdown, InputGroup } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';


const Header = ({toggleSidebar,active,setActive,user}) => {

    const userId = user?._id;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // console.log(userId);
    // console.log(user);
    // console.log(user?.displayName);
    // console.log(role);

  return (
    <div>
    <Navbar bg="primary" variant="primary" expand="lg" fixed="top" style={{ zIndex: 1050, height: '55px' }}>
      <Container fluid>
        {/* Hamburger toggle always visible */}
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          className="me-2"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FaBars />
        </Button>

        <Navbar.Brand href="/" className="fw-bold">
          My App
        </Navbar.Brand>


        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Link</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Nav style={{width:'420px', marginLeft:'10px', }}>

              <InputGroup className="mt-1 mb-1">
                  
                  <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                  />
                  <Button variant="outline-light">Search</Button>
              </InputGroup>

          </Nav>
          
        </Navbar.Collapse>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
           {/*} <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#logout">Logout</Nav.Link> */}
          
            {
              userId ? (          
                <Nav>
                <Nav.Link style={{color:'white', textDecoration:'none',marginTop:'8px'}} >
                    {currentUser.username}
                </Nav.Link>
                <Nav.Link href="#" 
                     // onClick={handleLogout}
                     style={{color:'white', textDecoration:'none',marginTop:'8px'}}
                >
                    Logout
                </Nav.Link>
                </Nav>
              ) : ( 
                <Nav>
                <Nav.Link >
                    @ 
                </Nav.Link>
            
                    <Link 
                        style={{color:'white', textDecoration:'none',marginTop:'8px'}}
                        to="/sign-in"
                          >
                    Login
                    </Link>
                    &nbsp;&nbsp;
                    <Link 
                        style={{color:'white', textDecoration:'none',marginTop:'8px'}}
                        to="/sign-up"
                          >
                    Register
                    </Link>
                
                </Nav>
            
              ) 
            }

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </div>
  )
}

export default Header