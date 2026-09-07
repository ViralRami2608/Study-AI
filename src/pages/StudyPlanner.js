import React, { useEffect, useState } from "react";

function StudyPlanner() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [filter, setFilter] = useState("today");

  const [formData, setFormData] = useState({
    subject: "",
    task: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "Pending"
  });

  const API_URL = "http://localhost:5000/api/study-plans";

  // =========================================
  // GET TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================
  // FETCH STUDY PLANS
  // =========================================

  const fetchPlans = async () => {
    try {
      const token = getToken();

      const response = await fetch(API_URL, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch study plans."
        );
      }

      setPlans(data);
    } catch (error) {
      console.log("Fetch Study Plans Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD PLANS
  // =========================================

  useEffect(() => {
    fetchPlans();
  }, []);

  // =========================================
  // FORM INPUT
  // =========================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const handleAddTask = () => {
    setEditingPlan(null);

    setFormData({
      subject: "",
      task: "",
      date: "",
      startTime: "",
      endTime: "",
      status: "Pending"
    });

    setShowForm(true);
  };

  // =========================================
  // OPEN EDIT FORM
  // =========================================

  const handleEditTask = (plan) => {
    setEditingPlan(plan);

    setFormData({
      subject: plan.subject || "",
      task: plan.task || "",
      date: plan.date
        ? new Date(plan.date).toISOString().split("T")[0]
        : "",
      startTime: plan.startTime || "",
      endTime: plan.endTime || "",
      status: plan.status || "Pending"
    });

    setShowForm(true);
  };

  // =========================================
  // CLOSE FORM
  // =========================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  // =========================================
  // CREATE / UPDATE
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();

      const url = editingPlan
        ? `${API_URL}/${editingPlan._id}`
        : API_URL;

      const method = editingPlan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      setShowForm(false);
      setEditingPlan(null);

      setFormData({
        subject: "",
        task: "",
        date: "",
        startTime: "",
        endTime: "",
        status: "Pending"
      });

      fetchPlans();

    } catch (error) {
      alert(error.message);
    }
  };

  // =========================================
  // TOGGLE COMPLETED
  // =========================================

  const handleToggleStatus = async (plan) => {
    try {
      const token = getToken();

      const newStatus =
        plan.status === "Completed"
          ? "Pending"
          : "Completed";

      const response = await fetch(
        `${API_URL}/${plan._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            subject: plan.subject,
            task: plan.task,
            date: plan.date,
            startTime: plan.startTime,
            endTime: plan.endTime,
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task."
        );
      }

      fetchPlans();

    } catch (error) {
      alert(error.message);
    }
  };

  // =========================================
  // DELETE TASK
  // =========================================

  const handleDeleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete task."
        );
      }

      fetchPlans();

    } catch (error) {
      alert(error.message);
    }
  };

  // =========================================
  // FORMAT TIME
  // =========================================

  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    const [hours, minutes] = time.split(":");

    const hour = parseInt(hours, 10);

    const period = hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 === 0 ? 12 : hour % 12;

    return `${displayHour}:${minutes} ${period}`;
  };

  // =========================================
  // DATE HELPERS
  // =========================================

  const getTodayDate = () => {
    const today = new Date();

    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return tomorrow.toISOString().split("T")[0];
  };

  const isThisWeek = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);

    const startOfWeek = new Date(today);

    startOfWeek.setDate(
      today.getDate() - today.getDay()
    );

    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(
      startOfWeek.getDate() + 6
    );

    endOfWeek.setHours(23, 59, 59, 999);

    return (
      date >= startOfWeek &&
      date <= endOfWeek
    );
  };

  // =========================================
  // FILTER PLANS
  // =========================================

  const filteredPlans = plans.filter((plan) => {
    if (filter === "today") {
      return plan.date?.split("T")[0] === getTodayDate();
    }

    if (filter === "tomorrow") {
      return (
        plan.date?.split("T")[0] ===
        getTomorrowDate()
      );
    }

    if (filter === "week") {
      return isThisWeek(plan.date);
    }

    return true;
  });

  // =========================================
  // SUMMARY
  // =========================================

  const totalTasks = plans.length;

  const completedTasks = plans.filter(
    (plan) => plan.status === "Completed"
  ).length;

  const pendingTasks = plans.filter(
    (plan) => plan.status === "Pending"
  ).length;

  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="planner-page">

      {/* Page Header */}

      <div className="planner-header">

        <div>
          <h1>Study Planner</h1>

          <p>
            Plan and manage your daily study tasks.
          </p>
        </div>

        <button
          className="planner-add-button"
          onClick={handleAddTask}
        >
          + Add Task
        </button>

      </div>


      {/* Planner Summary */}

      <div className="planner-summary">

        <div className="planner-summary-card">
          <span>Total Tasks</span>
          <strong>{totalTasks}</strong>
        </div>

        <div className="planner-summary-card">
          <span>Completed</span>
          <strong>{completedTasks}</strong>
        </div>

        <div className="planner-summary-card">
          <span>Pending</span>
          <strong>{pendingTasks}</strong>
        </div>

      </div>


      {/* Add / Edit Form */}

      {showForm && (
        <div className="planner-form">

          <h2>
            {editingPlan
              ? "Edit Study Task"
              : "Add Study Task"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div>
              <label>Subject</label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. DBMS"
                required
              />
            </div>


            <div>
              <label>Task</label>

              <input
                type="text"
                name="task"
                value={formData.task}
                onChange={handleInputChange}
                placeholder="e.g. Study Normalization"
                required
              />
            </div>


            <div>
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>


            <div>
              <label>Start Time</label>

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>


            <div>
              <label>End Time</label>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>


            <div>
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>


            <div className="planner-form-buttons">

              <button
                type="submit"
              >
                {editingPlan
                  ? "Update Task"
                  : "Save Task"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* Today's Tasks */}

      <div className="planner-section">

        <div className="planner-section-header">

          <h2>Study Tasks</h2>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
          >
            <option value="today">
              Today
            </option>

            <option value="tomorrow">
              Tomorrow
            </option>

            <option value="week">
              This Week
            </option>

            <option value="all">
              All Tasks
            </option>
          </select>

        </div>


        {/* Loading */}

        {loading && (
          <div className="planner-empty">
            Loading study tasks...
          </div>
        )}


        {/* No Tasks */}

        {!loading &&
          filteredPlans.length === 0 && (
            <div className="planner-empty">
              No study tasks found.
            </div>
          )}


        {/* Tasks */}

        {!loading &&
          filteredPlans.map((plan) => {

            const completed =
              plan.status === "Completed";

            return (
              <div
                className="planner-task"
                key={plan._id}
              >

                <button
                  className={`task-check ${
                    completed ? "completed" : ""
                  }`}
                  onClick={() =>
                    handleToggleStatus(plan)
                  }
                >
                  {completed ? "✓" : ""}
                </button>


                <div className="task-details">

                  <h3>{plan.task}</h3>

                  <p>
                    {plan.subject}
                    {" • "}
                    {formatTime(plan.startTime)}
                    {" - "}
                    {formatTime(plan.endTime)}
                  </p>

                </div>


                <span
                  className={`task-status ${
                    completed
                      ? "completed-status"
                      : "pending-status"
                  }`}
                >
                  {plan.status}
                </span>


                <button
                  onClick={() =>
                    handleEditTask(plan)
                  }
                  className="planner-edit-button"
                >
                  Edit
                </button>


                <button
                  onClick={() =>
                    handleDeleteTask(plan._id)
                  }
                  className="planner-delete-button"
                >
                  Delete
                </button>

              </div>
            );
          })}

      </div>

    </main>
  );
}

export default StudyPlanner;