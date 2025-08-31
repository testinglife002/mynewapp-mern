// src/pages/post/AddBlogPost.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Button, Form, InputGroup, Badge } from "react-bootstrap";
import MDEditor, { commands } from "@uiw/react-md-editor";
import JoditEditor from "jodit-react";
import EditorContextProvider, { EditorContext } from "../../apps/notesapp/appcomponents/EditorContext.jsx";

const AddBlogPost = ({ user }) => {
  const [form, setForm] = useState({
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
  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(false);

  const config = { readonly: false };

  useEffect(() => {
    if (!editorRef.current && document.getElementById("editorjs")) {
      initEditor();
      editorRef.current = true;
    }
  }, [initEditor]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        const cats = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(cats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);


  // ✅ Handle category change (filter children as subcategories)
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setForm({ ...form, category: selectedId, subcategory: "" });
    // setSubcategories(categories.filter((c) => c.parentId === selectedId));
    setSubcategories(
      Array.isArray(categories)
        ? categories.filter(c => c.parentId === selectedId)
        : []
    );

  };

  const handleSubcategoryChange = (e) => setForm({ ...form, subcategory: e.target.value });

  // Tags
  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };
  const handleTagRemove = (tag) => setTags(tags.filter(t => t !== tag));

  // Hashtags
  const handleHashtagAdd = () => {
    const trimmed = hashtagInput.trim();
    if (trimmed && !hashtags.includes(trimmed)) {
      setHashtags([...hashtags, trimmed]);
      setHashtagInput("");
    }
  };
  const handleHashtagRemove = (tag) => setHashtags(hashtags.filter(t => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();

    let blocksData;
    try {
      blocksData = await editorInstanceRef.current?.save?.();
    } catch (err) {
      return alert("EditorJS failed to save content!");
    }

    if (!form.title || !form.description || !blocksData?.blocks?.length) {
      return alert("All required fields must be filled!");
    }

    try {
      await axios.post("/api/posts", {
        ...form,
        content: text,
        blocks: blocksData.blocks,
        tags,
        hashtags,
        userId: user?._id,
        author: user?.username,
      });

      alert("Blog post created!");
      setForm({
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
    } catch (err) {
      console.error("Failed to create post", err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Create Blog Post</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-12">
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Blog Title" className="form-control" required />
        </div>

        <div className="col-md-12">
          <MDEditor
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
            commands={[commands.bold, commands.italic, commands.strikethrough, commands.hr, commands.title, commands.divider, commands.link, commands.code, commands.image, commands.unorderedListCommand, commands.orderedListCommand, commands.checkedListCommand]}
            hidemenu={true}
          />
        </div>

        {/* Category */}
        <div className="col-md-6">
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select value={form.category} onChange={handleCategoryChange} required>
              <option value="">Select Category</option>
              {categories.filter(c => !c.parentId).map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Subcategory */}
        <div className="col-md-6">
          <Form.Group>
            <Form.Label>Subcategory</Form.Label>
            <Form.Select value={form.subcategory} onChange={handleSubcategoryChange} disabled={!subcategories.length}>
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Tags */}
        <div className="col-md-12">
          <Form.Label>Tags</Form.Label>
          <InputGroup>
            <Form.Control value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleTagAdd(); }}} />
            <Button onClick={handleTagAdd}>Add</Button>
          </InputGroup>
          <div className="mt-2 d-flex flex-wrap gap-2">
            {tags.map(tag => <Badge key={tag} bg="secondary" className="d-flex align-items-center">{tag} <Button variant="link" size="sm" className="ms-1 p-0 text-white" style={{textDecoration:'none'}} onClick={() => handleTagRemove(tag)}>×</Button></Badge>)}
          </div>
        </div>

        {/* Hashtags */}
        <div className="col-md-12">
          <Form.Label>Hashtags</Form.Label>
          <InputGroup>
            <Form.Control value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleHashtagAdd(); }}} />
            <Button onClick={handleHashtagAdd}>Add</Button>
          </InputGroup>
          <div className="mt-2 d-flex flex-wrap gap-2">
            {hashtags.map(tag => <Badge key={tag} bg="info" className="d-flex align-items-center">#{tag} <Button variant="link" size="sm" className="ms-1 p-0 text-white" style={{textDecoration:'none'}} onClick={() => handleHashtagRemove(tag)}>×</Button></Badge>)}
          </div>
        </div>

        {/* EditorJS */}
        <div className="col-md-12"><div id="editorjs"></div></div>

        {/* JoditEditor */}
        <div className="col-md-12 mb-3">
          <label><strong>Content</strong></label>
          <JoditEditor ref={editor} value={text} config={config} onBlur={(newText) => setText(newText)} />
        </div>

        <div className="col-md-12 text-center">
          <Button type="submit" variant="primary">Publish</Button>
        </div>
      </form>
    </div>
  );
};

export default AddBlogPost;
