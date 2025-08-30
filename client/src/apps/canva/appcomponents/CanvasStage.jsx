import { Stage, Layer, Rect, Circle, Text, Image as KImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useEditorStore } from '../store/editorStore';
import { useEffect, useMemo, useRef, useState } from 'react';


/*
function URLImage({ el, isSelected, onSelect, onChange }) {
  const [img] = useImage(el.attrs.imageUrl, 'anonymous');
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) trRef.current?.nodes([shapeRef.current]);
  }, [isSelected]);

  return (
    <>
      <KImage
        image={img}
        ref={shapeRef}
        {...el.attrs}
        draggable={!el.locked}
        opacity={el.hidden ? 0.3 : 1}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({ width: Math.max(5, node.width() * scaleX), height: Math.max(5, node.height() * scaleY) });
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={!el.locked} />}
    </>
  );
}
*/

function URLImage({ el, isSelected, onSelect, onChange }) {
  const [img] = useImage(el.attrs.imageUrl, 'anonymous');
  const shapeRef = useRef();
  const trRef = useRef();

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
        ref={shapeRef}
        {...el.attrs}
        draggable={!el.locked}
        opacity={el.hidden ? 0.3 : 1}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) =>
          onChange({ x: e.target.x(), y: e.target.y() })
        }
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer ref={trRef} rotateEnabled={!el.locked} />
      )}
    </>
  );
}


/*
function GenericShape({ Comp, el, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => { if (isSelected) trRef.current?.nodes([shapeRef.current]); }, [isSelected]);

  return (
    <>
      <Comp
        ref={shapeRef}
        {...el.attrs}
        draggable={!el.locked}
        opacity={el.hidden ? 0.3 : 1}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          if (el.type === 'rect') {
            onChange({ width: Math.max(5, node.width() * scaleX), height: Math.max(5, node.height() * scaleY) });
          } else if (el.type === 'circle') {
            onChange({ radius: Math.max(5, node.radius() * scaleX) });
          } else if (el.type === 'text') {
            // text transform handling if needed
          }
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={!el.locked} enabledAnchors={el.type === 'circle' ? ['top-left','top-right','bottom-left','bottom-right'] : undefined} />}
    </>
  );
}
*/


function GenericShape({ Comp, el, isSelected, onSelect, onChange }) {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Comp
        ref={shapeRef}
        {...el.attrs}
        draggable={!el.locked}
        opacity={el.hidden ? 0.3 : 1}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) =>
          onChange({ x: e.target.x(), y: e.target.y() })
        }
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          if (el.type === 'rect') {
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          } else if (el.type === 'circle') {
            onChange({
              x: node.x(),
              y: node.y(),
              radius: Math.max(5, node.radius() * scaleX),
              rotation: node.rotation(),
            });
          } else if (el.type === 'text') {
            onChange({
              x: node.x(),
              y: node.y(),
              fontSize: Math.max(5, node.fontSize() * scaleX),
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={!el.locked}
          enabledAnchors={
            el.type === 'circle'
              ? ['top-left', 'top-right', 'bottom-left', 'bottom-right']
              : undefined
          }
        />
      )}
    </>
  );
}


export default function CanvasStage({ stageRef }) {
  const { width, height, background, elements, selectedIds, select, updateElement, removeSelected } = useEditorStore();
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const containerRef = useRef();

  useEffect(() => {
    const onResize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setDims({ w: rect.width, h: rect.height });
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleKey = (e) => {
    if (e.key === 'Delete') removeSelected();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') { e.preventDefault(); select(elements.map((e) => e.id)); }
  };

  const scaled = useMemo(() => {
    const margin = 40;
    const scale = Math.min((dims.w - margin) / width, (dims.h - margin) / height) || 1;
    const x = (dims.w - width * scale) / 2;
    const y = (dims.h - height * scale) / 2;
    return { scale, x, y };
  }, [dims, width, height]);

  return (
    <div ref={containerRef} className="w-100 h-100 position-relative" onKeyDown={handleKey} tabIndex={0}>
      <Stage width={dims.w} height={dims.h} ref={stageRef} onMouseDown={(e) => { const clickedOnEmpty = e.target === e.target.getStage(); if (clickedOnEmpty) select([]); }}>
        <Layer scaleX={scaled.scale} scaleY={scaled.scale} x={scaled.x} y={scaled.y}>
          <Rect x={0} y={0} width={width} height={height} fill={background} listening={false} />
          {elements?.map((el) => {
            const isSelected = selectedIds.includes(el.id);
            const common = { key: el.id, el, isSelected, onSelect: () => select([el.id]), onChange: (patch) => updateElement(el.id, patch) };
            if (el.hidden) return null;
            if (el.type === 'rect') return <GenericShape Comp={Rect} {...common} />;
            if (el.type === 'circle') return <GenericShape Comp={Circle} {...common} />;
            if (el.type === 'text') return <GenericShape Comp={Text} {...common} />;
            if (el.type === 'image') return <URLImage {...common} />;
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
