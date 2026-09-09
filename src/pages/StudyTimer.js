import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

const API_URL =
  "http://localhost:5000/api/study-sessions";

const DEFAULT_HOURS = "00";
const DEFAULT_MINUTES = "25";
const DEFAULT_SECONDS = "00";

const DEFAULT_DURATION = 25 * 60;

function StudyTimer() {
  // =========================================
  // TIMER DURATION INPUTS
  // =========================================

  const [hours, setHours] =
    useState(DEFAULT_HOURS);

  const [minutes, setMinutes] =
    useState(DEFAULT_MINUTES);

  const [seconds, setSeconds] =
    useState(DEFAULT_SECONDS);

  // =========================================
  // TIMER STATE
  // =========================================

  const [timeLeft, setTimeLeft] =
    useState(DEFAULT_DURATION);

  const [isRunning, setIsRunning] =
    useState(false);

  const [hasStarted, setHasStarted] =
    useState(false);

  const [subject, setSubject] =
    useState("");

  // =========================================
  // SESSION REFS
  // =========================================

  const sessionStartRef =
    useRef(null);

  const lastResumeTimeRef =
    useRef(null);

  const accumulatedSecondsRef =
    useRef(0);

  const timerIntervalRef =
    useRef(null);

  const isRunningRef =
    useRef(false);

  const savingSessionRef =
    useRef(false);

  // =========================================
  // STUDY STATISTICS
  // =========================================

  const [todaySeconds, setTodaySeconds] =
    useState(0);

  const [previousDaySeconds, setPreviousDaySeconds] =
    useState(0);

  const [lastWeekSeconds, setLastWeekSeconds] =
    useState(0);

  const [lastMonthSeconds, setLastMonthSeconds] =
    useState(0);

  // =========================================
  // STUDY HISTORY
  // =========================================

  const [studySessions, setStudySessions] =
    useState([]);

  // =========================================
  // GET TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================
  // UNAUTHORIZED
  // =========================================

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =========================================
  // GET SELECTED DURATION
  // =========================================

  const getSelectedDuration = () => {
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const s = Number(seconds) || 0;

    return (
      h * 60 * 60 +
      m * 60 +
      s
    );
  };

  // =========================================
  // LOAD SUMMARY
  // =========================================

  const fetchSummary = useCallback(
    async () => {
      try {
        const token = getToken();

        const response = await fetch(
          `${API_URL}/summary`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load study statistics."
          );
        }

        setTodaySeconds(
          data.todaySeconds || 0
        );

        setPreviousDaySeconds(
          data.previousDaySeconds || 0
        );

        setLastWeekSeconds(
          data.lastWeekSeconds || 0
        );

        setLastMonthSeconds(
          data.lastMonthSeconds || 0
        );

      } catch (error) {
        console.log(
          "Study Statistics Error:",
          error.message
        );
      }
    },
    []
  );

  // =========================================
  // LOAD STUDY HISTORY
  // =========================================

  const fetchStudySessions =
    useCallback(
      async () => {
        try {
          const token = getToken();

          const response =
            await fetch(
              API_URL,
              {
                method: "GET",

                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          if (response.status === 401) {
            handleUnauthorized();
            return;
          }

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load study history."
            );
          }

          setStudySessions(
            Array.isArray(data)
              ? data
              : []
          );

        } catch (error) {
          console.log(
            "Study History Error:",
            error.message
          );
        }
      },
      []
    );

  // =========================================
  // INITIAL DATA
  // =========================================

  useEffect(() => {
    fetchSummary();
    fetchStudySessions();
  }, [
    fetchSummary,
    fetchStudySessions
  ]);

  // =========================================
  // TIMER INTERVAL
  // =========================================

  useEffect(() => {
    if (!isRunning) {
      if (timerIntervalRef.current) {
        clearInterval(
          timerIntervalRef.current
        );

        timerIntervalRef.current =
          null;
      }

      return;
    }

    timerIntervalRef.current =
      setInterval(() => {

        setTimeLeft(
          (previousTime) => {

            if (previousTime <= 1) {
              return 0;
            }

            return previousTime - 1;
          }
        );

      }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(
          timerIntervalRef.current
        );

        timerIntervalRef.current =
          null;
      }
    };

  }, [isRunning]);

  // =========================================
  // ADD CURRENT RUNNING TIME
  // =========================================

  const addCurrentRunningTime = () => {

    if (
      !lastResumeTimeRef.current
    ) {
      return;
    }

    const now = Date.now();

    const runningSeconds =
      Math.floor(
        (
          now -
          lastResumeTimeRef.current
        ) / 1000
      );

    if (runningSeconds > 0) {
      accumulatedSecondsRef.current +=
        runningSeconds;
    }

    lastResumeTimeRef.current =
      null;
  };

  // =========================================
  // SAVE STUDY SESSION
  // =========================================

  const saveStudySession =
    useCallback(
      async () => {

        if (
          !sessionStartRef.current ||
          savingSessionRef.current
        ) {
          return false;
        }

        savingSessionRef.current =
          true;

        try {

          const actualSeconds =
            accumulatedSecondsRef.current;

          if (actualSeconds <= 0) {
            return false;
          }

          const token = getToken();

          const response =
            await fetch(
              API_URL,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`
                },

                body: JSON.stringify({

                  subject:
                    subject.trim() ||
                    "General Study",

                  startTime:
                    sessionStartRef.current
                      .toISOString(),

                  endTime:
                    new Date().toISOString(),

                  duration:
                    actualSeconds
                })
              }
            );

          if (response.status === 401) {
            handleUnauthorized();
            return false;
          }

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to save study session."
            );
          }

          await fetchSummary();
          await fetchStudySessions();

          return true;

        } catch (error) {

          console.log(
            "Save Study Session Error:",
            error.message
          );

          return false;

        } finally {

          savingSessionRef.current =
            false;
        }
      },
      [
        subject,
        fetchSummary,
        fetchStudySessions
      ]
    );

  // =========================================
  // TIMER COMPLETED
  // =========================================

  useEffect(() => {

    if (
      timeLeft !== 0 ||
      !hasStarted
    ) {
      return;
    }

    const completeSession =
      async () => {

        // IMPORTANT:
        // Add the final running seconds
        // BEFORE turning isRunning off.

        addCurrentRunningTime();

        isRunningRef.current =
          false;

        setIsRunning(false);

        await saveStudySession();

        sessionStartRef.current =
          null;

        lastResumeTimeRef.current =
          null;

        accumulatedSecondsRef.current =
          0;

        setHasStarted(false);

        setTimeLeft(
          getSelectedDuration()
        );
      };

    completeSession();

  }, [
    timeLeft,
    hasStarted,
    saveStudySession,
    hours,
    minutes,
    seconds
  ]);

  // =========================================
  // START / RESUME
  // =========================================

  const handleStart = () => {

    const selectedDuration =
      getSelectedDuration();

    if (selectedDuration <= 0) {

      alert(
        "Please enter a study duration."
      );

      return;
    }

    if (!subject.trim()) {

      alert(
        "Please enter what you are studying."
      );

      return;
    }

    // FIRST START

    if (!hasStarted) {

      sessionStartRef.current =
        new Date();

      lastResumeTimeRef.current =
        Date.now();

      accumulatedSecondsRef.current =
        0;

      setTimeLeft(
        selectedDuration
      );

      setHasStarted(true);

      isRunningRef.current =
        true;

      setIsRunning(true);

      return;
    }

    // RESUME

    if (!isRunning) {

      lastResumeTimeRef.current =
        Date.now();

      isRunningRef.current =
        true;

      setIsRunning(true);
    }
  };

  // =========================================
  // PAUSE
  // =========================================

  const handlePause = () => {

    if (
      !isRunningRef.current ||
      !lastResumeTimeRef.current
    ) {
      return;
    }

    addCurrentRunningTime();

    isRunningRef.current =
      false;

    setIsRunning(false);
  };

  // =========================================
  // END & SAVE
  // =========================================

  const handleEndAndSave =
    async () => {

      if (!hasStarted) {
        return;
      }

      // Capture the currently running
      // portion before stopping.

      if (
        isRunningRef.current
      ) {
        addCurrentRunningTime();
      }

      isRunningRef.current =
        false;

      setIsRunning(false);

      await saveStudySession();

      sessionStartRef.current =
        null;

      lastResumeTimeRef.current =
        null;

      accumulatedSecondsRef.current =
        0;

      setHasStarted(false);

      setTimeLeft(
        getSelectedDuration()
      );
    };

  // =========================================
  // RESET
  // =========================================

  const handleReset = async () => {

    if (hasStarted) {

      const shouldSave =
        window.confirm(
          "Do you want to save the study time before resetting?"
        );

      if (shouldSave) {
        await handleEndAndSave();
        return;
      }

      isRunningRef.current =
        false;

      setIsRunning(false);

      sessionStartRef.current =
        null;

      lastResumeTimeRef.current =
        null;

      accumulatedSecondsRef.current =
        0;

      setHasStarted(false);

      setTimeLeft(
        getSelectedDuration()
      );

      return;
    }

    setTimeLeft(
      getSelectedDuration()
    );
  };

  // =========================================
  // DELETE STUDY SESSION
  // =========================================

  const handleDeleteSession =
    async (sessionId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this study session?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        const token = getToken();

        const response =
          await fetch(
            `${API_URL}/${sessionId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete study session."
          );
        }

        await fetchStudySessions();
        await fetchSummary();

      } catch (error) {

        console.log(
          "Delete Study Session Error:",
          error.message
        );

        alert(error.message);
      }
    };

  // =========================================
  // DURATION CHANGE
  // =========================================

  const updateDuration = (
    type,
    value
  ) => {

    if (hasStarted) {
      return;
    }

    let numericValue =
      value.replace(/\D/g, "");

    if (numericValue === "") {
      numericValue = "0";
    }

    if (type === "hours") {

      const finalValue =
        Math.min(
          Number(numericValue),
          99
        )
          .toString()
          .padStart(2, "0");

      setHours(finalValue);
    }

    if (type === "minutes") {

      const finalValue =
        Math.min(
          Number(numericValue),
          59
        )
          .toString()
          .padStart(2, "0");

      setMinutes(finalValue);
    }

    if (type === "seconds") {

      const finalValue =
        Math.min(
          Number(numericValue),
          59
        )
          .toString()
          .padStart(2, "0");

      setSeconds(finalValue);
    }
  };

  // =========================================
  // FORMAT TIMER
  // =========================================

  const formatTime = (
    totalSeconds
  ) => {

    const h = Math.floor(
      totalSeconds / 3600
    );

    const m = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const s =
      totalSeconds % 60;

    if (h > 0) {

      return `${String(h).padStart(
        2,
        "0"
      )}:${String(m).padStart(
        2,
        "0"
      )}:${String(s).padStart(
        2,
        "0"
      )}`;
    }

    return `${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(
      2,
      "0"
    )}`;
  };

  // =========================================
  // FORMAT STUDY TIME
  // =========================================

  const formatStudyTime = (
    totalSeconds
  ) => {

    const h = Math.floor(
      totalSeconds / 3600
    );

    const m = Math.floor(
      (totalSeconds % 3600) / 60
    );

    if (h > 0) {
      return `${h}h ${m}m`;
    }

    return `${m}m`;
  };

  // =========================================
  // FORMAT SESSION DURATION
  // =========================================

  const formatSessionDuration = (
    totalSeconds
  ) => {

    const h = Math.floor(
      totalSeconds / 3600
    );

    const m = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const s =
      totalSeconds % 60;

    if (h > 0) {
      return `${h}h ${m}m`;
    }

    if (m > 0) {
      return `${m}m`;
    }

    return `${s}s`;
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatSessionDate = (
    dateValue
  ) => {

    const date =
      new Date(dateValue);

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );
  };

  // =========================================
  // FORMAT START TIME
  // =========================================

  const formatSessionStartTime = (
    dateValue
  ) => {

    const date =
      new Date(dateValue);

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit"
      }
    );
  };

  // =========================================
  // STATUS
  // =========================================

  const getStatusMessage = () => {

    if (isRunning) {
      return "Study session is in progress...";
    }

    if (hasStarted) {
      return "Timer paused. Continue when ready.";
    }

    return "Ready to start your study session";
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="timer-page">

      {/* HEADER */}

      <div className="timer-header">

        <div>

          <h1>
            Study Timer
          </h1>

          <p>
            Track your actual study time
            and build consistent habits.
          </p>

        </div>

      </div>


      {/* TIMER CONTAINER */}

      <div className="timer-container">

        {/* SUBJECT */}

        <div className="timer-subject">

          <label>
            What are you studying?
          </label>

          <input
            type="text"
            value={subject}
            onChange={(event) =>
              setSubject(
                event.target.value
              )
            }
            placeholder="Enter subject or topic"
            disabled={hasStarted}
          />

        </div>


        {/* DURATION */}

        <div className="timer-duration">

          <label>
            Timer Duration
          </label>

          <div className="timer-duration-inputs">

            <div>

              <input
                type="number"
                min="0"
                max="99"
                value={hours}
                onChange={(event) =>
                  updateDuration(
                    "hours",
                    event.target.value
                  )
                }
                disabled={hasStarted}
              />

              <span>
                Hours
              </span>

            </div>


            <div>

              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(event) =>
                  updateDuration(
                    "minutes",
                    event.target.value
                  )
                }
                disabled={hasStarted}
              />

              <span>
                Minutes
              </span>

            </div>


            <div>

              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(event) =>
                  updateDuration(
                    "seconds",
                    event.target.value
                  )
                }
                disabled={hasStarted}
              />

              <span>
                Seconds
              </span>

            </div>

          </div>

        </div>


        {/* TIMER DISPLAY */}

        <div className="timer-display">

          <span>
            {formatTime(timeLeft)}
          </span>

        </div>


        {/* STATUS */}

        <p className="timer-status">
          {getStatusMessage()}
        </p>


        {/* BUTTONS */}

        <div className="timer-buttons">

          <button
            className="timer-start"
            onClick={handleStart}
            disabled={isRunning}
          >
            {hasStarted
              ? "Resume"
              : "Start"}
          </button>


          <button
            className="timer-pause"
            onClick={handlePause}
            disabled={!isRunning}
          >
            Pause
          </button>


          <button
            className="timer-end"
            onClick={handleEndAndSave}
            disabled={!hasStarted}
          >
            End & Save
          </button>


          <button
            className="timer-reset"
            onClick={handleReset}
          >
            Reset
          </button>

        </div>


        {/* STUDY STATISTICS */}

        <div className="timer-info">

          <div className="timer-info-card">

            <span>
              Today's Study
            </span>

            <strong>
              {formatStudyTime(
                todaySeconds
              )}
            </strong>

          </div>


          <div className="timer-info-card">

            <span>
              Previous Day
            </span>

            <strong>
              {formatStudyTime(
                previousDaySeconds
              )}
            </strong>

          </div>


          <div className="timer-info-card">

            <span>
              Last Week
            </span>

            <strong>
              {formatStudyTime(
                lastWeekSeconds
              )}
            </strong>

          </div>


          <div className="timer-info-card">

            <span>
              Last Month
            </span>

            <strong>
              {formatStudyTime(
                lastMonthSeconds
              )}
            </strong>

          </div>

        </div>


        {/* STUDY HISTORY */}

        <div className="study-history">

          <div className="study-history-header">

            <div>

              <h2>
                Study History
              </h2>

              <p>
                Your recorded study sessions
              </p>

            </div>

          </div>


          <div className="study-history-list">

            {studySessions.length === 0 ? (

              <div className="study-history-empty">
                No study sessions recorded yet.
              </div>

            ) : (

              studySessions
                .slice(0, 10)
                .map((session) => (

                  <div
                    className="study-history-row"
                    key={session._id}
                  >

                    <div className="study-history-subject">

                      <strong>
                        {session.subject}
                      </strong>

                      <span>
                        {formatSessionDate(
                          session.startTime
                        )}
                      </span>

                    </div>


                    <div className="study-history-time">

                      {/* Delete icon before time */}

                      <button
                        type="button"
                        className="study-history-delete"
                        onClick={() =>
                          handleDeleteSession(
                            session._id
                          )
                        }
                        aria-label="Delete study session"
                        title="Delete study session"
                      >
                        🗑
                      </button>


                      <span>
                        {formatSessionStartTime(
                          session.startTime
                        )}
                      </span>


                      <strong>
                        {formatSessionDuration(
                          session.duration
                        )}
                      </strong>

                    </div>

                  </div>

                ))

            )}

          </div>

        </div>

      </div>

    </main>
  );
}

export default StudyTimer;