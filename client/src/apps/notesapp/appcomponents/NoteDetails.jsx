// src/appcomponents/NoteDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../../utils/newRequest";
import Content from "./Content";
import { Spinner } from "react-bootstrap";

function NoteDetails() {
  const { id } = useParams(); // /notes/:id
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await newRequest.get(`/notes/${id}`);
        setNote(res.data);
      } catch (err) {
        console.error("Failed to fetch note", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!note) {
    return <div className="alert alert-danger">Note not found</div>;
  }

  return (
    <div className="container my-4">
      <div className="mb-3">
        <Link to="/notes" className="btn btn-sm btn-outline-secondary">
          ← Back to Notes
        </Link>
      </div>

      <h2 className="fw-bold">{note.title}</h2>
      <div className="text-muted mb-2">
        Project: {note.project?.name || "No Project"} |{" "}
        {note.isPublic ? "Public" : "Private"}
      </div>

      <div className="note-content">
        {note.blocks && note.blocks.length > 0 ? (
          note.blocks.map((block, i) => (
            <Content key={block.id || i} block={block} />
          ))
        ) : (
          <p className="text-muted">No content available</p>
        )}
      </div>
    </div>
  );
}

export default NoteDetails;
