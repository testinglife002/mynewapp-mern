import React, { useEffect, useState } from 'react';

import { buildCategoryTree } from './buildCategoryTree';
import CategoryNode from './CategoryNode';
import CategoryNodeAlt from './CategoryNodeAlt';
import newRequest from '../../utils/newRequest';

const CategoryTreeViewAlt = () => {
  const [categories, setCategories] = useState([]);
  const [dragged, setDragged] = useState(null);

  const fetchCategories = async () => {
    const res = await newRequest.get('/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (parentId) => {
    const name = prompt('Enter category name');
    if (name) {
      await newRequest.post('/categories', { name, parentId });
      fetchCategories();
    }
  };

  const handleEditCancel = async (id, newName) => {
    await newRequest.put(`/categories/${id}`, { name: newName });
    fetchCategories();
  };

  const handleDeleteCancel = async (id) => {
    if (window.confirm('Delete this category and all subcategories?')) {
      await newRequest.delete(`/categories/${id}`);
      fetchCategories();
    }
  };

  const handleEdit = async (slug, newName) => {
    await newRequest.put(`/categories/${slug}`, { name: newName });
    fetchCategories();
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Delete this category and all subcategories?')) {
        await newRequest.delete(`/categories/${slug}`);
        fetchCategories();
    }
  };




  const handleDragStart = (e, cat) => {
    setDragged(cat);
  };

  const handleDrop = async (e, targetCat) => {
    if (!dragged) return;
    if (dragged._id === targetCat._id || dragged.parentId === targetCat._id) return;

    // Only allow same-level reordering or move to valid parent within depth
   /* const newLevel = targetCat.level + 1;
    if (newLevel > 2) {
      alert('Maximum depth is 3 levels.');
      return;
    }

    await newRequest.put(`/categories/${dragged._id}`, {
      parentId: targetCat._id,
    }); */

    // Optional: prevent circular nesting (grandchild > parent)
    let current = targetCat;
    while (current?.parentId) {
        if (current.parentId === dragged._id) {
        alert("Cannot move a category inside one of its children.");
        return;
        }
        current = categories.find(cat => cat._id === current.parentId);
    }

    const newLevel = targetCat.level + 1;
    if (newLevel > 2) {
        alert("Maximum depth is 3 levels.");
        return;
    }

    await newRequest.put(`/categories/${dragged.slug}`, {
        parentId: targetCat._id,
    });

    fetchCategories();
    setDragged(null);

  };

  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="p-4 bg-light rounded shadow">
      <h4>Category Tree</h4>
      <button className="btn btn-sm btn-primary mb-3" onClick={() => handleAdd(null)}>+ Add Root</button>
      {categoryTree.map((cat) => (
        <CategoryNodeAlt
          key={cat._id}
          category={cat}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          maxLevel={2}
        />
      ))}
    </div>
  );
};

export default CategoryTreeViewAlt;
