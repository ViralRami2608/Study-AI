import React from "react";

function Profile() {
  return (
    <main className="profile-page">

      {/* Page Header */}

      <div className="profile-header">
        <h1>My Profile</h1>

        <p>
          View and manage your profile information.
        </p>
      </div>


      {/* Profile Content */}

      <div className="profile-container">

        {/* Profile Top */}

        <div className="profile-top">

          <div className="profile-avatar">
            VR
          </div>

          <div className="profile-name">

            <h2>
              Student
            </h2>

            <p>
              StudyAI Student
            </p>

          </div>

          <button className="profile-edit-button">
            Edit Profile
          </button>

        </div>


        {/* Profile Information */}

        <div className="profile-info">

          <div className="profile-field">

            <label>
              Full Name
            </label>

            <div>
              Student
            </div>

          </div>


          <div className="profile-field">

            <label>
              Email
            </label>

            <div>
              student@example.com
            </div>

          </div>


          <div className="profile-field">

            <label>
              Course
            </label>

            <div>
              MCA
            </div>

          </div>


          <div className="profile-field">

            <label>
              Account Type
            </label>

            <div>
              Student
            </div>

          </div>

        </div>


        {/* Account Information */}

        <div className="profile-account">

          <h3>
            Account Information
          </h3>

          <p>
            Your account information and study data are
            securely managed by the Smart Study Assistant.
          </p>

        </div>

      </div>

    </main>
  );
}

export default Profile;