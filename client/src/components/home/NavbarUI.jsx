import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import Header from './Header';

const NavbarUI = () => {



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
    <div  >
        {/*<Header />*/}
        {/* Navbar */}
        <div className="" // style={{marginTop:'5px'}} 
        >
        <nav className="navbar navbar-expand-lg navbar-dark  bg-body-tertiary " 
            data-bs-theme="dark" >
            <div className="container-fluid">
                <div className="navbar-brand" href="#">
                    <span className="badge bg-light text-dark fs-4" >
                    <Link to="/" className="nav-link" >
                        MyWebApp
                    </Link>
                    </span>
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" 
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <div    
                            >
                                <Link to="/" className="nav-link" >
                                    Home
                                </Link>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <button type="button" className="btn btn-sm btn-outline-danger">
                                <small>
                                    MyApps &nbsp;
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-grid-3x3-gap-fill"
                                    viewBox="0 0 16 16"
                                    >
                                    <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1z"/>
                                    </svg>
                                </small>
                                </button>
                            </a>
                            <ul className="dropdown-menu">
                                <div className="dropdown-item">
                                    <Link to="/todoslayout" className="nav-link">
                                        ToDo List
                                    </Link>
                                </div>
                                <div className="dropdown-item">
                                    <Link to="/all-todos" className="nav-link">
                                        ToDos
                                    </Link>
                                </div>
                                <div className="dropdown-item">
                                    <Link to="/alltodos" className="nav-link">
                                        ToDos List
                                    </Link>
                                </div>
                                <li>
                                <div className="dropdown-item">
                                    <Link to="/task-manager" className="nav-link">Task Manager</Link>
                                </div>
                                <div className="dropdown-item">
                                    <Link to="/tasks" className="nav-link">Tasks</Link>
                                </div>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <div className="dropdown-item">
                                    <Link to="/trello-board" className="nav-link">
                                        Trello
                                    </Link>
                                </div>
                            </ul>
                        </li>

                        {/* 🔹 Dropdown 2: MyNotes */}
                        <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <button type="button" className="btn btn-sm btn-outline-success">
                            <small>
                                MyNotes &nbsp;
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-journal-text"
                                viewBox="0 0 16 16"
                                >
                                <path d="M5 7h6v1H5V7zM5 9h6v1H5V9z"/>
                                <path d="M3 0h10a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-1 0V2a1 1 0 0 0-1-1H3v15.5a.5.5 0 0 1-1 0V1a1 1 0 0 1 1-1z"/>
                                </svg>
                            </small>
                            </button>
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <Link className="dropdown-item" to="/notes">
                                    Notes App
                                </Link>
                            </li>
                            <li><a className="dropdown-item" href="#">Rich Text Editor</a></li>
                            <li>
                                <Link className="dropdown-item" to="/posts">
                                    Posts App
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/add-post">
                                    Add Post
                                </Link>
                            </li>
                        </ul>
                        </li>

                        {/* 🔹 Dropdown 3: MyDesigns */}
                        <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <button type="button" className="btn btn-sm btn-outline-primary">
                            <small>
                                MyDesigns &nbsp;
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-palette"
                                viewBox="0 0 16 16"
                                >
                                <path d="M8 0C3.58 0 0 3.25 0 7.5c0 2.64 1.52 4.64 3.75 5.67-.18.59-.39 1.58.02 2.59.57 1.39 1.8 2.09 3.23 2.09 1.52 0 2.48-.8 2.9-1.44.62-.97.86-2.2.86-3.41C10.76 11.09 12 9.9 12 8c0-2.77-2.24-5-5-5-.88 0-1.69.23-2.38.63C5.44 2.45 6.64 1 8 1c2.76 0 5 2.24 5 5 0 1.74-1.04 3.28-2.5 4.04V12c0 1.1-.9 2-2 2s-2-.9-2-2h-.5a.5.5 0 0 1 0-1H8c0 1.1-.9 2-2 2S4 12.1 4 11V9.5c0-.28-.22-.5-.5-.5h-2A1.5 1.5 0 0 1 0 7.5C0 3.25 3.58 0 8 0z"/>
                                </svg>
                            </small>
                            </button>
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/designs">Design Studio</Link></li>
                            <li><a className="dropdown-item" href="#">Canva Clone</a></li>
                            <li><a className="dropdown-item" href="#">Image Editor</a></li>
                        </ul>
                        </li>


                        <li className="nav-item">
                            <div 
                            >
                                <Link to="/" className="nav-link" >
                                    About Us
                                </Link>                             
                            </div>
                        </li>

                        {/* 
                        <li className="nav-item">
                            <div  
                            >
                                <Link to="/" className="nav-link" >
                                        Privacy Policy
                                </Link>   
                            </div>
                        </li>
                        */}
                        

                        <li className="nav-item">
                            <div  
                            >
                                <Link to="/" className="nav-link" >
                                    Contact Us
                                </Link>                             
                            </div>
                        </li>

                        {/* 
                        <li className="nav-item">
                            <div className="nav-link" 
                            
                            >
                                <Link to="/" >
                                    NavItem 01
                                </Link>
                            </div>
                        </li>
                        <li className="nav-item " >
                            <div className="nav-link" 
                            
                            >
                                <Link to="/" >
                                    NavItem 02
                                </Link>
                            </div>
                        </li>
                        */}
                        


                    </ul>
                    <form className="d-flex" role="search" style={{width: '320px', marginLeft:'10px'}} >
                        <input className="form-control me-2" type="search" placeholder="Search" 
                            aria-label="Search"  />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    
                   {/* <div className='pull-right'  style={{marginLeft:'-50px'}} 
                    >
                    {
                        currentUser ? (
                            <ul className="nav" >

                                <li className="nav-item" ><a className="nav-link" href="#">{currentUser.username}</a></li>
                                
                                <li className="nav-item" ><hr className="dropdown-divider" /></li>
                                <li className="nav-item" 
                                   //</ul> onClick={logout} 
                                   >
                                    <Link className="nav-link" href="#" to="/logout" >
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="nav" >
                            <li className="nav-item">
                                <a className="nav-link" href="#">@</a>
                            </li>
                            <li className="nav-item">
                                <div 
                                >
                                    <Link to="/login" className="nav-link link-body-emphasis px-2 btn btn-sm 
                                    btn-outline-secondary" >
                                        Login
                                    </Link>                             
                                </div>
                            </li>
                            <li className="nav-item">
                                <div 
                                >
                                    <Link to="/register" className="nav-link link-body-emphasis px-2 btn btn-sm 
                                    btn-outline-secondary" >
                                        Register
                                    </Link>                             
                                </div>
                            </li>
                            
                            </ul>
                        )
                    }        
                    </div> */}

                    <div className="pull-right" style={{ marginLeft: "-5px" }}>
                    {currentUser ? (
                        <ul className="nav">
                        <li className="nav-item dropdown">
                            <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            >
                            <button type="button" className="btn btn-sm btn-outline-primary">
                                <small>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-person-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path
                                    fillRule="evenodd"
                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 
                                        11.37C3.242 11.226 4.805 10 8 10s4.757 
                                        1.225 5.468 2.37A7 7 0 0 0 8 1"
                                    />
                                </svg>
                                &nbsp; {currentUser.username}
                                </small>
                            </button>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link to="/profile" className="dropdown-item">
                                Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/user" className="dropdown-item">
                                My Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/user-alt" className="dropdown-item">
                                Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className="dropdown-item">
                                Settings
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link to="/logout" className="dropdown-item">
                                Logout
                                </Link>
                            </li>
                            </ul>
                        </li>
                        </ul>
                    ) : (
                        <ul className="nav">
                        <li className="nav-item dropdown">
                            <a
                            className="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            >
                            <button type="button" className="btn btn-sm btn-outline-secondary">
                                <small>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-person"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    <path
                                    fillRule="evenodd"
                                    d="M14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0"
                                    />
                                </svg>
                                &nbsp; Guest
                                </small>
                            </button>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link to="/login" className="dropdown-item">
                                Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="dropdown-item">
                                Register
                                </Link>
                            </li>
                            </ul>
                        </li>
                        </ul>
                    )}
                    </div>


                    
                </div>
            </div>
        </nav>
        </div>
    </div>
  )
}

export default NavbarUI