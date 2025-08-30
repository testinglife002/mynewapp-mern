// components/TaskTitle.jsx
import React from "react";
import { IoMdAdd } from "react-icons/io";
import clsx from "clsx";
import { Button } from "react-bootstrap";

const TaskTitle = ({ label, className, onAddClick }) => {
  return (
    <div className="w-100 px-3 py-2 bg-white d-flex align-items-center justify-content-between rounded shadow-sm">
      <div className="d-flex align-items-center gap-2">
        <div className={clsx("rounded-circle", className)} style={{ width: 16, height: 16 }} />
        <p className="mb-0 text-secondary small">{label}</p>
      </div>
      <Button variant="light" size="sm" className="d-none d-md-block p-1" onClick={onAddClick}>
        <IoMdAdd className="text-dark" />
      </Button>
    </div>
  );
};

export default TaskTitle;
