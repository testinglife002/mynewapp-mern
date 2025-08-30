// src/apps/canva/appcomopnents/PropertiesPanel.jsx
import { useEditorStore } from '../store/editorStore';

export default function PropertiesPanel() {
  const { elements, selectedIds, updateElement, setBackground } = useEditorStore((s) => ({
    elements: s.elements,
    selectedIds: s.selectedIds,
    updateElement: s.updateElement,
    setBackground: s.setBackground,
  }));

  if (!selectedIds.length) {
    return (
      <div className="d-flex flex-column gap-2">
        <label className="form-label">Canvas Background</label>
        <input type="color" className="form-control form-control-color" onChange={(e) => setBackground(e.target.value)} />
      </div>
    );
  }

  const el = elements.find((e) => e.id === selectedIds[0]);
  if (!el) return null;

  const set = (k) => (e) => updateElement(el.id, { [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });

  return (
    <div className="d-flex flex-column gap-2">
      {el.type !== 'image' && (
        <>
          <label className="form-label">Fill</label>
          <input type="color" className="form-control form-control-color" value={el.attrs.fill || '#000000'} onChange={set('fill')} />
        </>
      )}

      <label className="form-label">X / Y</label>
      <div className="d-flex gap-2">
        <input type="number" className="form-control" value={Math.round(el.attrs.x || 0)} onChange={set('x')} />
        <input type="number" className="form-control" value={Math.round(el.attrs.y || 0)} onChange={set('y')} />
      </div>

      {el.type === 'text' && (
        <>
          <label className="form-label">Text</label>
          <input className="form-control" value={el.attrs.text || ''} onChange={set('text')} />
          <label className="form-label">Font size</label>
          <input type="number" className="form-control" value={el.attrs.fontSize || 24} onChange={set('fontSize')} />
        </>
      )}

      {(el.type === 'rect' || el.type === 'image') && (
        <>
          <label className="form-label">Width / Height</label>
          <div className="d-flex gap-2">
            <input type="number" className="form-control" value={Math.round(el.attrs.width || 0)} onChange={set('width')} />
            <input type="number" className="form-control" value={Math.round(el.attrs.height || 0)} onChange={set('height')} />
          </div>
        </>
      )}

      {el.type === 'circle' && (
        <>
          <label className="form-label">Radius</label>
          <input type="number" className="form-control" value={Math.round(el.attrs.radius || 0)} onChange={set('radius')} />
        </>
      )}
    </div>
  );
}
