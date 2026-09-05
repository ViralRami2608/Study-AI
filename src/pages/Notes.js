import React, { useEffect, useState } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await fetch("http://localhost:5000/api/notes");

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    }
  }

  function handleAddNote() {
    setEditingId(null);
    setTitle("");
    setSubject("");
    setContent("");
    setShowForm(true);
  }

  async function handleSaveNote(e) {
    e.preventDefault();

    const noteData = {
      title: title,
      subject: subject,
      content: content
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(
          "http://localhost:5000/api/notes/" + editingId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(noteData)
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      setShowForm(false);
      setEditingId(null);
      setTitle("");
      setSubject("");
      setContent("");

      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Could not save note. Check that the backend is running.");
    }
  }

  function handleEditNote(note) {
    setEditingId(note._id);
    setTitle(note.title || "");
    setSubject(note.subject || "");
    setContent(note.content || "");
    setShowForm(true);
  }

  async function handleDeleteNote(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notes/" + id,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Could not delete note.");
    }
  }

  const filteredNotes = notes.filter(function (note) {
    const noteTitle = note.title || "";
    const noteContent = note.content || "";
    const noteSubject = note.subject || "";

    const matchesSearch =
      noteTitle.toLowerCase().includes(search.toLowerCase()) ||
      noteContent.toLowerCase().includes(search.toLowerCase()) ||
      noteSubject.toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      subjectFilter === "all" ||
      noteSubject.toLowerCase() === subjectFilter.toLowerCase();

    return matchesSearch && matchesSubject;
  });

  return (
    <main className="notes-page">

      <div className="notes-page-header">
        <div>
          <h1>Notes</h1>
          <p>Create and manage your study notes.</p>
        </div>

        <button
          className="add-note-button"
          onClick={handleAddNote}
        >
          + Add Note
        </button>
      </div>

      {showForm && (
        <div className="note-form-container">
          <form
            className="note-form"
            onSubmit={handleSaveNote}
          >
            <h2>
              {editingId ? "Edit Note" : "Create New Note"}
            </h2>

            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Enter subject name"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />

            <div className="note-form-buttons">
              <button type="submit">
                {editingId ? "Update Note" : "Save Note"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="notes-tools">
        <input
          type="text"
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
        >
          <option value="all">All Subjects</option>
          <option value="dbms">DBMS</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="dsa">DSA</option>
        </select>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p className="no-notes">
            No notes found. Click "+ Add Note" to create your first note.
          </p>
        ) : (
          filteredNotes.map(function (note) {
            return (
              <div className="note-card" key={note._id}>
                <div className="note-card-top">
                  <span className="note-subject">
                    {note.subject || "No Subject"}
                  </span>

                  <button
                    className="note-menu"
                    onClick={() => handleDeleteNote(note._id)}
                  >
                    Delete
                  </button>
                </div>

                <h3>{note.title || "Untitled Note"}</h3>

                <p>{note.content || "No content"}</p>

                <div className="note-card-bottom">
                  <span>
                    {note.updatedAt
                      ? "Updated: " +
                        new Date(note.updatedAt).toLocaleDateString()
                      : "Recently updated"}
                  </span>

                  <button onClick={() => handleEditNote(note)}>
                    Edit
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </main>
  );
}

export default Notes;