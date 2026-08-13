import React from "react";

function StudyPlanner() {
  return (
    <main className="planner-page">

      {/* Page Header */}

      <div className="planner-header">

        <div>
          <h1>Study Planner</h1>

          <p>
            Plan your study tasks and manage your daily goals.
          </p>
        </div>

        <button className="add-task-button">
          + Add Task
        </button>

      </div>


      {/* Today's Progress */}

      <div className="planner-progress">

        <div>
          <h3>Today's Progress</h3>

          <p>
            2 of 5 tasks completed
          </p>
        </div>

        <div className="progress-number">
          40%
        </div>

      </div>


      {/* Progress Bar */}

      <div className="progress-bar">
        <div className="progress-fill"></div>
      </div>


      {/* Today's Tasks */}

      <div className="tasks-section">

        <div className="section-title">
          <h2>Today's Tasks</h2>

          <span>
            Thursday, August 13
          </span>
        </div>


        {/* Task 1 */}

        <div className="task-item completed">

          <input
            type="checkbox"
            defaultChecked
          />

          <div className="task-info">

            <h3>
              Revise JavaScript Basics
            </h3>

            <p>
              Variables, functions and arrays
            </p>

          </div>

          <span className="task-time">
            1 Hour
          </span>

        </div>


        {/* Task 2 */}

        <div className="task-item completed">

          <input
            type="checkbox"
            defaultChecked
          />

          <div className="task-info">

            <h3>
              Practice SQL Queries
            </h3>

            <p>
              Joins, Group By and Subqueries
            </p>

          </div>

          <span className="task-time">
            1 Hour
          </span>

        </div>


        {/* Task 3 */}

        <div className="task-item">

          <input
            type="checkbox"
          />

          <div className="task-info">

            <h3>
              Study Binary Trees
            </h3>

            <p>
              Tree concepts and basic traversal
            </p>

          </div>

          <span className="task-time">
            1.5 Hours
          </span>

        </div>


        {/* Task 4 */}

        <div className="task-item">

          <input
            type="checkbox"
          />

          <div className="task-info">

            <h3>
              Work on StudyAI Project
            </h3>

            <p>
              Complete the Study Planner UI
            </p>

          </div>

          <span className="task-time">
            2 Hours
          </span>

        </div>


        {/* Task 5 */}

        <div className="task-item">

          <input
            type="checkbox"
          />

          <div className="task-info">

            <h3>
              Review Today's Topics
            </h3>

            <p>
              Quickly revise everything studied today
            </p>

          </div>

          <span className="task-time">
            30 Min
          </span>

        </div>

      </div>

    </main>
  );
}

export default StudyPlanner;