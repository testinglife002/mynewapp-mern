import React, { useState } from "react";
import newRequest from "../../utils/newRequest";


const AddOptionForm = ({ onOptionAdded }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await newRequest.post("/options", { name });
      onOptionAdded(res.data);
      setName("");
    } catch (err) {
      alert("Failed to add option");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex mb-3">
      <input
        className="form-control me-2"
        placeholder="New Option Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn btn-primary">Add</button>
    </form>
  );
};

export default AddOptionForm;
