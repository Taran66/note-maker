from fastapi import FastAPI, HTTPException
from typing import List
import uuid
from models import Note
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

notes = []

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.post("/notes/", response_model=Note)
async def create_note(new_note: Note):
    new_note.id = str(uuid.uuid4())  # Generate a unique ID
    notes.append(new_note)
    return new_note

@app.get("/notes/", response_model=List[Note])
async def get_notes():
    return notes

@app.get("/notes/{note_id}", response_model=Note)
async def get_note(note_id: str):
    note = next((note for note in notes if note.id == note_id), None)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.put("/notes/{note_id}", response_model=Note)
async def update_note(note_id: str, updated_note: Note):
    for index, note in enumerate(notes):
        if note.id == note_id:
            notes[index].title = updated_note.title
            notes[index].content = updated_note.content
            return notes[index]
    raise HTTPException(status_code=404, detail="Note not found")

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    global notes
    notes = [note for note in notes if note.id != note_id]
    return {"message": "Note deleted successfully"}
