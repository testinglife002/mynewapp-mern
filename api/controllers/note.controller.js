// server/controllers/notes.controller.js
import Note from '../models/note.model.js';


// GET /api/notes
// returns own + public + sharedWithMe
export const listNotes = async (req, res) => {
    try {
    const userId = req.userId;


    const [own, publicNotes, sharedWithMe] = await Promise.all([
      Note.find({ createdBy: userId }).populate("createdBy", "username").populate("project", "name"),
      // .populate("user", "username"),
      Note.find({ isPublic: true }).populate("createdBy", "username").populate("project", "name"),
      Note.find({ sharedWith: userId }).populate("createdBy", "username").populate("project", "name"),
    ]);


    const map = new Map();
    [...own, ...publicNotes, ...sharedWithMe].forEach((n) => map.set(String(n._id), n));
    // const notes = Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const notes = Array.from(map.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((note) => ({
        ...note.toObject(),
        createdUsername: note.createdBy?.username || "Unknown",
      }));



    res.json(notes);
    } catch (e) {
    res.status(500).json({ message: e.message });
    }
};


// POST /api/notes
export const createNote = async (req, res) => {
   // console.log(req.body);
  try {
    const { title, projectId, isPublic, tags, blocks } = req.body;

    if (!Array.isArray(blocks)) {
      return res.status(400).json({ message: "Blocks must be an array" });
    }

    const newNote = await Note.create({
      title,
      project: projectId,
      isPublic,
      tags,
      blocks,  // <-- Save full Editor.js blocks array {type, data, tunes}
      createdBy: req.userId, // from auth middleware or fallback
    });

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
};

/*
export const createNote = async (req, res) => {
    try {
    const userId = req.userId;
    const username = req.user.username || '';
    const { title, projectId = '', blocks = [], isPublic = false } = req.body;


    if (!title || !blocks?.length) return res.status(400).json({ message: 'title and blocks required' });


    const note = await Note.create({
    title,
    project: projectId, // <-- new field
    blocks,
    isPublic,   
    createdBy: userId,
    createdUsername: username,
    sharedOriginal: null,
    sharedWith: [],
    });


    res.status(201).json(note);
    } catch (e) {
    res.status(500).json({ message: e.message });
    }
};
*/


// GET /api/notes/:id
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findById(id)
      .populate("project", "name")
      .populate("createdBy", "username email");

    if (!note) return res.status(404).json({ message: "Not found" });

    // permission check: own, public, or shared
    const allowed =
      String(note.createdBy._id) === String(userId) ||
      note.isPublic ||
      note.sharedWith.includes(userId);

    if (!allowed) return res.status(403).json({ message: "Forbidden" });

    res.json(note);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("user", "username");
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// PUT /api/notes/:id
// PUT /api/notes/:id
export const updateNote = async (req, res) => {
    try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, projectId = '', blocks = [], isPublic = false } = req.body;


    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    // if (note.createdBy !== userId) return res.status(403).json({ message: 'Forbidden' });


    note.title = title ?? note.title;
    note.project = projectId ?? note.project;
    note.blocks = blocks?.length ? blocks : note.blocks;
    note.isPublic = typeof isPublic === 'boolean' ? isPublic : note.isPublic;


    await note.save();
    res.json(note);
    } catch (e) {
    res.status(500).json({ message: e.message });
    }
};


// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};

export const shareNote = async (req, res) => {
  const { targetUserId } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    note.sharedWith = [...new Set([...(note.sharedWith || []), targetUserId])];
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to share note" });
  }
};

export const copyNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const copy = await Note.create({
      title: note.title,
      project: note.project,
      isPublic: false,
      tags: note.tags,
      blocks: note.blocks,
      createdBy: req.userId, // new owner
      sharedOriginal: note._id,
    });

    res.status(201).json(copy);
  } catch (err) {
    res.status(500).json({ message: "Failed to copy note" });
  }
};


