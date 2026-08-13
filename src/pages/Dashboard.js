function Dashboard() {
  return (
    <main className="dashboard">

      {/* Welcome Section */}

      <section className="welcome-section">

        <h1>Welcome to StudyAI</h1>

        <p>
          Manage your study activities and stay productive.
        </p>

      </section>


      {/* Statistics Cards */}

      <section className="stats-container">

        <div className="stat-card">

          <div className="stat-icon">
            T
          </div>

          <div>
            <p>Total Tasks</p>
            <h2>12</h2>
            <span>3 pending</span>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            C
          </div>

          <div>
            <p>Completed</p>
            <h2>8</h2>
            <span>This week</span>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            H
          </div>

          <div>
            <p>Study Hours</p>
            <h2>18.4h</h2>
            <span>This week</span>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            N
          </div>

          <div>
            <p>Total Notes</p>
            <h2>24</h2>
            <span>All subjects</span>
          </div>

        </div>

      </section>


      {/* Main Dashboard Grid */}

      <section className="dashboard-grid">


        {/* Today's Tasks */}

        <div className="dashboard-box">

          <div className="box-header">

            <div>
              <h2>Today's Tasks</h2>
              <p>Your study tasks for today</p>
            </div>

            <button className="view-button">
              View All
            </button>

          </div>


          <div className="task-list">

            <div className="task-row">

              <div className="task-check">
                ✓
              </div>

              <div className="task-details">
                <strong>DBMS Assignment</strong>
                <span>Database Management System</span>
              </div>

              <div className="task-time">
                10:00 AM
              </div>

            </div>


            <div className="task-row">

              <div className="task-check">
                ✓
              </div>

              <div className="task-details">
                <strong>Java Revision</strong>
                <span>Study Java loops and arrays</span>
              </div>

              <div className="task-time">
                1:00 PM
              </div>

            </div>


            <div className="task-row">

              <div className="task-check">
                ✓
              </div>

              <div className="task-details">
                <strong>React Project Work</strong>
                <span>Build StudyAI interface</span>
              </div>

              <div className="task-time">
                4:00 PM
              </div>

            </div>

          </div>

        </div>


        {/* Recent Notes */}

        <div className="dashboard-box">

          <div className="box-header">

            <div>
              <h2>Recent Notes</h2>
              <p>Your recently created notes</p>
            </div>

            <button className="view-button">
              View All
            </button>

          </div>


          <div className="notes-list">

            <div className="note-row">

              <div className="note-icon">
                N
              </div>

              <div>
                <strong>Normalization in DBMS</strong>
                <span>Database Management</span>
              </div>

            </div>


            <div className="note-row">

              <div className="note-icon">
                N
              </div>

              <div>
                <strong>React useState Hook</strong>
                <span>ReactJS</span>
              </div>

            </div>


            <div className="note-row">

              <div className="note-icon">
                N
              </div>

              <div>
                <strong>Java Collections</strong>
                <span>Java Programming</span>
              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;