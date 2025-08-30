// src/pages/post/AddBlogPost.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
// import { toast } from "react-toastify";
import MDEditor, { commands } from "@uiw/react-md-editor";
import JoditEditor from 'jodit-react';
import { Button, Form, InputGroup, Badge } from "react-bootstrap";
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

  const [text, setText] = useState('');
    
  const editor = useRef();
  const config = {
      readonly : false
  }

  const { initEditor, editorInstanceRef } = useContext(EditorContext);
  const editorRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current && document.getElementById("editorjs")) {
      initEditor();
      editorRef.current = true;
    }
  }, [initEditor]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Handle category change (filter children as subcategories)
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setForm({ ...form, category: selectedId, subcategory: "" });
    setSubcategories(categories.filter((c) => c.parentId === selectedId));
  };

  const handleSubcategoryChange = (e) => {
    setForm({ ...form, subcategory: e.target.value });
  };

  // ✅ Tag handlers
  const handleTagAdd = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
      // toast.info(`Tag "${trimmedTag}" added`);
      console.log(`Tag "${trimmedTag}" added`);
    } else {
      // toast.warning("Duplicate or empty tag");
      console.log("Duplicate or empty tag");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    // toast.info(`Removed tag "${tagToRemove}"`);
    console.log(`Removed tag "${tagToRemove}"`);
  };

  // ✅ Hashtag handlers
  const handleHashtagAdd = () => {
    const trimmed = hashtagInput.trim();
    if (trimmed && !hashtags.includes(trimmed)) {
      setHashtags([...hashtags, trimmed]);
      setHashtagInput("");
      // toast.info(`Hashtag "#${trimmed}" added`);
      console.log(`Hashtag "#${trimmed}" added`);
    } else {
      // toast.warning("Duplicate or empty hashtag");
      console.log("Duplicate or empty hashtag");
    }
  };

  const handleHashtagRemove = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag));
    // toast.info(`Removed hashtag "#${tag}"`);
    console.log(`Removed hashtag "#${tag}"`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);
    console.log(tags,hashtags);

    let data;
    try {
      data = await editorInstanceRef.current?.save?.();
    } catch (err) {
      // toast.error("EditorJS failed");
      return;
    }

    if (!form.title || !form.description || !data?.blocks?.length) {
      // return toast.error("All required fields must be filled!");
      return alert("All required fields must be filled!");
    }

    try {
      const res = await axios.post("/api/posts", {
        ...form,
        content: text,
        blocks: data.blocks,   // save array only
        tags,
        hashtags,
        userId: user?._id,
        author: user?.username
      });
      // toast.success("Blog post created!");
      console.log("Blog post created!")
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
    } catch (err) {
      // toast.error("Failed to publish post");
      console.log("Failed to publish post");
      console.error(err);
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
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.hr,
              commands.title,
              commands.divider,
              commands.link,
              commands.code,
              commands.image,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.checkedListCommand
            ]}
            hidemenu={true}
          />
        </div>

        {/* Category Select */}
        <div className="col-md-6">
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={form.category}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories
                .filter((c) => !c.parentId) // only top-level
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Subcategory Select */}
        <div className="col-md-6">
          <Form.Group>
            <Form.Label>Subcategory</Form.Label>
            <Form.Select
              value={form.subcategory}
              onChange={handleSubcategoryChange}
              disabled={!subcategories.length}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* ✅ Tags */}
        <div className="col-md-12">
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Add tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleTagAdd();
                  }
                }}
              />
              <Button variant="outline-secondary" onClick={handleTagAdd}>
                Add
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Press enter or click "Add" to add tag
            </Form.Text>
          </Form.Group>

          <div className="d-flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                bg="secondary"
                className="d-flex align-items-center"
                style={{ padding: "0.5em" }}
              >
                {tag}
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => handleTagRemove(tag)}
                  className="ms-2 p-0 text-white"
                  style={{ textDecoration: "none" }}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* ✅ Hashtags */}
        <div className="col-md-12">
          <Form.Group className="mb-3" controlId="postHashtags">
            <Form.Label>Hashtags</Form.Label>
            <Form.Control
              type="text"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleHashtagAdd();
                }
              }}
              placeholder="Type hashtag (without #) and press Enter"
            />
            <div className="pull-right mt-2">
              <Button variant="outline-secondary" onClick={handleHashtagAdd}>
                Add
              </Button>
            </div>

            <div className="mt-2">
              {hashtags.map((tag) => (
                <Badge
                  key={tag}
                  bg="secondary"
                  className="me-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHashtagRemove(tag)}
                >
                  #{tag} &times;
                </Badge>
              ))}
            </div>
          </Form.Group>
        </div>

        <div className="col-md-12">
          <label><strong>Blocks Editor:</strong></label>
          <div id="editorjs"></div>
        </div>

        <div 
            // className="mt-2 mb-4 p-3 bg-light border rounded editor-box"
            style={{width:'100%', minHeight:'100%',marginTop:'30px'}}
          ><label>Content</label>
            <div className="mb-3 "  >
            <JoditEditor
                value={text}
                tabIndex = {1}
                ref = {editor}
                config={config}
                onBlur={newText => setText(newText)}
                onChange={newText => {}}
            />
            </div>
        </div>

        <div className="col-md-12 text-center mb-3">
          <Button type="submit" variant="primary">Publish</Button>
        </div>
        <br/>
      </form>
    </div>
  );
};

export default AddBlogPost;
