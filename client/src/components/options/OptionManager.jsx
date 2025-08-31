// OptionManager.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";

const OptionManager = ({ onSelectOption }) => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [editOptionId, setEditOptionId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchOptions = async () => {
    try {
      const res = await newRequest.get("/options");
      setOptions(res.data);
    } catch (err) {
      console.error("Failed to fetch options", err);
    }
  };

  const createOption = async () => {
    if (!newOption.trim()) return;
    try {
      const res = await newRequest.post("/options", { name: newOption });
      setOptions([...options, res.data]);
      setNewOption("");
    } catch (err) {
      console.error("Error creating option", err);
    }
  };

  const updateOption = async (id) => {
    try {
      const res = await newRequest.put(`/options/${id}`, { name: editText });
      setOptions(options.map((opt) => (opt._id === id ? res.data : opt)));
      setEditOptionId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to update option", err);
    }
  };

  const deleteOption = async (id) => {
    try {
      await newRequest.delete(`/options/${id}`);
      setOptions(options.filter((opt) => opt._id !== id));
    } catch (err) {
      console.error("Failed to delete option", err);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className="p-3 border rounded mb-4">
      <h5>Options</h5>
      <div className="d-flex mb-3">
        <input
          className="form-control me-2"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add new option"
        />
        <button className="btn btn-success" onClick={createOption}>
          Add
        </button>
      </div>

      {options.map((option) => (
        <div
          key={option._id}
          className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded"
        >
          <div style={{ cursor: "pointer" }} onClick={() => onSelectOption(option._id)}>
            {editOptionId === option._id ? (
              <input value={editText} onChange={(e) => setEditText(e.target.value)} />
            ) : (
              <strong>{option.name}</strong>
            )}
          </div>
          <div>
            {editOptionId === option._id ? (
              <>
                <button className="btn btn-sm btn-primary me-2" onClick={() => updateOption(option._id)}>
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setEditOptionId(null);
                    setEditText("");
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => {
                    setEditOptionId(option._id);
                    setEditText(option.name);
                  }}
                >
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOption(option._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OptionManager;
