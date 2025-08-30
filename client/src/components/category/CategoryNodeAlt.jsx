// CategoryNodeAlt.jsx
import React from 'react';
import './CategoryNodeAlt.css';

const CategoryNodeAlt = ({
  category,
  onAdd,
  onEdit,
  onDelete,
  onDragStart,
  onDrop,
  maxLevel,
}) => {
  const level = category.level || 0;

  return (
    <div
      style={{ marginLeft: level * 20 }}
      draggable
      onDragStart={(e) => onDragStart(e, category)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, category)}
      className="mb-2 p-2 bg-white border rounded"
    >
      <div className="d-flex justify-content-between align-items-center">
        <span>{category.name}</span>
        <div>
          {level < maxLevel && (
            <button onClick={() => onAdd(category._id)} className="btn btn-sm btn-success me-1">+</button>
          )}
          <button onClick={() => {
            const newName = prompt('Rename category', category.name);
            if (newName) onEdit(category.slug, newName);
          }} className="btn btn-sm btn-warning me-1">Edit</button>
          <button onClick={() => onDelete(category.slug)} className="btn btn-sm btn-danger">Delete</button>
        </div>
      </div>

      {category.children && category.children.length > 0 && (
        <div>
          {category.children.map((child) => (
            <CategoryNodeAlt
              key={child._id}
              category={child}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDrop={onDrop}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNodeAlt;
