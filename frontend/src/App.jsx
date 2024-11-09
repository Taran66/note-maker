import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentNoteId, setCurrentNoteId] = useState(null);

    // Fetch notes from the backend
    const fetchNotes = async () => {
        const response = await axios.get('http://localhost:8000/notes/');
        setNotes(response.data);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Create or update a note
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentNoteId) {
            // Update existing note
            await axios.put(`http://localhost:8000/notes/${currentNoteId}`, { title, content });
        } else {
            // Create new note
            await axios.post('http://localhost:8000/notes/', { title, content });
        }
        setTitle('');
        setContent('');
        setCurrentNoteId(null);
        fetchNotes();
    };

    // Edit a note
    const handleEdit = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setCurrentNoteId(note.id);
    };

    // Delete a note
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/notes/${id}`);
        fetchNotes();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Note Taking App</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="border border-gray-300 rounded-md p-2 w-full mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white rounded-md p-2">
                    {currentNoteId ? 'Update Note' : 'Add Note'}
                </button>
            </form>

            <ul>
                {notes.map(note => (
                    <li key={note.id} className="border border-gray-300 rounded-md p-4 mb-2">
                        <h3 className="text-xl font-semibold">{note.title}</h3>
                        <p>{note.content}</p>
                        <div className="mt-2">
                            <button onClick={() => handleEdit(note)} className="bg-yellow-500 text-white rounded-md p-1 mr-2">Edit</button>
                            <button onClick={() => handleDelete(note.id)} className="bg-red-500 text-white rounded-md p-1">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;