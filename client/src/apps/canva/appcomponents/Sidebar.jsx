// src/apps/canva/appcomopnents/Sidebar.jsx
import AssetPanel from './AssetPanel';
import LayersPanel from './LayersPanel';

export default function Sidebar() {
  return (
    <div className="border-end" style={{ width: 300, overflow: 'auto' }}>
      <div className="p-2">
        <h6 className="text-muted">Assets</h6>
        <AssetPanel />
      </div>
      <div className="p-2 border-top">
        <h6 className="text-muted">Layers</h6>
        <LayersPanel />
      </div>
    </div>
  );
}
