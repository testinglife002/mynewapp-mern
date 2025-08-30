import React, { useState } from 'react';
import { Button, Form, InputGroup, Card } from 'react-bootstrap';

function CreateListForm({ onCreateList }) {
    const [title, setTitle] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            onCreateList(title.trim());
            setTitle('');
            setIsAdding(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        } else if (e.key === 'Escape') {
            setTitle('');
            setIsAdding(false);
        }
    };

    if (!isAdding) {
        return (
            <Button
                variant="light"
                onClick={() => setIsAdding(true)}
                className="w-100 text-start border border-secondary-subtle"
            >
                + Add another list
            </Button>
        );
    }

    return (
        <Card className="p-3 shadow-sm">
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    placeholder="Enter list title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onBlur={() => {
                        if (!title.trim()) setIsAdding(false);
                    }}
                    className="mb-2"
                />
                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                        Add List
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setTitle('');
                            setIsAdding(false);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </Form>
        </Card>
    );
}

export default CreateListForm;
