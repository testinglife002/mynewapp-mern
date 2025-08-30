// src/components/category/AddCategory.jsx
import { useState } from 'react';
import newRequest from '../../utils/newRequest';

const AddCategoryUI = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post('/categories', { name, parentId: parentId || null });
      alert('Category added!');
      setName('');
      setParentId('');
      if (onCategoryAdded) {
        onCategoryAdded(res.data); // Refresh tree or category list
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input
        type="text"
        value={name}
        placeholder="Category Name"
        onChange={(e) => setName(e.target.value)}
        required
        className="form-control mb-2"
      />
      <input
        type="text"
        value={parentId}
        placeholder="Parent Category ID (optional)"
        onChange={(e) => setParentId(e.target.value)}
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-success w-100">Add Category</button>
    </form>
  );
};

export default AddCategoryUI;
