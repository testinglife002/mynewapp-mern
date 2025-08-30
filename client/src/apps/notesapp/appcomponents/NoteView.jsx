// src/appcomponents/NoteView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../../utils/newRequest";
import BlocksRenderer from "./BlocksRenderer";


const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await newRequest.delete(`/notes/${id}`);
      navigate("/notes");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = async () => {
    try {
      await newRequest.post(`/notes/${id}/copy-to-me`);
      alert("Note copied to your account");
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const targetUid = prompt("Enter user ID to share with:");
    if (!targetUid) return;
    try {
      await newRequest.post(`/notes/${id}/share`, { targetUid });
      alert("Note shared!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <div className="container py-3">
      <h2>{note.title}</h2>
      <p>
        By: {note.createdBy?.username || "Unknown"} |{" "}
        {new Date(note.createdAt).toLocaleString()}
      </p>
      <div className="border p-3 bg-light">
        <BlocksRenderer blocks={note.blocks} />
      </div>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
        <button className="btn btn-secondary" onClick={handleCopy}>
          Copy to Me
        </button>
        <button className="btn btn-primary" onClick={handleShare}>
          Share
        </button>
      </div>
    </div>
  );
};

export default NoteView;
