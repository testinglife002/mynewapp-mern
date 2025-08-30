// frontend/src/components/LayersPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle, Star, Line, Text, Image } from "react-konva";
import useImage from "use-image";
import "./LayersPanel.css";

const LayersPanel = ({ elements, setElements, setSelectedId }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...elements];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, removed);
    setElements(updated);
    setDraggedIndex(null);
  };

  const toggleVisibility = (id) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el
      )
    );
  };

  const toggleLock = (id) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id ? { ...el, locked: !el.locked } : el
      )
    );
  };

  return (
    <div className="layers-panel">
      <h6>Layers</h6>
      <div className="layers-list">
        {elements.map((el, index) => (
          <LayerItem
            key={el.id}
            element={el}
            index={index}
            onSelect={handleSelect}
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            isDragging={draggedIndex === index}
            toggleVisibility={() => toggleVisibility(el.id)}
            toggleLock={() => toggleLock(el.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LayersPanel;

/** =========================
 * Mini Layer Item Component
 ========================== **/
const LayerItem = ({ element, index, onSelect, onDragStart, onDragOver, onDrop, isDragging, toggleVisibility, toggleLock }) => {
  const canvasRef = useRef(null);
  const [img] = useImage(element.src || null);

  // Redraw thumbnail whenever element updates
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 40, 40);

    if (!element.visible) {
      ctx.fillStyle = "#ddd";
      ctx.fillRect(0, 0, 40, 40);
      return;
    }

    switch (element.type) {
      case "rect":
        ctx.save();
        ctx.translate(20, 20);
        ctx.rotate((element.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = element.fill || "#3498db";
        ctx.fillRect(-20, -20, 40, 40);
        if (element.stroke) {
          ctx.strokeStyle = element.stroke;
          ctx.lineWidth = element.strokeWidth || 2;
          ctx.strokeRect(-20, -20, 40, 40);
        }
        ctx.restore();
        break;
      case "circle":
        ctx.save();
        ctx.translate(20, 20);
        ctx.rotate((element.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = element.fill || "#3498db";
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        if (element.stroke) {
          ctx.strokeStyle = element.stroke;
          ctx.lineWidth = element.strokeWidth || 2;
          ctx.stroke();
        }
        ctx.restore();
        break;
      case "star":
        ctx.save();
        ctx.translate(20, 20);
        ctx.rotate((element.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = element.fill || "#f1c40f";
        drawStar(ctx, 0, 0, 5, 15, 7);
        ctx.fill();
        ctx.restore();
        break;
      case "text":
        ctx.save();
        ctx.translate(0, 20);
        ctx.rotate((element.rotation || 0) * (Math.PI / 180));
        ctx.fillStyle = element.fill || "#000";
        ctx.font = `${Math.min(element.fontSize || 16, 16)}px Arial`;
        ctx.fillText(element.text || "Text", 0, 0);
        ctx.restore();
        break;
      case "image":
        if (img) {
          ctx.save();
          ctx.translate(20, 20);
          ctx.rotate((element.rotation || 0) * (Math.PI / 180));
          ctx.drawImage(img, -20, -20, 40, 40);
          ctx.restore();
        }
        break;
      case "line":
        ctx.save();
        ctx.translate(0, 20);
        ctx.rotate((element.rotation || 0) * (Math.PI / 180));
        ctx.strokeStyle = element.stroke || "#000";
        ctx.lineWidth = element.strokeWidth || 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.restore();
        break;
      default:
        break;
    }
  }, [element, img]);

  return (
    <div
      className={`layer-item ${isDragging ? "dragging" : ""} ${
        element.locked ? "locked" : ""
      }`}
      draggable={!element.locked}
      onClick={() => onSelect(element.id)}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <canvas ref={canvasRef} width={40} height={40} className="layer-thumbnail" />
      <span className="layer-label">{element.type.toUpperCase()}</span>
      <div className="layer-buttons">
        <button onClick={(e) => { e.stopPropagation(); toggleVisibility(); }}>
          {element.visible ? "👁️" : "🚫"}
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleLock(); }}>
          {element.locked ? "🔒" : "🔓"}
        </button>
      </div>
    </div>
  );
};

/** =========================
 * Helper to draw star in canvas
 ========================== **/
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

