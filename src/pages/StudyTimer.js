import React from "react";

function StudyTimer() {
  return (
    <main className="timer-page">

      {/* Page Header */}

      <div className="timer-header">
        <div>
          <h1>Study Timer</h1>

          <p>
            Focus on your studies and track your study time.
          </p>
        </div>
      </div>


      {/* Timer Main Area */}

      <div className="timer-container">

        {/* Subject Selection */}

        <div className="timer-subject">

          <label>
            Select Subject
          </label>

          <select defaultValue="dsa">

            <option value="dsa">
              Data Structures & Algorithms
            </option>

            <option value="dbms">
              Database Management System
            </option>

            <option value="javascript">
              JavaScript
            </option>

            <option value="react">
              React.js
            </option>

          </select>

        </div>


        {/* Timer */}

        <div className="timer-display">

          <span>
            25:00
          </span>

        </div>


        <p className="timer-status">
          Ready to start your study session
        </p>


        {/* Timer Buttons */}

        <div className="timer-buttons">

          <button className="timer-start">
            Start
          </button>

          <button className="timer-pause">
            Pause
          </button>

          <button className="timer-reset">
            Reset
          </button>

        </div>


        {/* Today's Study Information */}

        <div className="timer-info">

          <div className="timer-info-card">

            <span>
              Today's Study Time
            </span>

            <strong>
              1h 45m
            </strong>

          </div>


          <div className="timer-info-card">

            <span>
              Sessions Completed
            </span>

            <strong>
              3
            </strong>

          </div>


          <div className="timer-info-card">

            <span>
              Current Subject
            </span>

            <strong>
              DSA
            </strong>

          </div>

        </div>

      </div>

    </main>
  );
}

export default StudyTimer;