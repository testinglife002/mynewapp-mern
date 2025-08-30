import React, { useEffect, useState } from "react";
import AddOptionForm from "../../components/options/AddOptionForm";
import OptionList from "../../components/options/OptionList";
import OptionManager from "../../components/options/OptionManager";
import ProjectManager from "../../components/project/ProjectManager";
import TodoManager from "../../apps/todoapp/TodoManager";
import newRequest from "../../utils/newRequest";


const DashboardUser = ({ user }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

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
  
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Dashboard</h3>
        <button className="btn btn-danger" >
          Logout
        </button>
        <div className="p-4">
            <h3>Welcome, {user?.username}</h3>
            <p>Email: {user?.email}</p>
        </div>
      </div>

      <div className="container mt-4">
        <h2>Your Options</h2>
        <AddOptionForm onOptionAdded={handleOptionAdded} />
        {/*<OptionList onOptionSelected={(opt) => setSelectedOption(opt)} />*/}
        {/* <OptionList
            options={options}
            onOptionSelected={(opt) => setSelectedOption(opt)}
            selectedOption={selectedOption}
        /> */}
        {/* selectedOption && 
        (
            <OptionManager option={selectedOption} />
        ) */}
       </div>


      <div className="container mt-4">  
      <OptionManager onSelectOption={(optionId) => setSelectedOptionId(optionId)} />
      <ProjectManager selectedOptionId={selectedOptionId} />
      {/*<TodoManager selectedProjectId={selectedProjectId} />*/}
      </div>  
     
    </div>
  );
};

export default DashboardUser;
