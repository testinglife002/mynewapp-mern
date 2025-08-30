// src/appcomponents/BlocksRenderer.jsx
import React from "react";
import Content from "./Content";

function BlocksRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-muted">No content</p>;
  }

  return (
    <div className="editorjs-render">
      {blocks.map((block, i) => (
        <div key={block.id || i} className="mb-2">
          <Content block={block} />
        </div>
      ))}
    </div>
  );
}

export default BlocksRenderer;
