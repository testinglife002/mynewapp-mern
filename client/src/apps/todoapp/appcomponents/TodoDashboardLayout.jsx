import React, { useState } from "react";
import SidebarTodo from "./SidebarTodo";
import MainView from "./MainView";  
import MainViewTodo from "./MainViewTodo";


const TodoDashboardLayout = () => {

  const [selectedView, setSelectedView] = useState("inbox");

  const [activeView, setActiveView] = useState('today');

  return (
    <div className="d-flex">
     {/*} <SidebarTodo onSelect={(view) => setSelectedView(view)} /> */}
      <SidebarTodo setActiveView={setActiveView} />
      <div className="flex-grow-1 bg-light">
       {/* <MainView selectedView={selectedView} /> */}
         <MainViewTodo activeView={activeView} />
      </div>
    </div>
  );
};

export default TodoDashboardLayout;
