import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [notes, setNotes] = useState([]);

  const [todayStudy, setTodayStudy] = useState(0);
  const [previousDayStudy, setPreviousDayStudy] = useState(0);
  const [lastWeekStudy, setLastWeekStudy] = useState(0);
  const [lastMonthStudy, setLastMonthStudy] = useState(0);

  const [loading, setLoading] = useState(true);

  // =========================================
  // API URLS
  // =========================================

  const STUDY_PLAN_API =
    "http://localhost:5000/api/study-plans";

  const NOTES_API =
    "http://localhost:5000/api/notes";

  const SUMMARY_API =
    "http://localhost:5000/api/study-sessions/summary";

  // =========================================
  // TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================
  // TODAY
  // =========================================

  const getTodayDate = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

  // =========================================
  // FORMAT STUDY TIME
  // =========================================

  const formatStudyTime = (seconds) => {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  };

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // =====================================
        // STUDY PLANS
        // =====================================

        const plansResponse = await fetch(
          STUDY_PLAN_API,
          {
            method: "GET",
            headers
          }
        );

        if (plansResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        const plansData =
          await plansResponse.json();

        if (plansResponse.ok) {
          setPlans(
            Array.isArray(plansData)
              ? plansData
              : []
          );
        }

        // =====================================
        // NOTES
        // =====================================

        const notesResponse = await fetch(
          NOTES_API,
          {
            method: "GET",
            headers
          }
        );

        if (notesResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        const notesData =
          await notesResponse.json();

        if (notesResponse.ok) {
          setNotes(
            Array.isArray(notesData)
              ? notesData
              : []
          );
        }

        // =====================================
        // STUDY SUMMARY
        // =====================================

        const summaryResponse =
          await fetch(
            SUMMARY_API,
            {
              method: "GET",
              headers
            }
          );

        if (summaryResponse.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        const summaryData =
          await summaryResponse.json();

        if (summaryResponse.ok) {
          setTodayStudy(
            summaryData.todaySeconds || 0
          );

          setPreviousDayStudy(
            summaryData.previousDaySeconds || 0
          );

          setLastWeekStudy(
            summaryData.lastWeekSeconds || 0
          );

          setLastMonthStudy(
            summaryData.lastMonthSeconds || 0
          );
        }

      } catch (error) {
        console.log(
          "Dashboard Error:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =========================================
  // TODAY'S TASKS
  // =========================================

  const todayDate = getTodayDate();

  const todayPlans = plans
    .filter((plan) => {
      return (
        plan.date?.split("T")[0] ===
        todayDate
      );
    })
    .sort((a, b) => {
      return (
        (a.startTime || "").localeCompare(
          b.startTime || ""
        )
      );
    });

  // =========================================
  // COUNTS
  // =========================================

  const totalTasks = plans.length;

  const completedTasks = plans.filter(
    (plan) =>
      plan.status === "Completed"
  ).length;

  const pendingTasks = plans.filter(
    (plan) =>
      plan.status === "Pending"
  ).length;

  const totalNotes = notes.length;

  // =========================================
  // FORMAT TASK TIME
  // =========================================

  const formatTaskTime = (time) => {
    if (!time) {
      return "";
    }

    const [hours, minutes] =
      time.split(":");

    const hour =
      parseInt(hours, 10);

    const period =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 === 0
        ? 12
        : hour % 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="dashboard">

      {/* =================================
          WELCOME
      ================================= */}

      <section className="welcome-section">

        <h1>
          Welcome to StudyAI
        </h1>

        <p>
          Manage your study activities
          and stay productive.
        </p>

      </section>


      {/* =================================
          STATISTICS
      ================================= */}

      <section className="stats-container">

        <div className="stat-card">

          <div className="stat-icon">
            T
          </div>

          <div>

            <p>
              Total Tasks
            </p>

            <h2>
              {loading
                ? "..."
                : totalTasks}
            </h2>

            <span>
              {loading
                ? "Loading..."
                : `${pendingTasks} pending`}
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            C
          </div>

          <div>

            <p>
              Completed
            </p>

            <h2>
              {loading
                ? "..."
                : completedTasks}
            </h2>

            <span>
              All study plans
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            H
          </div>

          <div>

            <p>
              Study Hours
            </p>

            <h2>
              {loading
                ? "..."
                : formatStudyTime(
                    lastWeekStudy
                  )}
            </h2>

            <span>
              Last week
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            N
          </div>

          <div>

            <p>
              Total Notes
            </p>

            <h2>
              {loading
                ? "..."
                : totalNotes}
            </h2>

            <span>
              All subjects
            </span>

          </div>

        </div>

      </section>


      {/* =================================
          STUDY PROGRESS
      ================================= */}

      <section className="dashboard-box dashboard-study-progress">

        <div className="box-header">

          <div>

            <h2>
              Study Progress
            </h2>

            <p>
              Your recorded study time
            </p>

          </div>

          <button
            className="view-button"
            onClick={() =>
              navigate("/study-timer")
            }
          >
            Open Timer
          </button>

        </div>


        <div className="study-progress-grid">

          {/* Today */}

          <div className="study-progress-card">

            <span>
              Today's Study
            </span>

            <strong>
              {loading
                ? "..."
                : formatStudyTime(
                    todayStudy
                  )}
            </strong>

          </div>


          {/* Previous Day */}

          <div className="study-progress-card">

            <span>
              Previous Day
            </span>

            <strong>
              {loading
                ? "..."
                : formatStudyTime(
                    previousDayStudy
                  )}
            </strong>

          </div>


          {/* Last Week */}

          <div className="study-progress-card">

            <span>
              Last Week
            </span>

            <strong>
              {loading
                ? "..."
                : formatStudyTime(
                    lastWeekStudy
                  )}
            </strong>

          </div>


          {/* Last Month */}

          <div className="study-progress-card">

            <span>
              Last Month
            </span>

            <strong>
              {loading
                ? "..."
                : formatStudyTime(
                    lastMonthStudy
                  )}
            </strong>

          </div>

        </div>

      </section>


      {/* =================================
          MAIN DASHBOARD GRID
      ================================= */}

      <section className="dashboard-grid">


        {/* =================================
            TODAY'S TASKS
        ================================= */}

        <div className="dashboard-box">

          <div className="box-header">

            <div>

              <h2>
                Today's Tasks
              </h2>

              <p>
                Your study tasks for today
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/study-planner")
              }
            >
              View All
            </button>

          </div>


          <div className="task-list">

            {loading && (
              <div className="task-row">

                <div className="task-details">

                  <strong>
                    Loading tasks...
                  </strong>

                </div>

              </div>
            )}


            {!loading &&
              todayPlans.length === 0 && (
                <div className="task-row">

                  <div className="task-details">

                    <strong>
                      No tasks for today
                    </strong>

                    <span>
                      Add a task from
                      Study Planner
                    </span>

                  </div>

                </div>
              )}


            {!loading &&
              todayPlans
                .slice(0, 5)
                .map((plan) => {

                  const completed =
                    plan.status ===
                    "Completed";

                  return (
                    <div
                      className="task-row"
                      key={plan._id}
                    >

                      <div
                        className={`task-check ${
                          completed
                            ? "completed"
                            : ""
                        }`}
                      >
                        {completed
                          ? "✓"
                          : ""}
                      </div>


                      <div className="task-details">

                        <strong>
                          {plan.task}
                        </strong>

                        <span>
                          {plan.subject}
                        </span>

                      </div>


                      <div className="task-time">

                        {formatTaskTime(
                          plan.startTime
                        )}

                      </div>

                    </div>
                  );
                })}

          </div>

        </div>


        {/* =================================
            RECENT NOTES
        ================================= */}

        <div className="dashboard-box">

          <div className="box-header">

            <div>

              <h2>
                Recent Notes
              </h2>

              <p>
                Your recently created notes
              </p>

            </div>

            <button
              className="view-button"
              onClick={() =>
                navigate("/notes")
              }
            >
              View All
            </button>

          </div>


          <div className="notes-list">

            {loading && (
              <div className="note-row">

                <div>

                  <strong>
                    Loading notes...
                  </strong>

                </div>

              </div>
            )}


            {!loading &&
              notes.length === 0 && (
                <div className="note-row">

                  <div>

                    <strong>
                      No notes yet
                    </strong>

                    <span>
                      Create your first note
                    </span>

                  </div>

                </div>
              )}


            {!loading &&
              notes
                .slice(0, 5)
                .map((note) => (

                  <div
                    className="note-row"
                    key={note._id}
                  >

                    <div className="note-icon">
                      N
                    </div>

                    <div>

                      <strong>
                        {note.title}
                      </strong>

                      <span>
                        {note.subject}
                      </span>

                    </div>

                  </div>

                ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;