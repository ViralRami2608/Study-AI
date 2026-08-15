import React from "react";

function StudyPlanner() {
  return (
    <main className="planner-page">

      {/* Page Header */}

      <div className="planner-header">
        <div>
          <h1>Study Planner</h1>
          <p>Plan and manage your daily study tasks.</p>
        </div>

        <button className="planner-add-button">
          + Add Task
        </button>
      </div>


      {/* Planner Summary */}

      <div className="planner-summary">

        <div className="planner-summary-card">
          <span>Total Tasks</span>
          <strong>6</strong>
        </div>

        <div className="planner-summary-card">
          <span>Completed</span>
          <strong>3</strong>
        </div>

        <div className="planner-summary-card">
          <span>Pending</span>
          <strong>3</strong>
        </div>

      </div>


      {/* Today's Tasks */}

      <div className="planner-section">

        <div className="planner-section-header">
          <h2>Today's Tasks</h2>

          <select defaultValue="today">
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
          </select>
        </div>


        {/* Task 1 */}

        <div className="planner-task">

          <div className="task-check completed">
            ✓
          </div>

          <div className="task-details">
            <h3>Study DBMS Normalization</h3>
            <p>DBMS • 9:00 AM - 10:00 AM</p>
          </div>

          <span className="task-status completed-status">
            Completed
          </span>

        </div>


        {/* Task 2 */}

        <div className="planner-task">

          <div className="task-check">
          </div>

          <div className="task-details">
            <h3>Practice JavaScript Arrays</h3>
            <p>JavaScript • 11:00 AM - 12:00 PM</p>
          </div>

          <span className="task-status pending-status">
            Pending
          </span>

        </div>


        {/* Task 3 */}

        <div className="planner-task">

          <div className="task-check">
          </div>

          <div className="task-details">
            <h3>DSA Searching Problems</h3>
            <p>DSA • 4:00 PM - 5:00 PM</p>
          </div>

          <span className="task-status pending-status">
            Pending
          </span>

        </div>


        {/* Task 4 */}

        <div className="planner-task">

          <div className="task-check completed">
            ✓
          </div>

          <div className="task-details">
            <h3>React Components Revision</h3>
            <p>React.js • 6:00 PM - 7:00 PM</p>
          </div>

          <span className="task-status completed-status">
            Completed
          </span>

        </div>

      </div>

    </main>
  );
}

export default StudyPlanner;