import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import Topbar from './appcomponents/Topbar';
import Sidebar from './appcomponents/Sidebar';
import RightPanel from './appcomponents/RightPanel';
import CanvasStage from './appcomponents/CanvasStage';
import { useEditorStore } from './store/editorStore';
import CanvasStageAlt from './appcomponents/CanvasStageAlt';
import CanvasStageNew from './appcomponents/CanvasStageNew';

export default function Editor() {
  const { designId } = useParams();
  const [loading, setLoading] = useState(true);
  const stageRef = useRef();
  const setDesign = useEditorStore((s) => s.setDesign);

  useEffect(() => {
    async function load() {
      // The route expects a designId; if a project ID was passed, you'd resolve the latest design first.
      const { data } = await api.get(`/designs/${designId}`);
      setDesign({
        designId: data._id,
        projectId: data.project,
        name: data.name,
        width: data.width,
        height: data.height,
        background: data.background,
        elements: data.elements,
        selectedIds: [],
        past: [],
        future: [],
      });
      setLoading(false);
    }
    load();
  }, [designId]);

  if (loading) return <div className="p-3">Loading design...</div>;

  return (
    <div className="d-flex flex-column" style={{ height: '100vh' }}>
      <Topbar stageRef={stageRef} />
      <div className="d-flex flex-grow-1 overflow-hidden">
        <Sidebar />
        <div className="flex-grow-1 bg-light">
          {/*<CanvasStage stageRef={stageRef} />*/}
          {<CanvasStageAlt stageRef={stageRef} />}
          {/*<CanvasStageNew stageRef={stageRef} />*/}

        </div>
        <RightPanel />
      </div>
    </div>
  );
}
