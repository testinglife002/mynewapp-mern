import React, { useEffect, useState } from "react";
import {
  GridView,
  ViewList,
  TableRows,
  ViewKanban,
  FormatListBulleted,
} from "@mui/icons-material";
import {
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Spinner,
  Row,
  Col,
  Table,
  Card,
  Container,
  Button as RBButton,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import AddTask from "./AddTask";
import Button from "./layout/Button";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Title from "./appcomponents/Title";
import TaskTitle from "./appcomponents/TaskTitle";
import BoardView from "./appcomponents/BoardView";
import TaskTable from "./appcomponents/TaskTable";
import TaskDetailsModal from "./TaskDetailsModal";
import TaskCard from "./TaskCard";

const TASK_TYPE = {
  todo: "bg-primary",
  "in progress": "bg-warning text-dark",
  completed: "bg-success",
};

const Tasks = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("board");

  const [selectedTask, setSelectedTask] = useState(null);


  const { status } = useParams();

  const fetchTasks = async () => {
    try {
      const res = await newRequest.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleViewChange = (val) => {
    setView(val);
  };

  // DELETE function
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await newRequest.delete(`/tasks/delete/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      if (selectedTask?._id === taskId) setSelectedTask(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task");
    }
  };

  const renderCardView = () => (
    <Row>
      {tasks.map((task) => (
        <Col key={task._id} xs={12} sm={6} md={4} lg={3}>
          <Card onClick={() => setSelectedTask(task)} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>{task.title}</Card.Title>
              <div className="mb-2">
                <Badge bg={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "secondary"}>
                  {task.priority}
                </Badge>{" "}
                
                <Badge bg="light" text="dark" className="ms-2 text-capitalize">
                  {task.stage}
                </Badge>
              </div>
              {task.team?.length > 0 && (
                <div>
                  {task.team.map((user) => (
                    <Badge bg="info" key={user._id} className="me-1">
                      {user.username || user.username}
                    </Badge>
                  ))}
                </div>
              )}
            </Card.Body>
            <Card.Footer>
              <RBButton
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening details modal
                  handleDelete(task._id);
                }}
              >
                <MdDelete /> Delete
              </RBButton>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderTableView = () => (
    <Table bordered hover responsive className="mt-3">
      <thead className="table-dark">
        <tr>
          <th>Title</th>
          <th>Priority</th>
          <th>Stage</th>
          <th>Users</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} onClick={() => setSelectedTask(task)} style={{ cursor: "pointer" }}>
            <td>{task.title}</td>
            <td>
              <Badge bg={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "secondary"}>
                {task.priority}
              </Badge>
            </td>
            <td>
              <Badge bg="light" text="dark" className="text-capitalize">
                {task.stage}
              </Badge>
            </td>
            <td>
              {task.team?.map((user) => (
                <Badge key={user._id} bg="info" className="me-1">
                  {user.username || user.name}
                </Badge>
              ))}
            </td>
            <td>
              <RBButton
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task._id);
                }}
                title="Delete Task"
              >
                <MdDelete />
              </RBButton>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderListView = () => (
    <div className="mt-3">
      {tasks.map((task) => (
        <Card key={task._id} onClick={() => setSelectedTask(task)} className="mb-2 shadow-sm">
          <Card.Body>
            <Card.Title>{task.title}</Card.Title>
            <div className="mb-2">
              <Badge bg={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "secondary"}>
                {task.priority}
              </Badge>{" "}
              <Badge bg="light" text="dark" className="ms-2 text-capitalize">
                {task.stage}
              </Badge>
            </div>
            <div>
              {task.team?.map((user) => (
                <Badge key={user._id} bg="info" className="me-1">
                  {user.username || user.name}
                </Badge>
              ))}
            </div>
          </Card.Body>
          <Card.Footer>
            <RBButton
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(task._id);
              }}
            >
              <MdDelete /> Delete
            </RBButton>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );

  const renderBoardView = () => (
    <Container fluid className="py-4">
      <Row xs={1} sm={2} md={3} className="g-4">
        {tasks.map((task, index) => (
          <Col key={index} onClick={() => setSelectedTask(task)} >
            {<TaskCard task={task} />}
            {/*<TaskCardAlt task={task} />*/}
          </Col>
        ))}
      </Row>
    </Container>
  )

  return (
    <div className="container mt-4">

      <br/><hr/><br/>
      <Row xs={1} sm={2} md={3} className="g-4">
        {tasks.map((task, index) => (
          <>
            <Link to={`/task/${task._id}`} >
              <h5>{task.title}</h5>
            </Link>
          </>
        ))}
      </Row>
      <br/><hr/><br/>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Title title={status ? `${status} Tasks` : "All Tasks"} />
        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAddCircleOutline className="me-1" />}
            className="btn btn-primary d-flex align-items-center"
          />
        )}
      </div>

      <div className="d-flex justify-content-end mb-3">
        <ToggleButtonGroup type="radio" name="view" value={view} onChange={handleViewChange}>
          <ToggleButton id="tbg-board" variant="outline-primary" value="board">
            <ViewKanban />
          </ToggleButton>
          <ToggleButton id="tbg-list" variant="outline-primary" value="list">
            <FormatListBulleted />
          </ToggleButton>
          <ToggleButton id="tbg-grid" variant="outline-primary" value="grid">
            <GridView />
          </ToggleButton>
          <ToggleButton id="tbg-table" variant="outline-primary" value="table">
            <TableRows />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <>
          {view === "board" && renderBoardView()}
          {view === "list" && renderListView()}
          {view === "grid" && renderCardView()}
          {view === "table" && renderTableView()}
        </>
      )}

      <AddTask open={open} setOpen={setOpen} refresh={fetchTasks} />

      <TaskDetailsModal
        show={!!selectedTask}
        onHide={() => setSelectedTask(null)}
        task={selectedTask}
        onTaskUpdated={(updatedTask) => {
          // update task list or state
          setTasks((prev) =>
            prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
          );
        }}
      />

    </div>
  );
};

export default Tasks;
