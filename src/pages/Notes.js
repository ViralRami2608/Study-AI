import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  function getToken() {
    return localStorage.getItem("token");
  }

  function handleUnauthorized() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Your session has expired. Please login again.");

    navigate("/login");
  }

  async function fetchNotes() {
    const token = getToken();

    console.log("Token available:", !!token);

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

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
    setAttachment(null);
    setShowForm(true);
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setAttachment(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please select a PDF file only.");
      e.target.value = "";
      setAttachment(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("PDF file size cannot exceed 10 MB.");
      e.target.value = "";
      setAttachment(null);
      return;
    }

    setAttachment(selectedFile);
  }

  async function handleSaveNote(e) {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("content", content);

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      let response;

      if (editingId) {
        response = await fetch(
          "http://localhost:5000/api/notes/" + editingId,
          {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + token
            },
            body: formData
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/notes",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token
            },
            body: formData
          }
        );
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to save note"
        );
      }

      setShowForm(false);
      setEditingId(null);
      setTitle("");
      setSubject("");
      setContent("");
      setAttachment(null);

      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);

      alert(
        error.message ||
          "Could not save note."
      );
    }
  }

  function handleEditNote(note) {
    setEditingId(note._id);
    setTitle(note.title || "");
    setSubject(note.subject || "");
    setContent(note.content || "");
    setAttachment(null);
    setShowForm(true);
  }

  async function handleDeleteNote(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/notes/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Could not delete note.");
    }
  }

  const subjects = Array.from(
    new Set(
      notes
        .map(function (note) {
          return (note.subject || "").trim();
        })
        .filter(function (subjectName) {
          return subjectName !== "";
        })
    )
  ).sort(function (a, b) {
    return a.localeCompare(b);
  });

  const filteredNotes = notes.filter(function (note) {
    const noteTitle = note.title || "";
    const noteContent = note.content || "";
    const noteSubject = note.subject || "";

    const matchesSearch =
      noteTitle
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      noteContent
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      noteSubject
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSubject =
      subjectFilter === "all" ||
      noteSubject.toLowerCase() ===
        subjectFilter.toLowerCase();

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
              {editingId
                ? "Edit Note"
                : "Create New Note"}
            </h2>

            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Enter subject name"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              required
            />

            <div className="note-file-section">
              <label htmlFor="note-attachment">
                Study Material (PDF)
              </label>

              <input
                id="note-attachment"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
              />

              {attachment && (
                <p className="selected-file">
                  Selected: {attachment.name}
                </p>
              )}

              {editingId && !attachment && (
                <p className="selected-file">
                  Leave empty to keep the existing PDF.
                </p>
              )}
            </div>

            <div className="note-form-buttons">
              <button type="submit">
                {editingId
                  ? "Update Note"
                  : "Save Note"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
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
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={subjectFilter}
          onChange={(e) =>
            setSubjectFilter(e.target.value)
          }
        >
          <option value="all">
            All Subjects
          </option>

          {subjects.map(function (subjectName) {
            return (
              <option
                key={subjectName}
                value={subjectName}
              >
                {subjectName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p className="no-notes">
            No notes found. Click "+ Add Note"
            to create your first note.
          </p>
        ) : (
          filteredNotes.map(function (note) {
            return (
              <div
                className="note-card"
                key={note._id}
              >

                <div className="note-card-top">
                  <span className="note-subject">
                    {note.subject ||
                      "No Subject"}
                  </span>

                  <button
                    className="note-menu"
                    onClick={() =>
                      handleDeleteNote(
                        note._id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>

                <h3>
                  {note.title ||
                    "Untitled Note"}
                </h3>

                <p>
                  {note.content ||
                    "No content"}
                </p>

                {note.attachment &&
                  note.attachment.fileUrl && (
                    <div className="note-attachment">

                      <span>
                        📄{" "}
                        {note.attachment.fileName}
                      </span>

                      <a
                        href={
                          note.attachment.fileUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open PDF
                      </a>

                    </div>
                  )}

                <div className="note-card-bottom">
                  <span>
                    {note.updatedAt
                      ? "Updated: " +
                        new Date(
                          note.updatedAt
                        ).toLocaleDateString()
                      : "Recently updated"}
                  </span>

                  <button
                    onClick={() =>
                      handleEditNote(note)
                    }
                  >
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