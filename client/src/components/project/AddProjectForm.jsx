import React, { useState } from "react";
import newRequest from "../../utils/newRequest";

const AddProjectForm = ({ optionId, onProjectAdded }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await newRequest.post("/projects", { name, optionId });
      onProjectAdded(res.data);
      setName("");
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex my-3">
      <input
        className="form-control me-2"
        placeholder="New Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn btn-success">Add Project</button>
    </form>
  );
};

export default AddProjectForm;
