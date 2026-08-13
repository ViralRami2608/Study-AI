function Header() {
  return (
    <header className="header">

      {/* Left Side */}

      <div className="header-left">

        <h2>Dashboard</h2>

        <p>Welcome back to StudyAI</p>

      </div>


      {/* Search */}

      <div className="header-search">

        <input
          type="text"
          placeholder="Search anything..."
        />

      </div>


      {/* Right Side */}

      <div className="header-right">

        {/* Notification */}

        <button className="notification-btn">
          🔔
        </button>


        {/* Profile */}

        <div className="profile-mini">

          <div className="profile-avatar">
            S
          </div>

          <div className="profile-info">

            <strong>Student</strong>

            <span>Study Member</span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;