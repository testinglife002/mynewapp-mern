// Routes or App.jsx or MainLayout.jsx => RoutesAppMainLayout.jsx
import Sidebar from "./components/Sidebar";
import InboxView from "./views/InboxView";
import TodayView from "./views/TodayView";
import ThisWeekView from "./views/ThisWeekView";
import CalendarView from "./views/CalendarView";
import AllTodosView from "./views/AllTodosView";
import KanbanView from "./views/KanbanView";
import TodosByProject from "./views/TodosByProject"; // you'll create this

<Container fluid>
  <Row>
    <Col xs={3}>
      <Sidebar projects={projects} />
    </Col>
    <Col xs={9}>
      <Routes>
        <Route path="/todos/inbox" element={<InboxView />} />
        <Route path="/todos/today" element={<TodayView />} />
        <Route path="/todos/this-week" element={<ThisWeekView />} />
        <Route path="/todos/calendar" element={<CalendarView />} />
        <Route path="/todos/all" element={<AllTodosView />} />
        <Route path="/todos/kanban" element={<KanbanView />} />
        <Route path="/todos/project/:projectId" element={<TodosByProject />} />
      </Routes>
    </Col>
  </Row>
</Container>
