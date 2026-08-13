import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <h2>StudyAI</h2>

        <p>Smart Learning</p>

      </div>


      {/* Main Navigation */}

      <nav className="sidebar-nav">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>


        <NavLink
          to="/ai-assistant"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          AI Assistant
        </NavLink>


        <NavLink
          to="/notes"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Notes
        </NavLink>


        <NavLink
          to="/study-planner"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Study Planner
        </NavLink>


        <NavLink
          to="/study-timer"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Study Timer
        </NavLink>

      </nav>


      {/* Bottom Navigation */}

      <div className="sidebar-bottom">

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Profile
        </NavLink>


        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Settings
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;