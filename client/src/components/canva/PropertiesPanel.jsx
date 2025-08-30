// frontend/src/components/PropertiesPanel.jsx
import React from "react";
import "./PropertiesPanel.css";

const PropertiesPanel = ({ elements, selectedId, setElements }) => {
  const selectedElement = elements.find((el) => el.id === selectedId);

  const updateProperty = (key, value) => {
    const updated = elements.map((el) =>
      el.id === selectedId ? { ...el, [key]: value } : el
    );
    setElements(updated);
  };

  if (!selectedElement) return null;

  return (
    <div className="properties-panel">
      <h6>Properties</h6>
      {selectedElement.type === "text" && (
        <>
          <label>Font Size</label>
          <input
            type="number"
            value={selectedElement.fontSize}
            onChange={(e) => updateProperty("fontSize", +e.target.value)}
          />

          <label>Color</label>
          <input
            type="color"
            value={selectedElement.fill}
            onChange={(e) => updateProperty("fill", e.target.value)}
          />
        </>
      )}
      {selectedElement.type !== "text" && (
        <>
          <label>Fill</label>
          <input
            type="color"
            value={selectedElement.fill}
            onChange={(e) => updateProperty("fill", e.target.value)}
          />

          <label>Stroke</label>
          <input
            type="color"
            value={selectedElement.stroke}
            onChange={(e) => updateProperty("stroke", e.target.value)}
          />

          <label>Stroke Width</label>
          <input
            type="number"
            value={selectedElement.strokeWidth}
            onChange={(e) => updateProperty("strokeWidth", +e.target.value)}
          />
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;
