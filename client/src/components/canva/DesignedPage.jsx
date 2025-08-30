// // frontend/src/components/canva/DesignedPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle, Star, Line, Text, Image as KonvaImage } from "react-konva";
import useImage from "use-image";

import Sidebar from "./Sidebar";
import LayersPanel from "./LayersPanel";
import newRequest from "../../utils/newRequest";

const DesignedPage = ({ user, designId }) => {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // History stacks
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  // Autosave timer
  const autosaveTimeout = useRef(null);

  /** =====================
   * Helper: Update Elements + Push History
   ====================== */
  const updateElements = (newElements) => {
    // Push previous state to undo stack
    undoStack.current.push(elements.map(el => ({ ...el })));
    // Clear redo stack
    redoStack.current = [];
    setElements(newElements);
    triggerAutosave(newElements);
  };

  /** =====================
   * Undo
   ====================== */
  const handleUndo = () => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop();
    redoStack.current.push(elements.map(el => ({ ...el })));
    setElements(prev);
    triggerAutosave(prev);
  };

  /** =====================
   * Redo
   ====================== */
  const handleRedo = () => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop();
    undoStack.current.push(elements.map(el => ({ ...el })));
    setElements(next);
    triggerAutosave(next);
  };

  /** =====================
   * Autosave
   ====================== */
  const triggerAutosave = (currentElements) => {
    if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    autosaveTimeout.current = setTimeout(async () => {
      try {
        const payload = {
          userId: user,
          elements: currentElements,
        };
        await newRequest.put(`/designs/${designId}`, payload); // backend API
        console.log("Autosaved!");
      } catch (err) {
        console.error("Autosave failed", err);
      }
    }, 1000); // autosave 1s after last change
  };

  /** =====================
   * Element Change Handlers
   ====================== */
  const handleTransform = (id, updatedProps) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updatedProps } : el);
    updateElements(newElements);
  };

  const handleAddElement = (element) => {
    updateElements([...elements, element]);
  };

  const handleDeleteElement = (id) => {
    updateElements(elements.filter(el => el.id !== id));
  };

  /** =====================
   * Load initial design
   ====================== */
  useEffect(() => {
    const loadDesign = async () => {
      try {
        const res = await newRequest.get(`/designs/${designId}`);
        setElements(res.data.elements || []);
      } catch (err) {
        console.error("Failed to load design", err);
      }
    };
    loadDesign();
  }, [designId]);

  return (
    <div className="design-page" style={{ display: "flex" }}>
      <Sidebar
        onAddText={() => handleAddElement({ id: Date.now(), type: "text", text: "New Text", x: 50, y: 50, visible: true, locked: false })}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => triggerAutosave(elements)}
        elements={elements}
      />
      <Stage width={window.innerWidth - 250} height={window.innerHeight}>
        <Layer>
          {elements.map(el => {
            if (!el.visible) return null;
            switch (el.type) {
              case "rect":
                return <Rect key={el.id} {...el} draggable onDragEnd={e => handleTransform(el.id, { x: e.target.x(), y: e.target.y() })} />;
              case "circle":
                return <Circle key={el.id} {...el} draggable onDragEnd={e => handleTransform(el.id, { x: e.target.x(), y: e.target.y() })} />;
              case "text":
                return <Text key={el.id} {...el} draggable onDragEnd={e => handleTransform(el.id, { x: e.target.x(), y: e.target.y() })} />;
              case "image":
                return <KonvaImage key={el.id} {...el} draggable onDragEnd={e => handleTransform(el.id, { x: e.target.x(), y: e.target.y() })} />;
              default:
                return null;
            }
          })}
        </Layer>
      </Stage>
      <LayersPanel
        elements={elements}
        setElements={updateElements}
        setSelectedId={setSelectedId}
      />
    </div>
  );
};

export default DesignedPage;
