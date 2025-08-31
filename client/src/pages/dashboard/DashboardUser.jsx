// DashboardUser.jsx
import React, { useEffect, useState } from "react";
import AddOptionForm from "../../components/options/AddOptionForm";
import OptionManager from "../../components/options/OptionManager";
import ProjectManager from "../../components/project/ProjectManager";
import newRequest from "../../utils/newRequest";

const DashboardUser = ({ user }) => {
  const [options, setOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const fetchOptions = async () => {
    try {
      const res = await newRequest.get("/options");
      setOptions(res.data);
    } catch (err) {
      console.error("Failed to fetch options", err);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleOptionAdded = (newOption) => {
    setOptions((prev) => [...prev, newOption]);
  };

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.removeItem("token"); // cleanup
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Dashboard</h3>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="p-4">
        <h4>Welcome, {user?.username}</h4>
        <p>Email: {user?.email}</p>
      </div>

      <div className="container mt-4">
        <h5>Your Options</h5>
        <AddOptionForm onOptionAdded={handleOptionAdded} />
        <OptionManager onSelectOption={(id) => setSelectedOptionId(id)} />
      </div>

      <div className="container mt-4">
        <ProjectManager selectedOptionId={selectedOptionId} />
      </div>
    </div>
  );
};

export default DashboardUser;
