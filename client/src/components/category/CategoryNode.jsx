import React, { useState } from 'react';
import axios from 'axios';

const CategoryNode = ({ node, depth = 0, refresh }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.name);

  const handleRenameCancel = async () => {
    await axios.put(`/api/categories/${node._id}`, { name });
    setEditing(false);
    refresh();
  };

  const handleDeleteCancel = async () => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`/api/categories/${node._id}`);
      refresh();
    }
  };

  const handleRename = async () => {
    await axios.put(`/api/categories/${node.slug}`, { name });
    setEditing(false);
    refresh();
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`/api/categories/${node.slug}`);
      refresh();
    }
  };

  const handleAddChild = async () => {
    const childName = prompt('New subcategory name');
    if (childName && depth < 2) {
      await axios.post('/api/categories', { name: childName, parentId: node._id });
      refresh();
    }
  };

  return (
    <div style={{ paddingLeft: depth * 20 + 'px' }} className="d-flex align-items-center gap-2 my-1">
      {editing ? (
        <>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={handleRename}
            autoFocus
          />
        </>
      ) : (
        <span onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
          📁 {node.name}
        </span>
      )}

      <button className="btn btn-sm btn-outline-secondary" onClick={handleAddChild} disabled={depth >= 2}>
        ➕
      </button>
      <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
        🗑
      </button>

      {/* Render children 
      {node.children && node.children.map(child => (
        <CategoryNode key={child._id} node={child} depth={depth + 1} refresh={refresh} />
      ))}
      */}

      {/* Render children recursively */}
      {node.children && node.children.map(child => (
        <CategoryNode key={child.slug} node={child} depth={depth + 1} refresh={refresh} />
      ))}

    </div>
  );
};

export default CategoryNode;
