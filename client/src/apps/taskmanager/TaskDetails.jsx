import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { Row, Col, Tabs, Tab, Badge, Button, Form, Image, Card } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
  FaBug,
  FaTasks,
  FaThumbsUp,
  FaUser,
} from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";

// import { tasks } from "../assets/data";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../../utils";
// import Loading from "../components/Loader";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-danger bg-opacity-25",
  medium: "bg-warning bg-opacity-25",
  low: "bg-primary bg-opacity-25",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 24, height: 24 }}>
      <FaUser size={14} />
    </div>
  ),
  bug: <FaBug size={24} className="text-danger" />,
  completed: (
    <div className="rounded-circle bg-success d-flex align-items-center justify-content-center text-white" style={{ width: 40, height: 40 }}>
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="rounded-circle bg-purple d-flex align-items-center justify-content-center text-white" style={{ width: 32, height: 32, backgroundColor: "#7c3aed" }}>
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  // console.log(id);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("task-detail");
  // const task = tasks[3]; // static 
  
 /* const fetchTask = async () => {
    try {
      // const res = await newRequest.get(`/tasks/${task._id}`);
      const res = await newRequest.get(`/tasks/${id}`);
      setTask(res.data);
      console.log(res.data);
      console.log(task);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }; */

  const fetchTask = async () => {
    try {
      const res = await newRequest.get(`/tasks/${id}`);
      setTask(res.data.task); // make sure to access `task` from response
      // console.log(res.data.task);
    } catch (err) {
      console.error("Error loading task:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTask();
  }, [id]);

  // console.log(task);

  if (loading || !task) {
    return <div>Loading...</div>; // or a spinner component
  }


  return (
    <Box className="p-3 bg-light rounded shadow-sm">
      
      <Typography variant="h4" gutterBottom>
        {task?.title}
      </Typography>

      <Tabs
        activeKey={selectedTab}
        onSelect={(k) => setSelectedTab(k)}
        className="mb-3"
      >
        <Tab eventKey="task-detail" title={<><FaTasks className="me-2" /> Task Detail</>}>
          <Row className="bg-white shadow-sm rounded p-4">
            <Col md={6} className="mb-4 mb-md-0">
              {/* Priority & Stage */}
              <div className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-semibold text-uppercase mb-3 ${PRIOTITYSTYELS[task?.priority]} ${bgColor[task?.priority]}`}>
                <span style={{ fontSize: "1.25rem" }}>{ICONS[task?.priority]}</span>
                {task?.priority} Priority 
              </div>

              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className={`rounded-circle me-2`}
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: TASK_TYPE[task?.stage],
                  }}
                />
                <span className="text-uppercase fw-bold">{task?.stage}</span>
              </div>

              <Typography variant="body2" color="textSecondary" className="mb-3">
                Created At: {new Date(task?.date).toDateString()}
              </Typography>

              <div className="d-flex gap-4 py-3 border-top border-bottom border-secondary-subtle mb-4">
                <div>
                  <Typography component="span" className="fw-bold">Assets:</Typography>{" "}
                  <Typography component="span">{task?.assets?.length}</Typography>
                </div>

                <div>
                  <Typography component="span" className="fw-bold">Sub-Task:</Typography>{" "}
                  <Typography component="span">{task?.subTasks?.length}</Typography>
                </div>
              </div>

              {/* Team */}
              <Typography variant="subtitle1" className="mb-3 text-secondary fw-semibold">
                Task Team
              </Typography>
              <div>
                {task?.team?.map((m, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center gap-3 py-2 border-top border-secondary-subtle"
                  >
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontWeight: 600 }}>
                      {getInitials(m?.username)}
                    </div>
                    <div>
                      <Typography variant="h6" className="mb-0">{m?.username}</Typography>
                      <Typography variant="body2" className="text-muted">{m?.title}</Typography>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-Tasks */}
              <Typography variant="subtitle1" className="mt-5 mb-3 text-muted fw-semibold">
                Sub-Tasks
              </Typography>
              <div>
                {task?.subTasks?.map((el, index) => (
                  <div key={index} className="d-flex gap-3 mb-4">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: "#ede9fe" }}>
                      <MdTaskAlt className="text-primary" size={26} />
                    </div>

                    <div>
                      <div className="d-flex gap-2 align-items-center mb-1">
                        <Typography variant="caption" className="text-muted">
                          {new Date(el?.date).toDateString()}
                        </Typography>
                        <Badge bg="secondary" pill className="text-uppercase">
                          {el?.tag}
                        </Badge>
                      </div>

                      <Typography>{el?.title}</Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            {/* Right side - Assets */}
            <Col md={6}>
              <Typography variant="h6" className="mb-3">
                Assets
              </Typography>
              <Row xs={2} md={2} className="g-3">
                {task?.assets?.map((el, index) => (
                  <Col key={index}>
                    <Image
                      src={el}
                      alt={task?.title}
                      thumbnail
                      style={{ cursor: "pointer", transition: "transform 0.7s" }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="activities" title={<><RxActivityLog className="me-2" /> Activities/Timeline</>}>
          <Activities activity={task?.activities} id={id} />
        </Tab>
      </Tabs>
    </Box>
  );
};

const Activities = ({ activity }) => {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");
  const isLoading = false;
  const { id } = useParams();

  const handleSubmit = async () => {
    // your submit logic here
    if (!text.trim()) return;

    try {
      const res = await newRequest.post(`/tasks/activity/${id}`, {
        type: selected.toLowerCase(),
        activity: text.trim()
      });

      if (res.data.status) {
        console.log(res.data.message);
        setText(""); // Clear input
        // Optionally refresh task details so the new activity shows
        // fetchTask();
      }
    } catch (err) {
      console.error("Error posting activity:", err);
    }
  };

  const CardActivity = ({ item }) => (
    <div className="d-flex mb-4">
      <div className="d-flex flex-column align-items-center flex-shrink-0 me-3">
        <div style={{ width: 40, height: 40 }}>{TASKTYPEICON[item?.type]}</div>
        <div className="flex-grow-1" style={{ width: 2, backgroundColor: "#d1d5db" }} />
      </div>
      <div>
        <Typography variant="subtitle1" className="fw-semibold mb-1">{item?.by?.name}</Typography>
        <div className="text-muted mb-2">
          <span className="text-capitalize me-3">{item?.type}</span>
          <span className="small">{moment(item?.date).fromNow()}</span>
        </div>
        <Typography>{item?.activity}</Typography>
      </div>
    </div>
  );

  return (
    <Row className="bg-white shadow rounded p-4 gap-4" style={{ minHeight: "75vh" }}>
      <Col md={7}>
        <Typography variant="h5" className="mb-4 text-secondary fw-semibold">Activities</Typography>
        {activity?.map((el, index) => (
          <CardActivity key={index} item={el} />
        ))}
      </Col>

      <Col md={5}>
        <Typography variant="h5" className="mb-4 text-secondary fw-semibold">Add Activity</Typography>
        <Form>
          <div className="mb-3 d-flex flex-wrap gap-3">
            {act_types.map((item) => (
              <Form.Check
                inline
                key={item}
                label={item}
                type="radio"
                name="activityType"
                id={`act-type-${item}`}
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
            ))}
          </div>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Type ......"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-secondary"
            />
          </Form.Group>

          {isLoading ? (
            <Loading />
          ) : (
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default TaskDetails;
