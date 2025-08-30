// src/pages/post/PostDetails.jsx
import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Badge, Button, Row, Col, Card } from "react-bootstrap";
import EditorContextProvider, { EditorContext } from "../../apps/notesapp/appcomponents/EditorContext.jsx";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // EditorJS
  const { initEditor, editorInstanceRef } = useContext(EditorContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post && document.getElementById("editorjs-view")) {
      initEditor("editorjs-view", { blocks: post.blocks || [], readonly: true });
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [post, initEditor, editorInstanceRef]);

  if (loading)
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
      </div>
    );

  if (!post)
    return <div className="text-center mt-4">Post not found.</div>;

  return (
    <div className="container mt-4">
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back
      </Button>

      <Card>
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {post.categoryTitle} {post.subcategoryTitle && `> ${post.subcategoryTitle}`}
          </Card.Subtitle>

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

          <h5 className="mt-3">Description</h5>
          <p>{post.description}</p>

          <h5>Content</h5>
          <div id="editorjs-view" className="mb-4"></div>

          <Button variant="warning" onClick={() => navigate(`/posts/edit/${post._id}`)}>
            Edit Post
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PostDetails;
