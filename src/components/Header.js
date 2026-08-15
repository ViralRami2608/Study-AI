import React from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/ai-assistant": "AI Study Assistant",
    "/notes": "My Notes",
    "/study-planner": "Study Planner",
    "/study-timer": "Study Timer",
    "/profile": "My Profile",
    "/settings": "Settings",
  };

  const currentTitle =
    pageTitles[location.pathname] || "Smart Study Assistant";

  return (
    <header className="app-header">

      {/* Current Page */}

      <div className="header-page-title">
        <h2>{currentTitle}</h2>
      </div>


      {/* Right Side */}

      <div className="header-right">

        <div className="header-user">

          <div className="header-avatar">
            VR
          </div>

          <div className="header-user-info">

            <span className="header-user-name">
              Student
            </span>

            <span className="header-user-role">
              Student
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;