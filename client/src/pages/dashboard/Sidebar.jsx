import React, { useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaInfoCircle, FaTachometerAlt, FaChevronDown,
  FaChevronRight, FaCog, FaList, FaFolder, FaLayerGroup,
  FaArchive
} from 'react-icons/fa';
 import { MdAppRegistration, MdApps  } from "react-icons/md"; 
 import { FcAndroidOs } from "react-icons/fc";
import { AiFillDashboard, AiOutlinePlus } from 'react-icons/ai';
import { ImProfile } from 'react-icons/im';
import { BiNews } from 'react-icons/bi';
import { FiUsers } from 'react-icons/fi';
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import './Sidebar.css';


const Sidebar = ({ isExpanded, setIsExpanded }) => {

    const [openMenus, setOpenMenus] = useState({
        dashboard: false,
        segments: false,
        options: false,
        categoryTypes:false,
        categories:false,
        notes: false,
        settings: false,
        apps: false,
        managers: false,
        post: false,
        posts: false,
    });

    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const toggleMenu = (key) => setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
    <div
      className={` sidebar p-2  ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
      style={{marginLeft:'0', marginTop: '55px', minHeight:'100%'}}
    >
      <div className="text-center mb-3">
        <button className="btn btn-sm btn-outline-light" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '☰' : '→'}
        </button>
        
        <span>
          <br/>
            <AiFillDashboard /><MdAppRegistration/><MdApps/>
            <FcAndroidOs/><AiOutlinePlus/><ImProfile/>
            <BiNews/><FiUsers/><MdOutlineSubdirectoryArrowRight/>
            <FaList/><FaFolder/><FaLayerGroup/><br/>
            <FaHome/><FaInfoCircle/><FaTachometerAlt/>
            <FaChevronDown/><FaChevronRight/><FaArchive/><br/>
        </span>
      </div>

      <div className='scrollbar' style={{height: '200%'}} >
      <Nav className="flex-column">

        <Link to="/" className={`nav-link text-white ${isActive('/') && 'bg-secondary'}`}>
          <FaHome className="me-2" /> {isExpanded && 'Home'}
        </Link>

        <Link to="/about-us" className={`nav-link text-white ${isActive('/about') && 'bg-secondary'}`}>
          <FaInfoCircle className="me-2" /> {isExpanded && 'About'}
        </Link>

        <Link to="/dashboard/post-creator" className={`nav-link text-white ${isActive('/dashboard/post-creator') && 'bg-secondary'}`}>
          <FaFolder className="me-2" /> {isExpanded && 'Ai Post Creator'}
        </Link>
        <Link to="/dashboard/ai-posts" className={`nav-link text-white ${isActive('/dashboard/ai-posts') && 'bg-secondary'}`}>
          <FaFolder className="me-2" /> {isExpanded && 'All Ai Posts'}
        </Link>
        {<Link to="/dashboard/banner-editor" className={`nav-link text-white ${isActive('/dashboard/banner-editor') && 'bg-secondary'}`}>
          <FaArchive className="me-2" /> {isExpanded && 'Banner Editor'}
        </Link>}
        

        <Nav.Link
          onClick={() => toggleMenu('dashboard')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Dashboard'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.dashboard ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.dashboard}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/main" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Main Panel'}
              </Link>
              <Link to="/dashboard/stats" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Statistics'}
              </Link>
            </Nav>

            <div>
            <li className="dropdown">
                <a href="#" className="nav-link dropdown-toggle  text-truncate" id="dropdown" 
                      data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fs-5 bi-bootstrap"></i>
                    <span className="ms-1 d-none d-sm-inline">Bootstrap</span>
                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdown">
                    <li><a className="dropdown-item" href="#">New project...</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li>
                        <hr classB
                        ="dropdown-divider"/>
                    </li>
                    <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </li>
          </div>

          </div>

          
        </Collapse>

        

        <Nav.Link
          onClick={() => toggleMenu('segments')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Segment'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.segments ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.segments}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-segment" className={`nav-link text-white ${isActive('/dashboard/all-segment') && 'bg-secondary'}`}>
                {isExpanded && 'All Segment'}
              </Link>
              <Link to="/dashboard/add-segment" className={`nav-link text-white ${isActive('/dashboard/add-segment') && 'bg-secondary'}`}>
                {isExpanded && 'Add Segment'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link
          onClick={() => toggleMenu('categoryTypes')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Category Types'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.categoryTypes ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.categoryTypes}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-category-type" className={`nav-link text-white ${isActive('/dashboard/all-category-type') && 'bg-secondary'}`}>
                {isExpanded && 'All Category Types'}
              </Link>
              <Link to="/dashboard/add-category-type" className={`nav-link text-white ${isActive('/dashboard/add-category-type') && 'bg-secondary'}`}>
                {isExpanded && 'Add Category Types'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link
          onClick={() => toggleMenu('options')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Options'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.options ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.options}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/all-option" className={`nav-link text-white ${isActive('/dashboard/all-option') && 'bg-secondary'}`}>
                {isExpanded && 'All Options'}
              </Link>
              <Link to="/dashboard/add-option" className={`nav-link text-white ${isActive('/dashboard/add-option') && 'bg-secondary'}`}>
                {isExpanded && 'Add Options'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link
          onClick={() => toggleMenu('notes')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaTachometerAlt className="me-2" /> {isExpanded && 'Notes'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.notes ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.notes}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/note" className={`nav-link text-white ${isActive('/dashboard/note') && 'bg-secondary'}`}>
                {isExpanded && 'Note'}
              </Link>
              <Link to="/dashboard/notes" className={`nav-link text-white ${isActive('/dashboard/notes') && 'bg-secondary'}`}>
                {isExpanded && 'All note'}
              </Link>
              <Link to="/dashboard/add-note" className={`nav-link text-white ${isActive('/dashboard/add-note') && 'bg-secondary'}`}>
                {isExpanded && 'Add note'}
              </Link>
            </Nav>
          </div>
        </Collapse>

        <Nav.Link
          onClick={() => toggleMenu('managers')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaInfoCircle className="me-2" /> {isExpanded && 'Managers'}
          </span>
          &nbsp;
          {isExpanded && (openMenus.managers ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.managers}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/category-manager" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Category '}
              </Link>
              <Link to="/dashboard/category-manager-alt" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Category Alt'}
              </Link>
              <Link to="/dashboard/category-manager-ui" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Category UI'}
              </Link>
              <Link to="/dashboard/single-category-manager" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Single Category '}
              </Link>
              <Link to="/dashboard/single-subcategory-manager" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Single Subcategory '}
              </Link>
              <Link to="/dashboard/item-manager" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'Item '}
              </Link>
              <Link to="/dashboard/post-manager" className={`nav-link text-white ${isActive('/dashboard/main') && 'bg-secondary'}`}>
                {isExpanded && 'Post '}
              </Link>
              <Link to="/dashboard/story-manager" className={`nav-link text-white ${isActive('/dashboard/story-manager') && 'bg-secondary'}`}>
                {isExpanded && 'Story '}
              </Link>
              <Link to="/dashboard/taskmanager" className={`nav-link text-white ${isActive('/dashboard/taskmanager') && 'bg-secondary'}`}>
                {isExpanded && 'Task App'}
              </Link>
              <Link to="" className={`nav-link text-white ${isActive('/dashboard/stats') && 'bg-secondary'}`}>
                {isExpanded && 'None'}
              </Link>
            </Nav>
          </div>
        </Collapse>


        <Nav.Link
          onClick={() => toggleMenu('apps')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <MdApps className="me-2" />  {isExpanded && 'Apps'}           
          </span>
          {isExpanded && (openMenus.apps ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.apps}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/noteapp" className={`nav-link text-white ${isActive('/dashboard/noteapp') && 'bg-secondary'}`}>
                {isExpanded && 'Notes'}
              </Link>
            </Nav>
            <Nav className="flex-column ms-3">
              <Link to="/dashboard/taskmanagerapp" className={`nav-link text-white ${isActive('/dashboard/taskmanagerapp') && 'bg-secondary'}`}>
                {isExpanded && 'Task Manager'}
              </Link>
              <Link to="/dashboard/todolistapp" className={`nav-link text-white ${isActive('/dashboard/todolistapp') && 'bg-secondary'}`}>
                {isExpanded && 'To Do List'}
              </Link>
              <Link to="/dashboard/todoslistapp" className={`nav-link text-white ${isActive('/dashboard/todoslistapp') && 'bg-secondary'}`}>
                {isExpanded && 'To Do S List'}
              </Link>
              <Link to="/dashboard" className={`nav-link text-white ${isActive('/dashboard') && 'bg-secondary'}`}>
                {isExpanded && 'Trello Clone'}
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

        <Nav.Link
          onClick={() => toggleMenu('settings')}
          className="text-white d-flex justify-content-between align-items-center"
        >
          <span>
            <FaCog className="me-2" /> {isExpanded && 'Settings'}
          </span>
          {isExpanded && (openMenus.settings ? <FaChevronDown /> : <FaChevronRight />)}
        </Nav.Link>
        <Collapse in={openMenus.settings}>
          <div>
            <Nav className="flex-column ms-3">
              <Link to="/settings/profile" className={`nav-link text-white ${isActive('/settings/profile') && 'bg-secondary'}`}>
                {isExpanded && 'Profile'}
              </Link>
              <Link to="/settings/security" className={`nav-link text-white ${isActive('/settings/security') && 'bg-secondary'}`}>
                {isExpanded && 'Security'}
              </Link>
            </Nav>
          </div>
        </Collapse>
      </Nav>
      </div>
      
    </div>
    </div>
  )
}

export default Sidebar