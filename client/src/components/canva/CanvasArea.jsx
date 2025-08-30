// src/components/canva/CanvasArea.jsx
import React from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

const CanvasArea = ({ shapes, setShapes }) => {
  const handleDragEnd = (e, index) => {
    const newShapes = shapes.slice();
    newShapes[index] = {
      ...newShapes[index],
      x: e.target.x(),
      y: e.target.y(),
    };
    setShapes(newShapes);
  };

  return (
    <div className="canvas-container w-100 h-100 bg-white">
      <Stage width={window.innerWidth * 0.8} height={window.innerHeight - 80}>
        <Layer>
          {shapes.map((shape, i) =>
            shape.type === "rect" ? (
              <Rect
                key={i}
                {...shape}
                draggable
                onDragEnd={(e) => handleDragEnd(e, i)}
              />
            ) : (
              <Text
                key={i}
                {...shape}
                draggable
                onDragEnd={(e) => handleDragEnd(e, i)}
              />
            )
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasArea;
