import React, { useEffect, useState } from "react";

function StudyTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(2);

  useEffect(() => {
    let timer;

    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((previousSeconds) => previousSeconds - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setIsRunning(false);
      setSessions((previousSessions) => previousSessions + 1);
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds]);


  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };


  const startTimer = () => {
    setIsRunning(true);
  };


  const pauseTimer = () => {
    setIsRunning(false);
  };


  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(25 * 60);
  };


  const setStudyTime = (minutes) => {
    setIsRunning(false);
    setSeconds(minutes * 60);
  };


  return (
    <main className="timer-page">

      {/* Page Header */}

      <div className="timer-page-header">

        <div>
          <h1>Study Timer</h1>

          <p>
            Focus on your studies with a simple study timer.
          </p>
        </div>

      </div>


      {/* Timer Layout */}

      <div className="timer-layout">

        {/* Main Timer */}

        <section className="timer-card">

          <h2>
            Focus Session
          </h2>

          <p className="timer-mode">
            Study Time
          </p>


          {/* Timer */}

          <div className="timer-display">
            {formatTime()}
          </div>


          {/* Timer Controls */}

          <div className="timer-controls">

            {!isRunning ? (
              <button
                className="timer-start"
                onClick={startTimer}
              >
                Start
              </button>
            ) : (
              <button
                className="timer-pause"
                onClick={pauseTimer}
              >
                Pause
              </button>
            )}

            <button
              className="timer-reset"
              onClick={resetTimer}
            >
              Reset
            </button>

          </div>


          {/* Time Selection */}

          <div className="timer-options">

            <button
              onClick={() => setStudyTime(25)}
            >
              25 min
            </button>

            <button
              onClick={() => setStudyTime(45)}
            >
              45 min
            </button>

            <button
              onClick={() => setStudyTime(60)}
            >
              60 min
            </button>

          </div>

        </section>


        {/* Session Information */}

        <section className="session-card">

          <h2>
            Today's Study
          </h2>


          <div className="session-stat">

            <span>
              Completed Sessions
            </span>

            <strong>
              {sessions}
            </strong>

          </div>


          <div className="session-stat">

            <span>
              Current Session
            </span>

            <strong>
              {isRunning ? "Running" : "Paused"}
            </strong>

          </div>


          <div className="session-stat">

            <span>
              Default Focus Time
            </span>

            <strong>
              25 min
            </strong>

          </div>


          <div className="timer-tip">

            <h3>
              Study Tip
            </h3>

            <p>
              Keep your phone away and focus on one
              task until the timer finishes.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default StudyTimer;