// components/MainView.jsx
import React, { useEffect, useState } from "react";
import InboxView from "./TodoViews/InboxView";
import TodayView from "./TodoViews/TodayView";
import ThisWeekView from "./TodoViews/ThisWeekView";
import AllTodosView from "./TodoViews/AllTodosView";
import CalendarView from "./TodoViews/CalendarView";

/*
import InboxView from "./views/InboxView";
import TodayView from "./views/TodayView";
import ThisWeekView from "./views/ThisWeekView";
import AllTodosView from "./views/AllTodosView";
import CalendarView from "./views/CalendarView";
*/

const MainView = ({ selectedView }) => {
  const [currentView, setCurrentView] = useState("inbox");

  useEffect(() => {
    if (selectedView) {
      setCurrentView(selectedView);
    }
  }, [selectedView]);

  const renderView = () => {
    switch (currentView) {
      case "inbox":
        return <InboxView />;
      case "today":
        return <TodayView />;
      case "this-week":
        return <ThisWeekView />;
      case "all":
        return <AllTodosView />;
      case "calendar":
        return <CalendarView />;
      default:
        return <InboxView />;
    }
  };

  
  return (
    <div className="p-3" style={{ minHeight: "80vh" }}>
      {renderView()}
    </div>
  );
};

export default MainView;
