// components/MainViewTodo.jsx
import React from 'react';
import TodayView from './TodoViews/TodayView';
import ThisWeekView from './TodoViews/ThisWeekView';
import InboxView from './TodoViews/InboxView';
import CalendarView from './TodoViews/CalendarView';
import AllTodosView from './TodoViews/AllTodosView';

const MainViewTodo = ({ activeView }) => {
  switch (activeView) {
    case 'today':
      return <TodayView />;
    case 'this-week':
      return <ThisWeekView />;
    case 'inbox':
      return <InboxView />;
    case 'calendar':
      return <CalendarView />;
    case 'all':
    default:
      return <AllTodosView />;
  }
};

export default MainViewTodo;
