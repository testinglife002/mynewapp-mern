import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryNode from './CategoryNode';
import AddCategory from './AddCategoryUI';
import AddCategoryUI from './AddCategoryUI';

const CategoryTreeView = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get('/api/categories');
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h4>Category Tree</h4>
      <AddCategoryUI onCategoryAdded={fetchCategories} />
      {/*<div>
        {categories.map(cat => (
          <CategoryNode key={cat._id} node={cat} refresh={fetchCategories} />
        ))}
      </div>*/}
      <div>
        {categories.map(cat => (
          <CategoryNode key={cat.slug} node={cat} refresh={fetchCategories} />
        ))}
      </div>
    </div>
  );
};

export default CategoryTreeView;
