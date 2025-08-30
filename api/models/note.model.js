// src/models/note.model.js
import mongoose from 'mongoose';


const BlockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },  // "paragraph", "header", etc.
    data: { type: Object, required: true },  // flexible: text, level, items, url
    tunes: { type: Object }                  // optional editor plugins like alignment
  },
  { _id: false }
);


const noteSchema = new mongoose.Schema(
{
    title: { type: String, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: false },
    blocks: [BlockSchema],   // ✅ full editor.js blocks
    isPublic: { type: Boolean, default: false },
    createdBy:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdUsername: { type: String, default: '' },
    tags: [{ type: String }],
    sharedOriginal: { type: String, default: null },
    sharedWith: { type: [String], default: [] }, // store user ids
    },
    { timestamps: true }
);


const Note = mongoose.model('Note', noteSchema);
export default Note;
