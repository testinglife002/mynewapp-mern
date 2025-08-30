import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Star, Line, Text } from "react-konva";
import axios from "axios";
import Sidebar from "../components/canva/Sidebar";
import Toolbar from "../components/canva/Toolbars";
import LayersPanel from "../components/canva/LayersPanel";
import PropertiesPanel from "../components/canva/PropertiesPanel";
import { UploadedImage } from "../components/canva/UploadedImage";
import "./DesignPage.css";
import newRequest from "../utils/newRequest";

const URL = import.meta.env.VITE_BACKEND_URL;

const DesignPage = ({user}) => {
  console.log(user);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const stageRef = useRef();

  // History stacks
  // const undoStack = useRef([]);
  // const redoStack = useRef([]);

  // Autosave timer
  const autosaveTimeout = useRef(null);

  // Autosave every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => handleAutosave(), 5000);
    return () => clearInterval(interval);
  }, [elements]);

  const pushToUndo = (newElements) => {
    setUndoStack((prev) => [...prev, elements]);
    setRedoStack([]);
    setElements(newElements);
  };

  /** ==========================
   *  ADDING ELEMENTS
   ========================== **/
  const handleAddText = () => {
    pushToUndo([
      ...elements,
      {
        id: Date.now(),
        type: "text",
        text: "New Text",
        x: 50,
        y: 50,
        fontSize: 24,
        fill: "#000",
      },
    ]);
  };

  const handleAddShape = (shapeType) => {
    const shape = {
      id: Date.now(),
      type: shapeType,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: "#3498db",
      stroke: "#2980b9",
      strokeWidth: 2,
      radius: shapeType === "circle" ? 50 : undefined,
      numPoints: shapeType === "star" ? 5 : undefined,
    };
    pushToUndo([...elements, shape]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axios.post(`${URL}/api/designs/upload`, formData);
    pushToUndo([
      ...elements,
      {
        id: Date.now(),
        type: "image",
        src: data.url,
        x: 100,
        y: 100,
        width: 200,
        height: 200,
      },
    ]);
  };

  /** ==========================
   *  UNDO / REDO / AUTOSAVE
   ========================== **/
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack.pop();
    setRedoStack((prevRedo) => [...prevRedo, elements]);
    setElements(prev);
    setUndoStack([...undoStack]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack.pop();
    setUndoStack((prevUndo) => [...prevUndo, elements]);
    setElements(next);
    setRedoStack([...redoStack]);
  };

  const handleAutosave = async () => {
    try {
      const stage = stageRef.current;
      const dataURL = stage.toDataURL({ pixelRatio: 0.2 });

      await axios.post(`${URL}/api/designs/save`, {
        title: "Untitled Design",
        elements,
        userId: user?._id,
        thumbnail: dataURL,
      });
    } catch (error) {
      console.error("Autosave failed", error);
    }
  };

  /** =====================
   * Autosave
   ====================== */
  /* const triggerAutosave = (currentElements) => {
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
  }; */

  /** ==========================
   *  LOAD MULTIPLE DESIGNS
   ========================== **/
  const handleLoadDesigns = async () => {
    setLoadingDesigns(true);
    const { data } = await axios.get(`${URL}/api/designs`);
    setSavedDesigns(data);
    setLoadingDesigns(false);
  };

  const handleSelectDesign = (design) => {
    setElements(design.elements);
  };

  return (
    <div className="design-page">
      {/* Sidebar */}
      <Sidebar
        onAddText={handleAddText}
        onImageUpload={handleImageUpload}
        onUndo={handleUndo}
        onRedo={handleRedo}
         onSave={handleAutosave}
        // onSave={() => triggerAutosave(elements)}
        user={user}
        onLoadDesign={handleLoadDesigns}
        savedDesigns={savedDesigns}
        onSelectDesign={handleSelectDesign}
        loading={loadingDesigns}
      />

      {/* Toolbar */}
      <Toolbar onAddShape={handleAddShape} />

      {/* Canvas */}
      <div className="canvas-container">
        <Stage
          width={window.innerWidth - 80}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              setSelectedId(null);
              return;
            }
            setSelectedId(e.target.attrs.id);
          }}
        >
          <Layer>
            {elements.map((el, i) => {
              switch (el.type) {
                case "text":
                  return (
                    <Text
                      key={el.id}
                      id={el.id}
                      text={el.text}
                      x={el.x}
                      y={el.y}
                      fontSize={el.fontSize}
                      fill={el.fill}
                      draggable
                    />
                  );
                case "image":
                  return (
                    <UploadedImage
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={(newAttrs) => {
                        const updated = elements.slice();
                        updated[i] = newAttrs;
                        setElements(updated);
                      }}
                    />
                  );
                case "rect":
                  return (
                    <Rect key={el.id} {...el} draggable />
                  );
                case "circle":
                  return (
                    <Circle key={el.id} {...el} draggable />
                  );
                case "star":
                  return (
                    <Star key={el.id} {...el} draggable />
                  );
                case "line":
                  return (
                    <Line key={el.id} points={[el.x, el.y, el.x + 100, el.y]} stroke={el.stroke} strokeWidth={el.strokeWidth} draggable />
                  );
                default:
                  return null;
              }
            })}
          </Layer>
        </Stage>
      </div>

      {/* Properties Panel */}
      <PropertiesPanel
        elements={elements}
        selectedId={selectedId}
        setElements={setElements}
      />

      {/* Layers Panel */}
      <LayersPanel elements={elements} setElements={setElements} setSelectedId={setSelectedId} />
    </div>
  );
};

export default DesignPage;
