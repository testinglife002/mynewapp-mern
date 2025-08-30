// src/pages/post/AllBlogPosts.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Badge, Button, Spinner, Modal, Form, ButtonGroup, Table, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MDEditor, { commands } from "@uiw/react-md-editor";
 import JoditEditor from "jodit-react";
import EditorContextProvider, { EditorContext } from "../../apps/notesapp/appcomponents/EditorContext.jsx";


const AllBlogPosts = ({user}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editing
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    trending: "no",
    description: "",
    content: "",
    blocks: {},
    status: "published",
    scheduledDate: "",
    category: "",
    subcategory: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");

  const [text, setText] = useState("");
  const editor = useRef();
  const config = {
      readonly : false
  }

  const [view, setView] = useState("table"); // table | grid

  const navigate = useNavigate();

  // Editors
  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(false);

  const joditRef = useRef();
  const joditConfig = { readonly: false };

  useEffect(() => {
    if (editingPost && document.getElementById("editorjs-edit")) {
      const initialData = editingPost.blocks?.length
        ? { blocks: editingPost.blocks }
        : { blocks: [] };

      initEditor("editorjs-edit", initialData);
    }
  }, [editingPost, initEditor]);



  

  /* useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []); */

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts", err);
      // toast.error("Failed to load posts");
      console.log("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      // toast.success("Post deleted");
      console.log("Post deleted");
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      // toast.error("Failed to delete post");
      console.log("Failed to delete post");
    }
  };

  // Open Edit Modal
  const handleEditOpen = (post) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      trending: post.trending,
      description: post.description,
      content: post.content,
      blocks: post.blocks,
      status: post.status,
      scheduledDate: post.scheduledDate ? post.scheduledDate.slice(0, 10) : "",
      category: post.categoryId,
      subcategory: post.subcategoryId,
    });
    setTags(post.tags || []);
    setHashtags(post.hashtags || []);
    setText(post.content || "");
    setSubcategories(categories.filter((c) => c.parentId === post.categoryId));
  };

  // Close Edit Modal
  const handleEditClose = () => {
    setEditingPost(null);
    setEditForm({
      title: "",
      trending: "no",
      description: "",
      content: "",
      blocks: {},
      status: "published",
      scheduledDate: "",
      category: "",
      subcategory: "",
    });
    setTags([]);
    setHashtags([]);
    setText("");
  };

  // Update
  const handleUpdate = async () => {
    let blocksData;
    try {
      blocksData = await editorInstanceRef.current?.save?.();
    } catch (err) {
      console.error("EditorJS failed", err);
    }

    try {
      await axios.put(`/api/posts/${editingPost._id}`, {
        ...editForm,
        content: text,
        // blocks: blocksData?.blocks || [],
        blocks: blocksData.blocks,  // ✅ only save array
        tags,
        hashtags,
        userId: user?._id,
        author: user?.username,
      });
      fetchPosts();
      handleEditClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Tag + Hashtag helpers
  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };
  const handleTagRemove = (tag) => setTags(tags.filter((t) => t !== tag));
  const handleHashtagAdd = () => {
    const trimmed = hashtagInput.trim();
    if (trimmed && !hashtags.includes(trimmed)) {
      setHashtags([...hashtags, trimmed]);
      setHashtagInput("");
    }
  };
  const handleHashtagRemove = (tag) =>
    setHashtags(hashtags.filter((t) => t !== tag));

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );

  return (
        <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>All Blog Posts</h3>
          <ButtonGroup>
            <Button
              variant={view === "table" ? "primary" : "outline-primary"}
              onClick={() => setView("table")}
            >
              Table View
            </Button>
            <Button
              variant={view === "grid" ? "primary" : "outline-primary"}
              onClick={() => setView("grid")}
            >
              Grid View
            </Button>
          </ButtonGroup>
        </div>


        {view === "table" ? (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Tags</th>
                <th>Hashtags</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.categoryTitle}</td>
                  <td>{post.subcategoryTitle || "-"}</td>
                  <td>
                    {post.tags?.map((t) => (
                      <Badge bg="secondary" className="me-1" key={t}>
                        {t}
                      </Badge>
                    ))}
                  </td>
                  <td>
                    {post.hashtags?.map((h) => (
                      <Badge bg="info" className="me-1" key={h}>
                        #{h}
                      </Badge>
                    ))}
                  </td>
                  <td>{post.status}</td>
                  <td>
                    {/* Actions */}
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/posts/${post._id}`)}
                      >
                        Read More
                      </Button>
                      <div>
                      <Button size="sm" onClick={() => navigate(`/posts/${post._id}`)}>Read</Button>{" "}
                      <Button variant="warning" size="sm" onClick={() => handleEditOpen(post)}>Edit</Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(post._id)}>Delete</Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="row">
            {posts.map((post) => (
              <div className="col-md-4 mb-3" key={post._id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {post.categoryTitle} {post.subcategoryTitle && `> ${post.subcategoryTitle}`}
                    </Card.Subtitle>
                    <Card.Text>
                      {post.description?.slice(0, 100)}...
                    </Card.Text>
                    <div className="mb-2">
                      {post.tags?.map((t) => (
                        <Badge bg="secondary" className="me-1" key={t}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mb-2">
                      {post.hashtags?.map((h) => (
                        <Badge bg="info" className="me-1" key={h}>
                          #{h}
                        </Badge>
                      ))}
                    </div>
                    {/* Actions */}
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/posts/${post._id}`)}
                      >
                        Read More
                      </Button>
                      <div>
                      <Button size="sm" onClick={() => navigate(`/posts/${post._id}`)}>Read</Button>{" "}
                      <Button variant="warning" size="sm" onClick={() => handleEditOpen(post)}>Edit</Button>{" "}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(post._id)}>Delete</Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
          
        {/* Edit Modal */}
        {/* Edit Modal */}
        <Modal show={!!editingPost} onHide={handleEditClose} size="lg" fullscreen>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <MDEditor
                  value={editForm.description}
                  onChange={(val) =>
                    setEditForm({ ...editForm, description: val })
                  }
                  commands={[commands.bold, commands.italic, commands.link]}
                />
              </Form.Group>

              {/* Category / Subcategory */}
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={editForm.category}
                      onChange={(e) => {
                        setEditForm({
                          ...editForm,
                          category: e.target.value,
                          subcategory: "",
                        });
                        setSubcategories(
                          categories.filter((c) => c.parentId === e.target.value)
                        );
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories
                        .filter((c) => !c.parentId)
                        .map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Subcategory</Form.Label>
                    <Form.Select
                      value={editForm.subcategory}
                      onChange={(e) =>
                        setEditForm({ ...editForm, subcategory: e.target.value })
                      }
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Tags */}
              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <Button onClick={handleTagAdd}>Add</Button>
                </InputGroup>
                <div className="mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      bg="secondary"
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTagRemove(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </Form.Group>

              {/* Hashtags */}
              <Form.Group className="mb-3">
                <Form.Label>Hashtags</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleHashtagAdd();
                      }
                    }}
                  />
                  <Button onClick={handleHashtagAdd}>Add</Button>
                </InputGroup>
                <div className="mt-2">
                  {hashtags.map((tag) => (
                    <Badge
                      key={tag}
                      bg="info"
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleHashtagRemove(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              </Form.Group>

              {/* Blocks Editor */}
              <div className="mb-3">
                <label><strong>Blocks Editor:</strong></label>
                <div id="editorjs-edit"></div>
              </div>

              {/* JoditEditor for content */}
              <div className="mb-3">
                <label><strong>Content</strong></label>
                <JoditEditor
                  ref={joditRef}
                  value={text}
                  config={joditConfig}
                  onBlur={(newText) => setText(newText)}
                />
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                if (editorInstanceRef.current) {
                  editorInstanceRef.current.destroy();
                  editorInstanceRef.current = null;
                }
                handleEditClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>


        </div>
    );
};

export default AllBlogPosts