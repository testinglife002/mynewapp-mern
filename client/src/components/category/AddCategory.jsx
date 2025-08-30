// src/pages/dashboard/AddCategory.jsx

/*
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/categories", form);
      alert("Category added successfully!");
      navigate("/dashboard/categories");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">Add Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button className="btn btn-primary">Add Category</button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AddCategory;
*/

import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/categories", {
        name,
        slug,
        parentId: parentId || null,
        description
      });
      navigate("/dashboard/categories");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await newRequest.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container py-5">
      <h3 className="mb-4">Add Category</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
            setName(e.target.value);
            setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label>Slug</label>
          <input
            className="form-control"
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <select className="form-control" value={parentId} onChange={(e) => setParentId(e.target.value)}>
            <option value="">Select Parent Category</option>
            {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
                {cat.name}
            </option>
            ))}
        </select>
        <br/>
        <div className="text-center" >
            <button className=" btn btn-primary">Add </button>
            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </form>
    
    </div>
  );
};

export default AddCategory;


