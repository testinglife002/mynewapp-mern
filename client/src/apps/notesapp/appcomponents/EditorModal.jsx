// src/appcomponents/EditorModal.jsx
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "./EditorContext";
import newRequest from "../../../utils/newRequest";
import { Badge, Button, Form, InputGroup, Modal } from "react-bootstrap";

const EditorModal = ({
  show,
  handleClose,
  onSave,
  initialTitle,
  initialProject,
  initialIsPublic = false,
  initialTags = [],
  initialBlocks = [],
}) => {
  const { initEditor, editorInstanceRef } = useContext(EditorContext);

  const [title, setTitle] = useState(initialTitle || "");
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [project, setProject] = useState(initialProject || "");
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState(initialTags || []);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setTitle(initialTitle || "");
    setIsPublic(initialIsPublic);
    setProject(initialProject || "");
    setTags(initialTags || []);
  }, [initialTitle, initialIsPublic, initialProject, initialTags]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await newRequest.get("/projects/my-projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, []);

  // console.log(projects);

  useEffect(() => {
    if (show) {
      initEditor("editorjs", { blocks: initialBlocks || [] });
    }
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [show, initialBlocks, initEditor, editorInstanceRef]);

  const handleTagAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveClick = async () => {
    const blocks = editorInstanceRef.current
      ? (await editorInstanceRef.current.save()).blocks
      : [];
    onSave(title, project, isPublic, tags, blocks);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialTitle ? "Edit Note" : "New Note"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Title */}
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Project */}
        <Form.Group className="mb-2">
          <Form.Label>Project</Form.Label>
          <Form.Select
            value={project}
            onChange={(e) => setProject(e.target.value)}
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Tags */}
        <Form.Group className="mb-2">
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
            <Button onClick={handleTagAdd}>Add</Button>
          </InputGroup>
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} bg="secondary">
                {tag}
                <Button
                  variant="link"
                  size="sm"
                  className="ms-1 text-white"
                  onClick={() => handleTagRemove(tag)}
                >
                  ×
                </Button>
              </Badge>
            ))}
          </div>
        </Form.Group>

        {/* EditorJS */}
        <Form.Group>
          <div id="editorjs" style={{ minHeight: "300px" }} />
        </Form.Group>

        {/* Public checkbox */}
        <Form.Check
          type="checkbox"
          label="Public"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export default EditorModal;
