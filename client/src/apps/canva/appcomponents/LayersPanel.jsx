// src/apps/canva/appcomopnents/LayersPanel.jsx
import { useEditorStore } from '../store/editorStore';

export default function LayersPanel() {
  const { elements, selectedIds, select } = useEditorStore((s) => ({ elements: s.elements, selectedIds: s.selectedIds, select: s.select }));

  const toggleLock = (id) => {
    const { bulkUpdate } = useEditorStore.getState();
    bulkUpdate([id], (e) => ({ ...e, locked: !e.locked }));
  };

  const toggleVisible = (id) => {
    const { bulkUpdate } = useEditorStore.getState();
    bulkUpdate([id], (e) => ({ ...e, hidden: !e.hidden }));
  };

  const bringForward = (id) => {
    const s = useEditorStore.getState();
    const idx = s.elements.findIndex((e) => e.id === id);
    if (idx < 0 || idx === s.elements.length - 1) return;
    const arr = [...s.elements];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    s.pushHistory();
    useEditorStore.setState({ elements: arr });
  };

  const sendBackward = (id) => {
    const s = useEditorStore.getState();
    const idx = s.elements.findIndex((e) => e.id === id);
    if (idx <= 0) return;
    const arr = [...s.elements];
    [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
    s.pushHistory();
    useEditorStore.setState({ elements: arr });
  };

  return (
    <div className="list-group">
      {elements?.map((e) => (
        <div key={e.id} className={`list-group-item d-flex align-items-center ${selectedIds.includes(e.id) ? 'active' : ''}`} role="button" onClick={() => select([e.id])}>
          <div className="me-auto text-truncate">{e.type} – {e.id.slice(0, 6)}</div>
          <div className="btn-group btn-group-sm">
            <button className="btn btn-outline-secondary" onClick={(ev) => {ev.stopPropagation(); bringForward(e.id);}}>▲</button>
            <button className="btn btn-outline-secondary" onClick={(ev) => {ev.stopPropagation(); sendBackward(e.id);}}>▼</button>
            <button className="btn btn-outline-secondary" onClick={(ev) => {ev.stopPropagation(); toggleLock(e.id);}}>{e.locked ? 'Unlock' : 'Lock'}</button>
            <button className="btn btn-outline-secondary" onClick={(ev) => {ev.stopPropagation(); toggleVisible(e.id);}}>{e.hidden ? 'Show' : 'Hide'}</button>
          </div>
        </div>
      ))}
    </div>
  );
}
