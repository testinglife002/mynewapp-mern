import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './CreateBoardModal.css';

function CreateBoardModal({ isOpen, onClose, onCreateBoard }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [background, setBackground] = useState('#0079BF');
    const [filePreview, setFilePreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalBackground = filePreview || background;
        onCreateBoard({ name, description, background: finalBackground });
        setName('');
        setDescription('');
        setBackground('#0079BF');
        setFilePreview(null);
        onClose();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setFilePreview(previewURL);
        }
    };

    const handleColorPick = (e) => {
        setBackground(e.target.value);
        setFilePreview(null);
    };

    const handleTextBackgroundChange = (e) => {
        setBackground(e.target.value);
        setFilePreview(null); // prioritize typed URL if valid
    };

    const previewStyle = {
        height: '100px',
        backgroundColor: background.startsWith('#') && !filePreview ? background : undefined,
        backgroundImage: filePreview
            ? `url(${filePreview})`
            : background.startsWith('http')
            ? `url(${background})`
            : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginTop: '10px',
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Create New Board</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="boardName">
                        <Form.Label>Board Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., Project X Planning"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boardDescription">
                        <Form.Label>Description (Optional)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="A brief description of this board..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boardBackground">
                        <Form.Label>Background (Hex, URL, or File)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., #0079BF or https://example.com/image.jpg"
                            value={background}
                            onChange={handleTextBackgroundChange}
                        />
                        <div className="d-flex gap-2 mt-2">
                            <Form.Control
                                type="color"
                                title="Pick a background color"
                                value={background.startsWith('#') ? background : '#0079BF'}
                                onChange={handleColorPick}
                                style={{ width: '60px', padding: 0 }}
                            />
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                title="Upload background image"
                            />
                        </div>
                        <div style={previewStyle} className="background-preview d-flex align-items-center justify-content-center text-muted">
                            {!background.startsWith('#') && !background.startsWith('http') && !filePreview && 'Background Preview'}
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Create Board
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default CreateBoardModal;
