// src/apps/canva/appcomopnents/RightPanel.jsx
import PropertiesPanel from './PropertiesPanel';
import CommentPanel from './CommentPanel';

export default function RightPanel() {
  return (
    <div className="border-start" style={{ width: 320, overflow: 'auto' }}>
      <div className="p-2">
        <h6 className="text-muted">Properties</h6>
        <PropertiesPanel />
      </div>
      <div className="p-2 border-top">
        <h6 className="text-muted">Comments</h6>
        <CommentPanel />
      </div>
    </div>
  );
}
