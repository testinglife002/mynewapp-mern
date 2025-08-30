// DesignPageAlt.jsx
import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Text as KText, Image as KImage, Transformer } from "react-konva";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// helper to load image from dataURL
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });

const CanvasImage = ({ shape, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img, setImg] = useState(null);

  useEffect(() => {
    let mounted = true;
    loadImage(shape.src).then((loaded) => {
      if (mounted) setImg(loaded);
    }).catch(() => {});
    return () => (mounted = false);
  }, [shape.src]);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KImage
        image={img}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        id={shape.id}
        onDragEnd={(e) => {
          onChange({ ...shape, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          // reset scale to 1 and update width/height
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

const CanvasText = ({ shape, isSelected, onSelect, onChange, onDoubleClickEdit }) => {
  const textRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KText
        ref={textRef}
        text={shape.text}
        x={shape.x}
        y={shape.y}
        fontSize={shape.fontSize}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        id={shape.id}
        onDragEnd={(e) => onChange({ ...shape, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          node.scaleX(1);
          onChange({
            ...shape,
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(8, node.fontSize() * scaleX),
          });
        }}
        onDblClick={onDoubleClickEdit}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default function DesignPageAlt() {
  const stageRef = useRef();
  const [shapes, setShapes] = useState([]); // store shapes: { id, type:'image'|'text', ... }
  const [selectedId, setSelectedId] = useState(null);
  const containerRef = useRef();

  // add text
  const addText = () => {
    const t = {
      id: uuidv4(),
      type: "text",
      text: "Double-click to edit",
      x: 50,
      y: 50,
      fontSize: 24,
    };
    setShapes((s) => [...s, t]);
    setSelectedId(t.id);
  };

  // handle image upload (file to dataURL)
  const handleImageUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const imgShape = {
        id: uuidv4(),
        type: "image",
        src: dataUrl,
        x: 60,
        y: 60,
        width: 300,
        height: 200,
      };
      setShapes((s) => [...s, imgShape]);
      setSelectedId(imgShape.id);
    };
    reader.readAsDataURL(file);
  };

  // export to PNG
  const exportPNG = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // save design JSON to backend
  const saveDesign = async () => {
    try {
      const json = { shapes };
      // optionally generate thumbnail
      const thumbnail = stageRef.current.toDataURL({ pixelRatio: 0.5 });
      await axios.post("/api/designs", { title: "Untitled", json, thumbnail });
      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // double click to edit text (create textarea overlay)
  const editTextInline = (shape) => {
    // compute absolute position for textarea
    const stage = stageRef.current;
    const absPos = stage.getAbsolutePosition();
    const scale = stage.scaleX();
    // find node position
    const node = stage.findOne(`#${shape.id}`);
    const { x: nodeX, y: nodeY } = node.getAbsolutePosition();
    const areaPosition = {
      x: nodeX,
      y: nodeY,
    };

    // create textarea
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = shape.text;
    textarea.style.position = "absolute";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.fontSize = `${shape.fontSize}px`;
    textarea.style.border = "1px solid #ddd";
    textarea.style.padding = "4px";
    textarea.style.margin = "0";
    textarea.style.background = "white";
    textarea.focus();

    const remove = () => {
      document.body.removeChild(textarea);
    };

    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        // update text
        setShapes((list) => list.map((it) => (it.id === shape.id ? { ...it, text: textarea.value } : it)));
        remove();
      } else if (e.key === "Escape") {
        remove();
      }
    });
  };

  return (
    <div className="container-fluid p-0" ref={containerRef}>
      <div className="d-flex align-items-center p-2 border-bottom">
        <button className="btn btn-sm btn-primary me-2" onClick={addText}>Add Text</button>
        <label className="btn btn-sm btn-outline-secondary me-2">
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
          />
        </label>
        <button className="btn btn-sm btn-outline-success me-2" onClick={exportPNG}>Export PNG</button>
        <button className="btn btn-sm btn-outline-primary" onClick={saveDesign}>Save</button>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>
        <div style={{ width: 220, borderRight: "1px solid #eee", padding: 8 }}>
          {/* left sidebar: layers / tools (stub) */}
          <h6>Layers</h6>
          <ul className="list-unstyled">
            {shapes.map((s) => (
              <li key={s.id} className={s.id === selectedId ? "fw-bold" : ""} onClick={() => setSelectedId(s.id)}>
                {s.type} — {s.id.slice(0, 6)}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1, position: "relative", background: "#f5f5f5" }}>
          <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: 1000, height: 700, background: "white", boxShadow: "0 0 0 1px #ddd" }}>
              <Stage
                width={1000}
                height={700}
                ref={stageRef}
                onMouseDown={(e) => {
                  // deselect when clicked on empty area
                  if (e.target === e.target.getStage()) {
                    setSelectedId(null);
                  }
                }}
              >
                <Layer>
                  {shapes.map((s) =>
                    s.type === "image" ? (
                      <CanvasImage
                        key={s.id}
                        shape={s}
                        isSelected={s.id === selectedId}
                        onSelect={() => setSelectedId(s.id)}
                        onChange={(newAttrs) => setShapes((old) => old.map((o) => (o.id === newAttrs.id ? newAttrs : o)))}
                      />
                    ) : (
                      <CanvasText
                        key={s.id}
                        shape={s}
                        isSelected={s.id === selectedId}
                        onSelect={() => setSelectedId(s.id)}
                        onChange={(newAttrs) => setShapes((old) => old.map((o) => (o.id === newAttrs.id ? newAttrs : o)))}
                        onDoubleClickEdit={() => {
                          const shape = shapes.find((x) => x.id === selectedId);
                          if (shape) editTextInline(shape);
                        }}
                      />
                    )
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        <div style={{ width: 280, borderLeft: "1px solid #eee", padding: 8 }}>
          {/* properties panel */}
          <h6>Properties</h6>
          {selectedId ? (
            (() => {
              const s = shapes.find((x) => x.id === selectedId);
              if (!s) return <div>Selected not found</div>;
              if (s.type === "text") {
                return (
                  <>
                    <div className="mb-2">
                      <label className="form-label">Text</label>
                      <input
                        className="form-control"
                        value={s.text}
                        onChange={(e) => setShapes((list) => list.map((it) => (it.id === s.id ? { ...it, text: e.target.value } : it)))}
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Font size</label>
                      <input
                        type="number"
                        className="form-control"
                        value={s.fontSize}
                        onChange={(e) => setShapes((list) => list.map((it) => (it.id === s.id ? { ...it, fontSize: +e.target.value } : it)))}
                      />
                    </div>
                  </>
                );
              } else {
                return (
                  <>
                    <div>Image (w: {Math.round(s.width)} x h: {Math.round(s.height)})</div>
                  </>
                );
              }
            })()
          ) : (
            <div>No selection</div>
          )}
        </div>
      </div>
    </div>
  );
}
