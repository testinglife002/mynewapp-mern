// src/appcomponents/ViewNote.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../../utils/newRequest";
import { Button, Spinner } from "react-bootstrap";
import BlocksRenderer from "./BlocksRenderer";

function ViewNote({ user }) {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await newRequest.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Failed to load note", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  if (loading) {
    return <Spinner animation="border" className="m-5" />;
  }

  if (!note) {
    return <div className="alert alert-danger">Note not found</div>;
  }

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{note.title}</h3>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Back to Notes
        </Link>
      </div>

      <div className="mb-2">
        <span className={`badge ${note.isPublic ? "bg-success" : "bg-secondary"}`}>
          {note.isPublic ? "Public" : "Private"}
        </span>
      </div>

      <div className="mb-3 text-muted small">
        Project: {note.project?.name || "Unassigned"} | By: {note.createdBy?.username || "Unknown"}
      </div>

      <div className="border rounded p-3">
        <BlocksRenderer blocks={note.blocks} />
      </div>

    </div>
  );
}

export default ViewNote;
