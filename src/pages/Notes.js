import React from "react";

function Notes() {
  return (
    <main className="notes-page">

      {/* Page Header */}

      <div className="notes-page-header">

        <div>
          <h1>Notes</h1>

          <p>
            Create and manage your study notes.
          </p>
        </div>

        <button className="add-note-button">
          + Add Note
        </button>

      </div>


      {/* Search and Filter */}

      <div className="notes-tools">

        <input
          type="text"
          placeholder="Search your notes..."
        />

        <select defaultValue="all">

          <option value="all">
            All Subjects
          </option>

          <option value="dbms">
            DBMS
          </option>

          <option value="java">
            Java
          </option>

          <option value="javascript">
            JavaScript
          </option>

          <option value="dsa">
            DSA
          </option>

        </select>

      </div>


      {/* Notes List */}

      <div className="notes-grid">

        {/* Note 1 */}

        <div className="note-card">

          <div className="note-card-top">

            <span className="note-subject">
              DBMS
            </span>

            <button className="note-menu">
              ⋮
            </button>

          </div>

          <h3>
            Database Normalization
          </h3>

          <p>
            Important concepts of 1NF, 2NF, 3NF
            and BCNF with examples.
          </p>

          <div className="note-card-bottom">
            <span>
              Updated today
            </span>

            <button>
              Open
            </button>
          </div>

        </div>


        {/* Note 2 */}

        <div className="note-card">

          <div className="note-card-top">

            <span className="note-subject">
              JavaScript
            </span>

            <button className="note-menu">
              ⋮
            </button>

          </div>

          <h3>
            JavaScript Basics
          </h3>

          <p>
            Variables, functions, arrays,
            objects and basic JavaScript concepts.
          </p>

          <div className="note-card-bottom">
            <span>
              Updated yesterday
            </span>

            <button>
              Open
            </button>
          </div>

        </div>


        {/* Note 3 */}

        <div className="note-card">

          <div className="note-card-top">

            <span className="note-subject">
              DSA
            </span>

            <button className="note-menu">
              ⋮
            </button>

          </div>

          <h3>
            Arrays and Searching
          </h3>

          <p>
            Array basics, linear search,
            binary search and their complexity.
          </p>

          <div className="note-card-bottom">
            <span>
              Updated 2 days ago
            </span>

            <button>
              Open
            </button>
          </div>

        </div>


      </div>

    </main>
  );
}

export default Notes;