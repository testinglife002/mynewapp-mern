// MERN src/appcomponents/Notes.jsx 
import { useContext, useEffect, useRef, useState } from "react"; 
import Masonry from "react-masonry-css"; 
import EditorModal from "./EditorModal"; 
import Card from "./Card"; 
// import ShareModal from "./ShareModal"; 
import { EditorContext } from "./EditorContext"; 
// import axios from "../../utils/axiosClient"; 
 import { Button } from "react-bootstrap";
import newRequest from "../../../utils/newRequest";


const Notes = ({user}) => {

    const [notesArr, setNotesArr] = useState([]); 
    const [filter, setFilter] = useState({ text: "", project: "", type: "all" }); 
    const [project, setProject] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectOptions, setProjectOptions] = useState([]); 
    const [showShareModal, setShowShareModal] = useState(false); 
    const [shareNoteId, setShareNoteId] = useState(null); 
    const [showModal, setShowModal] = useState(false); 
    const [viewType, setViewType] = useState("grid"); 
    const [modalData, setModalData] = useState({ title: "", projectId: "", isPublic: false, blocks: [] }); 
    const updatedId = useRef(null); 
    const { editorInstanceRef, clearEditor } = useContext(EditorContext);

    useEffect(() => {
    const fetchProjects = async () => {
        try {
        const res = await newRequest.get("/projects/my-projects");
        setProjects(res.data);          // keep full projects
        setProjectOptions(res.data);    // populate options for dropdown
        } catch (err) {
        console.error("Failed to fetch projects", err);
        }
    };
    fetchProjects();
    }, []);


    // console.log(projects); 


    // Fetch notes 
    const fetchAllNotes = async () => { 
        if (!user) return; 
        const res = await newRequest.get("/notes");
        setNotesArr(res.data.reverse()); 
    };

    useEffect(() => { 
        fetchAllNotes(); 
    }, [user]);

    const filtered = notesArr.filter((note) => { 
        const matchProject = !filter.project || note.project === filter.project; 
        const matchText = !filter.text || note.title.toLowerCase().includes(filter.text.toLowerCase()); 
        let matchType = true; 
        if (filter.type === "own") matchType = note.user === user._id && !note.sharedOriginal; 
        else if (filter.type === "shared") matchType = note.user === user._id && note.sharedOriginal; 
        else if (filter.type === "public") matchType = note.isPublic; 
        else if (filter.type === "sharedwithme") matchType = note.sharedWith?.includes(user._id); 
        return matchProject && matchText && matchType; 
    });

    // Save note (create or update)
    const handleSave = async (title, projectId, isPublic, tags, blocks) => {
       //  console.log(title, projectId, isPublic, tags, blocks)
       if (!editorInstanceRef.current) {
            console.error("Editor instance not ready");
            return;
        }
        
        try {
            // ✅ get full content from Editor.js
            const output = await editorInstanceRef.current.save();
            const payload = {
                title,
                projectId,
                isPublic,
                tags,
                blocks: output.blocks, // ✅ only blocks, not whole output
            };
            
            if (updatedId.current) {
                // UPDATE
                // UPDATE
                await newRequest.put(`/notes/${updatedId.current}`, payload);
            } else {
                // CREATE
                // CREATE
                await newRequest.post("/notes", payload);

            }
            fetchAllNotes(); // refresh after save
        } catch (err) {
        console.error("Failed to save note", err);
        }
    };

    const handleAdd = () => {
        updatedId.current = null;
        setModalData({
        title: "",
        projectId: "",
        isPublic: false,
        tags: [],
        blocks: [],
        });
        setShowModal(true);
    };


    const handleEdit = (id) => { 
        updatedId.current = id; 
        const note = notesArr.find((n) => n._id === id); 
        if (note) { 
            setModalData({ 
            title: note.title, 
            projectId: note.project, 
            isPublic: note.isPublic, 
            tags: note.tags || [], 
            blocks: note.blocks || [] 
            }); 
            setShowModal(true); 
        } 
    };


    // DELETE
    const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
        await newRequest.delete(`/notes/${id}`);
        fetchAllNotes();
    } catch (err) {
        console.error("Failed to delete note", err);
    }
    };

    const handleShareClick = (id) => { 
        setShareNoteId(id); 
        setShowShareModal(true); 
    };

    // SHARE
    const handleConfirmShare = async (targetUserId) => {
    try {
        await newRequest.post(`/notes/${shareNoteId}/share`, { targetUserId });
        alert("Note shared successfully!");
        setShowShareModal(false);
        setShareNoteId(null);
    } catch (err) {
        console.error("Failed to share note", err);
    }
    };

    // COPY TO MY NOTES
    const handleCopyToDashboard = async (noteId) => {
    try {
        await newRequest.post(`/notes/${noteId}/copy`);
        alert("Copied to your notes");
        fetchAllNotes();
    } catch (err) {
        console.error("Failed to copy note", err);
    }
    };

  return (
    <> 
        <EditorModal 
            show={showModal} 
            handleClose={() => setShowModal(false)} 
            onSave={handleSave} 
            initialTitle={modalData.title}
            initialProject={modalData.projectId}
            initialIsPublic={modalData.isPublic}
            initialTags={modalData.tags}
            initialBlocks={modalData.blocks}
        />

        {showShareModal && 
            ( <ShareModal 
                show={showShareModal} 
                onClose={() => setShowShareModal(false)} 
                onShareConfirm={handleConfirmShare} /> 
            )
        }
        
    <div>
        <div className="container-fluid">
            <div className="d-flex gap-2 mb-3">
                <input
                    type="text"
                    placeholder="Search titles"
                    value={filter.text}
                    onChange={(e) => setFilter((f) => ({ ...f, text: e.target.value }))}
                    className="form-control"
                    title="Search by title"
                />
                <select
                    value={filter.project}
                    onChange={(e) => setFilter((f) => ({ ...f, project: e.target.value }))}
                    className="form-select"
                    title="Filter by project"
                >
                <option value="">All Projects</option>
                    {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
                <select
                    value={filter.type}
                    onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
                    className="form-select"
                    title="Filter note type"
                >
                    <option value="all">All</option>
                    <option value="own">My Notes</option>
                    <option value="shared">My Copies</option>
                    <option value="public">Public</option>
                    <option value="sharedwithme">Shared with Me</option>
                </select>
            </div>


            <div className="d-flex mb-2">
            <h5 className="me-2">Notes</h5>
                <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                <Button
                variant={viewType === "grid" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setViewType("grid")}
                >
                <i className="bi bi-grid-3x3-gap-fill me-1"></i> Grid
                </Button>
                <Button
                variant={viewType === "list" ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setViewType("list")}
                >
                <i className="bi bi-list-task me-1"></i> List
                </Button>
                </div>
            </div>


            {viewType === "grid" ? (
                <Masonry
                breakpointCols={{ default: 3, 1200: 2, 768: 1 }}
                className="my-masonry-grid d-flex"
                columnClassName="my-masonry-grid_column"
                >
                {filtered.map((note) => (
                    <Card
                    key={note._id}
                    idx={note._id}
                    title={note.title}
                    blocks={note.blocks}
                    projectId={note.project}
                    projectName={note.project?.name}
                    createdBy={note.createdBy}
                    user={user}
                    createdUsername={note.createdBy?.username}
                    isPublic={note.isPublic}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onShare={handleShareClick}
                    onCopyToDashboard={handleCopyToDashboard}
                    />
                    ))}
                </Masonry>
                ) : (
                <div className="list-group">
                {filtered.map((note) => (
                    <div className="list-group-item" key={note._id}>
                    <Card
                    key={note._id}
                    idx={note._id}
                    title={note.title}
                    blocks={note.blocks}
                    projectId={note.project}
                    projectName={note.project?.name}
                    createdBy={note.createdBy}
                    user={user}
                    createdUsername={note.createdBy?.username}
                    isPublic={note.isPublic}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onShare={handleShareClick}
                    onCopyToDashboard={handleCopyToDashboard}
                    />
                    </div>
                ))}
                </div>
                )}
        </div>


        <div className="position-fixed bottom-0 end-0 m-3">
            <button className="btn btn-sm btn-primary d-flex align-items-center" onClick={handleAdd}>
            <span className="pe-1">New Note</span>
            <i className="bi bi-journal-plus fs-2"></i>
            </button>
        </div>
            
    </div>     
    </>
  )
}

export default Notes