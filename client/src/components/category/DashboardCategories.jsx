// src/pages/dashboard/DashboardCategories.jsx
import { useEffect, useState } from 'react';
import newRequest from '../../utils/newRequest';
import AddCategory from './AddCategoryUI';
import AddCategoryUI from './AddCategoryUI';


const DashboardCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await newRequest.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-3">Manage Categories</h3>
      <AddCategoryUI onCategoryAdded={fetchCategories} />
      
      <ul>
        {categories.map(cat => (
          <li key={cat._id}>{cat.name} {cat.parentId && `(Parent: ${cat.parentId})`}</li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardCategories;
