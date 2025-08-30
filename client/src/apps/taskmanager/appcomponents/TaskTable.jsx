import React, { useState } from 'react';
import { Table as RBTable, Button as RBButton } from 'react-bootstrap';
import { BiMessageAltDetail } from 'react-icons/bi';
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md';
import { FaList } from 'react-icons/fa';
import clsx from 'clsx';
// import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from '../../utils';
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../../../utils";
// import UserInfo from '../UserInfo';
// import ConfirmatioDialog from '../Dialogs';
import { Button as MUIButton, Box, Typography } from '@mui/material';
import UserInfo from './UserInfo';
import ConfirmatioDialog from './ConfirmatioDialog';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskTable = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const deleteHandler = () => {
    // Handle delete logic
  };

  return (
    <>
      <Box className="bg-white shadow-sm rounded p-3">
        <div className="table-responsive">
          <RBTable striped bordered hover responsive className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Task Title</th>
                <th>Priority</th>
                <th>Created At</th>
                <th>Assets</th>
                <th>Team</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={clsx('rounded-circle')}
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: TASK_TYPE[task.stage],
                        }}
                      />
                      <span className="fw-semibold">{task?.title}</span>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center gap-1 text-capitalize">
                      <span className={clsx('fs-6', PRIOTITYSTYELS[task?.priority])}>
                        {ICONS[task?.priority]}
                      </span>
                      {task?.priority} Priority
                    </div>
                  </td>

                  <td>
                    <small className="text-muted">
                      {formatDate(new Date(task?.date))}
                    </small>
                  </td>

                  <td>
                    <div className="d-flex gap-2 text-muted">
                      <div className="d-flex align-items-center gap-1">
                        <BiMessageAltDetail />
                        <span>{task?.activities?.length}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <MdAttachFile />
                        <span>{task?.assets?.length}</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <FaList />
                        <span>0/{task?.subTasks?.length}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center">
                      {task?.team?.map((m, index) => (
                        <div
                          key={m._id}
                          className={clsx(
                            'rounded-circle d-flex align-items-center justify-content-center text-white text-center me-1',
                            BGS[index % BGS.length]
                          )}
                          style={{ width: '28px', height: '28px', fontSize: '12px' }}
                        >
                          <UserInfo user={m} />
                        </div>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <MUIButton
                        variant="text"
                        size="small"
                        color="primary"
                        onClick={() => console.log('edit clicked')}
                      >
                        Edit
                      </MUIButton>

                      <MUIButton
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => deleteClicks(task._id)}
                      >
                        Delete
                      </MUIButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </RBTable>
        </div>
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default TaskTable;
