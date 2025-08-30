// AppTodos.jsx or inside MainLayoutTodos.jsx
import { Routes, Route } from 'react-router-dom';
import TodayView from '../appcomponents/TodoViews/TodayView';
import InboxView from '../appcomponents/TodoViews/InboxView';
import ThisWeekView from '../appcomponents/TodoViews/ThisWeekView';
import AllTodosView from '../appcomponents/TodoViews/AllTodosView';
import CalendarView from '../appcomponents/TodoViews/CalendarView';
import SidebarTodos from './SidebarTodos';





function MainLayoutTodos() {
  return (
    <div className="d-flex">
      <SidebarTodos />
      <div className="flex-grow-1 p-4">
        <Routes>
          <Route path="/inbox" element={<InboxView />} />
          <Route path="/today" element={<TodayView />} />
          <Route path="/this-week" element={<ThisWeekView />} />
          <Route path="/all" element={<AllTodosView />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainLayoutTodos;
