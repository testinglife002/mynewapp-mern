// src/apps/canva/appcomopnents/AssetPanel.jsx
import { useRef, useState } from 'react';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { useEditorStore } from '../store/editorStore';

export default function AssetPanel() {
  const inputRef = useRef();
  // ✅ Correct
  const addElement = useEditorStore((s) => s.addElement);
  const elements = useEditorStore((s) => s.elements);

  const [busy, setBusy] = useState(false);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const url = await uploadToCloudinary(file);
      addElement({ type: 'image', attrs: { x: 100, y: 100, width: 300, height: 200, imageUrl: url } });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  console.log("Store state at import:", useEditorStore.getState());
  console.log("Store state at import:", useEditorStore.getState().elements);

  console.log(useEditorStore.getState());


  return (
    <div className="d-flex flex-column gap-2">
      <button className="btn btn-outline-primary" onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? 'Uploading...' : 'Upload image'}
      </button>
      <input type="file" accept="image/*" ref={inputRef} onChange={onUpload} hidden />

      <div className="d-grid gap-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            addElement({ type: 'rect', attrs: { x: 80, y: 80, width: 200, height: 120, fill: '#60A5FA', cornerRadius: 8 } });
            console.log("Added rect, current elements:", useEditorStore.getState().elements);
            console.log("Full store:", useEditorStore.getState());

          }}
        >
          Add rectangle
        </button>

        <button className="btn btn-outline-secondary" onClick={() => addElement({ type: 'circle', attrs: { x: 180, y: 180, radius: 80, fill: '#F472B6' } })}>Add circle</button>
        <button className="btn btn-outline-secondary" onClick={() => addElement({ type: 'text', attrs: { x: 100, y: 100, text: 'Double-click to edit', fontSize: 28, fill: '#111827' } })}>Add text</button>
      </div>
    </div>
  );
}
