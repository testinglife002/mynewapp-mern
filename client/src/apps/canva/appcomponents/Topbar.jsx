// srTopbar.jsxc/apps/canva/appcomopnents/

import { useEditorStore } from '../store/editorStore';

export default function Topbar({ stageRef }) {
  const { name, undo, redo } = useEditorStore((s) => ({ name: s.name, undo: s.undo, redo: s.redo }));

  const exportPNG = () => {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = uri;
    a.download = `${name || 'design'}.png`;
    a.click();
  };

  return (
    <div className="border-bottom px-3 py-2 d-flex align-items-center gap-2">
      <div className="fw-bold">Canva Clone</div>
      <div className="vr mx-2" />
      <button className="btn btn-outline-secondary btn-sm" onClick={undo}>Undo</button>
      <button className="btn btn-outline-secondary btn-sm" onClick={redo}>Redo</button>
      <div className="ms-auto d-flex gap-2">
        <button className="btn btn-primary btn-sm" onClick={exportPNG}>Export PNG</button>
      </div>
    </div>
  );
}
