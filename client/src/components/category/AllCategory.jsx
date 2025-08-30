// src/pages/dashboard/AllCategory.jsx
import { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";
import { Link } from "react-router-dom";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await newRequest.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await newRequest.delete(`/categories/${slug}`);
        fetchCategories(); // refresh list
      } catch (err) {
        console.error("Failed to delete category", err);
        alert("Delete failed!");
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container py-5">
      <h3 className="mb-4">All Categories</h3>
      <Link to="/dashboard/add-category" className="btn btn-success mb-3">+ Add New</Link>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>{cat.slug}</td>
              <td>
                <Link to={`/dashboard/edit-category/${cat.slug}`} className="btn btn-sm btn-info me-2">Edit</Link>
                <button onClick={() => handleDelete(cat.slug)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllCategory;
