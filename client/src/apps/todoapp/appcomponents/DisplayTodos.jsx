import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Table,
  Row,
  Col,
  ToggleButtonGroup,
  ToggleButton,
  ListGroup,
  Accordion
} from "react-bootstrap";
import {
  GridView,
  ViewList,
  TableRows,
  ViewKanban,
  FormatListBulleted
} from "@mui/icons-material";
import dayjs from "dayjs";
import newRequest from "../../../utils/newRequest";
import TodosDetailsModal from "./TodosDetailsModal";
import { scheduleRemindersForTodo } from "../../../utils/reminderScheduler";
import { AiOutlineCopy } from "react-icons/ai";
import { BsArrowRepeat } from "react-icons/bs";
import toast from "react-hot-toast";


const DisplayTodos = () => {
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState("grid");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);

 
   /*  const targetDate = todo.startDateTime || todo.dueDate; // Use whichever you're tracking
  const countdown = useCountdown(targetDate);

  {targetDate && countdown ? (
          <p className="text-success small mb-0">
            ⏳ Starts in: {countdown.years > 0 && `${countdown.years}y `}
            {countdown.months > 0 && `${countdown.months}mo `}
            {countdown.weeks > 0 && `${countdown.weeks}w `}
            {countdown.days > 0 && `${countdown.days}d `}
            {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
          </p>
        ) : (
          <p className="text-muted small mb-0">🕑 No upcoming time</p>
        )} */

  const fetchTodos = async () => {
    try {
      const res = await newRequest.get("/todos/my-todos");
      setTodos(res.data);
      // todos.forEach(todo => {
      //  scheduleRemindersForTodo(todo);
      // });

    } catch (err) {
      console.error("Failed to fetch todos", err);
    }
  };

  useEffect(() => {
    fetchTodos();
    // todos.forEach(todo => {
    //   scheduleRemindersForTodo(todo);
    // });

  }, []);

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const handleDuplicate = async (todo) => {
    try {
      const res = await newRequest.post(`/todos/${todo._id}/duplicate`);
      toast.success('Todo duplicated');
      fetchTodos();
    } catch (error) {
      console.error(error);
      toast.error('Failed to duplicate todo');
    }
  };


  const renderTodoCard = (todo) => (
    <Card key={todo._id} className="m-2 shadow-sm" onClick={() => handleTodoClick(todo)} style={{ cursor: "pointer", width: "18rem" }}>
      <Card.Body>
        <Card.Title>{todo.title}</Card.Title>
        <Card.Text className="text-muted">{dayjs(todo.start).format("MMM D, YYYY h:mm A")}</Card.Text>
        <span className={`badge bg-${todo.priority === "high" ? "danger" : todo.priority === "medium" ? "warning" : "secondary"}`}>
          {todo.priority}
        </span>
        <span className="ms-2 badge bg-light text-dark">{todo.completed ? "Completed" : "Pending"}</span>
       
        <button onClick={(e) => {
              e.stopPropagation(); // prevent opening modal
              handleDuplicate(todo);
          }} className="btn btn-sm btn-light">
            <small className="badge bg-dark text-light">
              <AiOutlineCopy size={12} /> Duplicate <BsArrowRepeat size={12} />
            </small>
        </button>


      </Card.Body>
    </Card>
  );

  const renderTableView = () => (
    <Table bordered hover responsive className="mt-3">
      <thead className="table-dark">
        <tr>
          <th>Title</th>
          <th>Date & Time</th>
          <th>Priority</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo._id} onClick={() => handleTodoClick(todo)} style={{ cursor: "pointer" }}>
            <td>{todo.title}</td>
            <td>{dayjs(todo.start).format("MMM D, YYYY h:mm A")}</td>
            <td>{todo.priority}</td>
            <td>{todo.completed ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderBoardView = () => (
    <Row>
      {["low", "medium", "high"].map((priority) => (
        <Col key={priority}>
          <h5 className="text-capitalize text-center">{priority} Priority</h5>
          {todos
            .filter((todo) => todo.priority === priority)
            .map((todo) => renderTodoCard(todo))}
        </Col>
      ))}
    </Row>
  );

  const renderListView = () => (
    <Accordion defaultActiveKey="">
      {todos.map((todo, index) => (
        <Accordion.Item key={todo._id} eventKey={index.toString()}>
          <Accordion.Header onClick={() => setSelectedTodo(todo)}>
            <strong>{todo.title}</strong> — {todo.completed ? "✅ Completed" : "🕓 Pending"}
          </Accordion.Header>
          <Accordion.Body>
            <div>
              <p><strong>Start:</strong> {dayjs(todo.start).format("MMM D, YYYY h:mm A")}</p>
              <p><strong>End:</strong> {dayjs(todo.end).format("MMM D, YYYY h:mm A")}</p>
              <Button size="sm" variant="info" onClick={() => setShowModal(true)}>View / Edit</Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Todos</h4>
        <ToggleButtonGroup type="radio" name="view" value={view} onChange={(val) => setView(val)}>
          <ToggleButton id="grid" variant="outline-primary" value="grid"><GridView /></ToggleButton>
          <ToggleButton id="table" variant="outline-primary" value="table"><TableRows /></ToggleButton>
          <ToggleButton id="board" variant="outline-primary" value="board"><ViewKanban /></ToggleButton>
          <ToggleButton id="list" variant="outline-primary" value="list"><FormatListBulleted /></ToggleButton>
        </ToggleButtonGroup>
      </div>

      {view === "grid" && (
        <Row>
          {todos.map((todo) => (
            <Col key={todo._id} xs={12} sm={6} md={4} lg={3}>
              {renderTodoCard(todo)}
            </Col>
          ))}
        </Row>
      )}

      {view === "table" && renderTableView()}
      {view === "board" && renderBoardView()}
      {view === "list" && renderListView()}

      {selectedTodo && (
        <TodosDetailsModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedTodo(null);
          }}
          todo={selectedTodo}
          refreshTodos={fetchTodos}
        />
      )}
    </div>
  );
};

export default DisplayTodos;
