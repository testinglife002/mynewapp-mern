// src/pages/dashboard/EditCategory.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const EditCategory = () => {
  const { slug } = useParams();
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await newRequest.get(`/categories/${slug}`);
        setForm({
          name: res.data.name,
          description: res.data.description,
        });
      } catch (err) {
        console.error("Failed to fetch category", err);
        setError("Category not found");
      }
    };

    fetchCategory();
  }, [slug]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await newRequest.put(`/categories/${slug}`, form);
      alert("Category updated successfully!");
      navigate("/dashboard/categories");
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data || "Server error");
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4">Edit Category</h3>
      <form onSubmit={handleUpdate}>
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
        <button className="btn btn-primary">Update Category</button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default EditCategory;
