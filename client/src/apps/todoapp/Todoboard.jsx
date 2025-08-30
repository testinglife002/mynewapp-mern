import React, { useState } from 'react';

import { Container } from 'react-bootstrap';
import OptionManager from '../../components/options/OptionManager';
import ProjectManager from '../../components/project/ProjectManager';
import TodoManager from './TodoManager';
import DisplayProjects from '../../components/project/DisplayProjects';

const Todoboard = ( { user } ) => {
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  // const user = null;
  return (
    <Container className="mt-3">

      {<OptionManager
        user={user}
        onSelectOption={(id) => {
          setSelectedOptionId(id);
          setSelectedProjectId(null); // reset project when option changes
        }}
      />
      /*<ProjectManager
        user={user}
        selectedOptionId={selectedOptionId}
        onSelectProject={(id) => setSelectedProjectId(id)}
      />
      <TodoManager
        user={user}
        selectedProjectId={selectedProjectId}
      />*/}

     {/*  <DisplayProjects  /> */}
       <DisplayProjects optionId={selectedOptionId} onSelect={selectedProjectId} />

    </Container>
  );
};

export default Todoboard;
