import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardNavbar.module.css';


const DashboardNavbar = () => {
  return (
    <div>
        
        
        <div  >

    <nav
      className={`navbar navbar-expand-lg bg-dark fixed-top border-bottom border-body ${styles.navbar}`}
      data-bs-theme="dark"
    >
    
    <div className="container-fluid">
        <a className="navbar-brand" href="#">Navbar scroll</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/" className={`navbar-brand ${styles.brand}`}>
          Dashboard
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarDashboardContent"
          aria-controls="navbarDashboardContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarDashboardContent">
          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="#">Profile</Link></li>
                <li><Link className="dropdown-item" to="#">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="#">Logout</Link></li>
              </ul>
            </li>

            <li className="nav-item ms-3">
              <img
                src="https://via.placeholder.com/36"
                alt="User"
                className={styles.profileImage}
              />
            </li>
          </ul>
        </div>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{bsScrollHeight: '100px'}} >
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Link</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Link
                    </a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                
          </ul>
          <form className="d-flex" role="search">
            <input className="form-control " type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          <ul className="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll " style={{bsScrollHeight: '100px'}} >
                
                <li className="nav-item dropdown  ">

                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        
                        <button type="button" className="btn btn-sm btn-outline-secondary">
                        <small>
                            Notification
                            &nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                            </svg>
                            <span className="visually-hidden">Button</span>
                        </small>
                        </button>
                                               
                    </a>
                    
                    <ul className="dropdown-menu">

                   
                            <li 
                                style={
                                        //n.status === 'seen' ? '' : 
                                        {fontWeight:"bold",backgroundColor:"#232f34"} 
                                     }  
                                  >
                                <a className="dropdown-item" href="#">
                                <Link to="" 
                                    
                                     >
                                    notification subject
                                </Link>
                                </a>
                            </li>
                    
                        
                        
                            <li><a className="dropdown-item" href="#">No notifications</a></li>
                        
                    

                    </ul>
                </li>
                <li className="nav-item dropdown  ">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        
                        <button type="button" className="btn btn-sm btn-outline-primary">
                        <small>
                            Message
                            &nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-down" viewBox="0 0 16 16">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708z"/>
                            </svg>
                            <span className="visually-hidden">Button</span>
                        </small>
                        </button>

                    </a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </li>
                <li className="nav-item dropdown ">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        
                        <button type="button" className="btn btn-sm btn-outline-light">
                        <small>
                            userInfo name
                            &nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-down" viewBox="0 0 16 16">
                            <path d="M12.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m.354 5.854 1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V10.5a.5.5 0 0 0-1 0v2.793l-.646-.647a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                            <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                            </svg>
                            <span className="visually-hidden">Button</span>
                        </small>
                        </button>

                        
                    </a>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">userInfo name</a></li>
                        <li><a className="dropdown-item" href="#">userInfo email</a></li>
                        
                        <li>
                            <a className="dropdown-item" href="#">
                            moment userInfo createdAt format 'll'
                            </a>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li   >
                            <a className="dropdown-item" href="#">
                                Logout
                            </a>
                        </li>
                    </ul>
                    
                </li>
                
                
          </ul>
                &nbsp;
                <img
                    src=""
                    alt="user" width={40}
                    className="img-thumbnail rounded-circle"  
                />

        </div>
    </div>
    
    </nav>

    </div>
        
    </div>
  )
}

export default DashboardNavbar