
import React from "react";

const OptionList = ({ options, onOptionSelected, selectedOption }) => {
  return (
    <ul className="list-group mb-4">
      {options?.map((opt) => (
        <li
          key={opt._id}
          className={`list-group-item ${
            selectedOption && selectedOption._id === opt._id ? "active" : ""
          }`}
          onClick={() => onOptionSelected(opt)}
          style={{ cursor: "pointer" }}
        >
          {opt.name}
        </li>
      ))}
    </ul>
  );
};

export default OptionList;
/*
import React, { useEffect, useState } from "react";
import EditOptionModal from "./EditOptionModal";
import newRequest from "../../utils/newRequest";


const OptionList = ({ onOptionSelected }) => {
  const [options, setOptions] = useState([]);
  const [editOption, setEditOption] = useState(null);

  const fetchOptions = async () => {
    try {
      const res = await newRequest.get("/options");
      setOptions(res.data);
    } catch {
      alert("Failed to load options");
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await newRequest.delete(`/options/${id}`);
      setOptions((prev) => prev.filter((opt) => opt._id !== id));
    } catch {
      alert("Failed to delete option");
    }
  };

  const handleUpdated = (updated) => {
    setOptions((prev) =>
      prev.map((opt) => (opt._id === updated._id ? updated : opt))
    );
  };

  const handleAdded = (newOption) => {
    setOptions((prev) => [newOption, ...prev]);
  };

  return (
    <div>
      <h4>Your Options</h4>
      <ul className="list-group">
        {options.map((opt) => (
          <li
            key={opt._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span onClick={() => onOptionSelected(opt)} style={{ cursor: "pointer" }}>
              {opt.name}
            </span>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => setEditOption(opt)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(opt._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <EditOptionModal
        show={!!editOption}
        onHide={() => setEditOption(null)}
        option={editOption}
        onUpdated={handleUpdated}
      />
    </div>
  );
};

export default OptionList;
*/





