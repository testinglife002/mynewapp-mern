// src/pages/dashboard/DashboardPage.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Helmet from 'react-helmet';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar';
import SideMenu from '../../components/dashboard/SideMenu';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardNavbarUI from '../../components/dashboard/DashboardNavbarUI';
import DashboardSidebarUI from '../../components/dashboard/DashboardSidebarUI';

const Dashboard = () => {
  const [inactive, setInactive] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      {/*<DashboardNavbar />*/}
      {<DashboardNavbarUI toggleSidebar={() => setSidebarExpanded(prev => !prev)} />}

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-lg-2">
            {/*<SideMenu onCollapse={(inactive) => setInactive(inactive)} />
            <DashboardSidebar onCollapse={(inactive) => setInactive(inactive)} /> 
            */}    
            
            {<DashboardSidebarUI
                // isExpanded={isSidebarExpanded}
                // setIsExpanded={setIsSidebarExpanded}
                isExpanded={sidebarExpanded} setIsExpanded={setSidebarExpanded}
            />}
                
          </div>

          <div className="col-md-9 col-lg-10" style={{ marginTop: "40px" }}>
            <Outlet /> {/* Renders the nested route component here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
