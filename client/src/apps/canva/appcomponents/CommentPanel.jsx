// src/apps/canva/appcomopnents/CommentPanel.jsx
import { useEffect, useState } from 'react';
import api from '../../../api';
import { useEditorStore } from '../store/editorStore';

export default function CommentPanel() {
  const designId = useEditorStore((s) => s.designId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  const load = async () => {
    const { data } = await api.get(`/canvaComments/${designId}`);
    setItems(data);
  };

  useEffect(() => {
    if (designId) load();
  }, [designId]);

  const add = async () => {
    if (!text.trim()) return;
    const { data } = await api.post(`/canvaComments/${designId}`, { text, targetElementId: selectedIds[0] });
    setItems((i) => [...i, data]);
    setText('');
  };

  const resolve = async (id) => {
    const { data } = await api.patch(`/canvaComments/resolve/${id}`);
    setItems((i) => i.map((x) => (x._id === id ? data : x)));
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="input-group">
        <input className="form-control" placeholder="Add a comment" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn btn-primary" onClick={add}>Add</button>
      </div>
      <div className="list-group">
        {items.map((c) => (
          <div key={c._id} className="list-group-item">
            <div className="small text-muted">{new Date(c.createdAt).toLocaleString()}</div>
            <div>{c.text}</div>
            {c.targetElementId && <div className="badge bg-secondary mt-1">on {c.targetElementId.slice(0,6)}</div>}
            <div className="mt-2">
              {!c.resolved ? (
                <button className="btn btn-sm btn-outline-success" onClick={() => resolve(c._id)}>Resolve</button>
              ) : (
                <span className="badge bg-success">Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
