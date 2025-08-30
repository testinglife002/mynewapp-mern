// components/Sidebar.js
import React, { useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaInfoCircle, FaTachometerAlt, FaChevronDown,
  FaChevronRight, FaCog, FaBars
} from 'react-icons/fa';
import './DashboardSidebarUI.css';


 const DashboardSidebarUI = ({ isExpanded, setIsExpanded }) => {

  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    settings: false,
    categories: false,
    post: false,
    posts: false,
  });

  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className={`sidebar scroll p-2 ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
      style={{marginLeft:'0'}}
    >   
    {/*
      <div className="text-center mb-3">
        <button
          className="btn btn-sm btn-outline-light w-100 d-flex justify-content-center align-items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaBars className="me-2" />
          {isExpanded && 'Toggle Menu'}
        </button>
      </div>
    */}

      <Nav className="flex-column">

        <Link to="/dashboard" className={`nav-link text-white ${isActive('/dashboard') && 'bg-secondary'}`}>
          <FaInfoCircle className="me-2" /> {isExpanded && 'Dashboard'}
        </Link>

        <Link to="/dashboard/home" className={`nav-link text-white ${isActive('/dashboard/home') && 'bg-secondary'}`}>
          <FaHome className="me-2" /> {isExpanded && 'Home'}
        </Link>

        <Link to="/dashboard/about" className={`nav-link text-white ${isActive('/dashboard/about') && 'bg-secondary'}`}>
          <FaInfoCircle className="me-2" /> {isExpanded && 'About'}
        </Link>

        <Nav.Link  className="text-white d-flex justify-content-between align-items-center">
          <span>
            <Link to="/dashboard/demo" className={`nav-link text-white ${isActive('/dashboard/demo') && 'bg-secondary'}`}>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Demo'}
            </Link>
          </span>
        </Nav.Link>
        
        <Nav.Link onClick={() => toggleMenu('dashboard')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Dashboard'}
          </span>
          {isExpanded && (openMenus.dashboard ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.dashboard}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/main" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Main Panel'}
              </Link>
              <Link to="/dashboard/stats" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Stats Panel'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('categories')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Category'}
          </span>
          {isExpanded && (openMenus.categories ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.categories}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-category" className={`nav-link text-white ${isActive('/dashboard/all-category') && 'bg-secondary'}`}>
                {isExpanded && 'All Category'}
              </Link>
              <Link to="/dashboard/add-category" className={`nav-link text-white ${isActive('/dashboard/add-category') && 'bg-secondary'}`}>
                {isExpanded && 'Add Category'}
              </Link>
              <Link to="/dashboard/categories" className={`nav-link text-white ${isActive('/dashboard/categories') && 'bg-secondary'}`}>
                {isExpanded && 'All Categories List'}
              </Link>
              <Link to="/dashboard/category-manager" className={`nav-link text-white ${isActive('/dashboard/category-manager') && 'bg-secondary'}`}>
                {isExpanded && 'Category Manager'}
              </Link>
              <Link to="/dashboard/categories-alt" className={`nav-link text-white ${isActive('/dashboard/categories-alt') && 'bg-secondary'}`}>
                {isExpanded && 'All Category Alt'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('post')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Post'}
          </span>
          {isExpanded && (openMenus.post ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.post}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-posts-list" className={`nav-link text-white ${isActive('/dashboard/all-posts-list') && 'bg-secondary'}`}>
                {isExpanded && 'All Post List'}
              </Link>
              <Link to="/dashboard/all-posts-view" className={`nav-link text-white ${isActive('/dashboard/all-posts-view') && 'bg-secondary'}`}>
                {isExpanded && 'Add Post View'}
              </Link>
              <Link to="/dashboard/add-post" className={`nav-link text-white ${isActive('/dashboard/add-post') && 'bg-secondary'}`}>
                {isExpanded && 'Add Post'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('posts')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Post Manager'}
          </span>
          {isExpanded && (openMenus.posts ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.posts}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-post" className={`nav-link text-white ${isActive('/dashboard/all-post') && 'bg-secondary'}`}>
                {isExpanded && 'All Post'}
              </Link>
              <Link to="/dashboard/posts" className={`nav-link text-white ${isActive('/dashboard/posts') && 'bg-secondary'}`}>
                {isExpanded && 'Posts'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link onClick={() => toggleMenu('settings')} className="text-white d-flex justify-content-between align-items-center">
          <span>
            <FaCog className="me-2" /> {isExpanded && 'Settings'}
          </span>
          {isExpanded && (openMenus.settings ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.settings}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/profile" className={`nav-link text-white ${isActive('/dashboard/profile') && 'bg-secondary'}`}>
                {isExpanded && 'Profile'}
              </Link>
              <Link to="/dashboard/security" className={`nav-link text-white ${isActive('/dashboard/security') && 'bg-secondary'}`}>
                {isExpanded && 'Security'}
              </Link>
            </Nav>
          </div>
        </Collapse>
      </Nav>
    </div>
  );
};

export default DashboardSidebarUI;
