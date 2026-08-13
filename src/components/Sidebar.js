function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">
        <h2>StudyAI</h2>
        <p>Smart Learning</p>
      </div>


      {/* Navigation */}

      <nav className="sidebar-nav">

        <div className="nav-item active">
          Dashboard
        </div>

        <div className="nav-item">
          AI Assistant
        </div>

        <div className="nav-item">
          Notes
        </div>

        <div className="nav-item">
          Study Planner
        </div>

        <div className="nav-item">
          Study Timer
        </div>

      </nav>


      {/* Bottom Menu */}

      <div className="sidebar-bottom">

        <div className="nav-item">
          Profile
        </div>

        <div className="nav-item">
          Settings
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;