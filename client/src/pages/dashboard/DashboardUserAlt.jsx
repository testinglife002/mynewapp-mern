// DashboardUser.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import OptionLists from "../../components/options/OptionLists";
import AddOptionForm from "../../components/options/AddOptionForm";
import AddProjectForm from "../../components/project/AddProjectForm";
import DisplayProjects from "../../components/project/DisplayProjects";
import DisplayAllProjects from "../../components/project/DisplayAllProjects";
import DisplayAllTodos from "../../apps/todoapp/DisplayAllTodos";
import AddTodoForm from "../../apps/todoapp/AddTodoForm";


const DashboardUserAlt = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [todos, setTodos] = useState([]);

  // Load Options from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await newRequest.get("/options");
        setOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };
    fetchOptions();
  }, []);

  // Handle new Option added
  const handleOptionAdded = (newOpt) => {
    setOptions((prev) => [...prev, newOpt]);
  };

  // Handle new Project added
   const handleProjectAdded = (project) => {
    console.log("Project Added:", project);
   };

  // Handle new Todo added
  // const handleTodoAdded = (todo) => {
  //  console.log("Todo Added:", todo);
  // };

  useEffect(() => {
    // Fetch all projects
    const fetchProjects = async () => {
      try {
        // const token = localStorage.getItem("token");
        // const res = await axios.get("/api/projects", {
        //  headers: { Authorization: `Bearer ${token}` },
        // });
        const res = await newRequest.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const handleTodoAdded = (newTodo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  return (
    <div className="container py-4">
      <h4>Welcome to Dashboard</h4>
      <div className="row">
        {/* Option List */}
        <div className="col-md-3">
          <h5>Options</h5>
          <OptionLists
            options={options}
            selectedOption={selectedOption}
            onOptionSelected={setSelectedOption}
          />
          <AddOptionForm onOptionAdded={handleOptionAdded} />
        </div>

        {/* Project & Todo Section */}
        <div className="col-md-9">
          {selectedOption && (
            <>
              <h5>Projects under: {selectedOption.name}</h5>
              <AddProjectForm
                optionId={selectedOption._id}
                onProjectAdded={handleProjectAdded}
              />
              <DisplayAllProjects
                optionId={selectedOption._id}
                onProjectSelected={setSelectedProject}
              />

              { selectedProject && (
                <>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + Add Todo
                </button>

                <AddTodoForm
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  onTodoAdded={handleTodoAdded}
                  projects={projects}
                  projectId={selectedProject._id}
                  //onTodoAdded={handleTodoAdded}
                />
                </>
              ) }

                {selectedProject && (
                <>
                    <h6>Todos under project: {selectedProject.name}</h6>
                    {/*<AddTodoForm
                    projectId={selectedProject._id}
                    onTodoAdded={handleTodoAdded}
                    />*/}
                    <DisplayAllTodos projectId={selectedProject._id} />
                </>
                )}

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUserAlt;
