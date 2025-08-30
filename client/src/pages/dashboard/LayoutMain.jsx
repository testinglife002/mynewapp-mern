import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header';
import Sidebar from './Sidebar';


const LayoutMain =  ({ active, setActive, user  })  => {

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const sidebarWidth = isSidebarExpanded ? 200 : 60;

    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => !prev);
    };

  return (
    <div>
        
        {/*  
        <HomeNavbar />
        */}
        { 
          <Header 
            toggleSidebar={toggleSidebar} 
            setActive={setActive}
            active={active}
            user={user} 
          /> 
        }
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

        <div
          style={{
            marginLeft: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
            transition: 'margin-left 0.3s ease, width 0.3s ease',
            padding: '1rem',
          }}
        >
          <div style={{margin:'5% 0% 25% 7.5%', width:'85%'}} >
            <Outlet />
          </div>
        </div>
        
        {/*<DashboardNavbarUI toggleSidebar={toggleSidebar} />*/}

    </div>
  )
}

export default LayoutMain