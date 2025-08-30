import React, { useState } from 'react'
import CustomAppBar from '../components/customapp/CustomAppBar'
import CustomSidebar from '../components/customapp/CustomSidebar'

const SuperAppLayout = () => {

  const [mode, setMode] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  

  return (
    <div>
        <CustomAppBar mode={mode} setMode={setMode} />
        <div className='flex'>
            <CustomSidebar 
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
        </div>    
    </div>
  )
}

export default SuperAppLayout