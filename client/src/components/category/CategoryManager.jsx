import React, { useEffect, useState } from 'react';
import newRequest from '../../utils/newRequest';
import { Button, Form, Modal, Table } from 'react-bootstrap';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editSlug, setEditSlug] = useState(null);
  const [formData, setFormData] = useState({ name: '', parentId: '' });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await newRequest.get('/categories');
      setCategories(res.data);
      setParentOptions(res.data.filter(cat => !cat.parentId));
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for add/edit
  const handleShow = (category = null) => {
    if (category) {
      setEditId(category._id);
      setEditSlug(category.slug);
      setFormData({ name: category.name, parentId: category.parentId || '', description: category.description });
    } else {
      setEditId(null);
      setFormData({ name: '', parentId: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // if (editId) {
      if (editSlug) {
        // await newRequest.put(`/categories/${editId}`, formData);
        await newRequest.put(`/categories/${editSlug}`, formData);
      } else {
        await newRequest.post('/categories', formData);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category', err);
      alert('Error saving category');
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Delete this category?')) {
      try {
        await newRequest.delete(`/categories/${slug}`);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category', err);
        alert('Error deleting category');
      }
    }
  };

  const handleDeleteCancel = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await newRequest.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Failed to delete category', err);
        alert('Error deleting category');
      }
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>📂 Category Manager</h4>
        <Button onClick={() => handleShow()}>+ Add Category</Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>{categories.find(p => p._id === cat.parentId)?.name || '—'}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShow(cat)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(cat._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Category' : 'Add Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
                as="textarea"
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            </Form.Group>

            <Form.Group>
              <Form.Label>Parent Category</Form.Label>
              <Form.Select
                value={formData.parentId}
                onChange={e => setFormData({ ...formData, parentId: e.target.value })}
              >
                <option value="">None (Top Level)</option>
                {parentOptions.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{editId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
