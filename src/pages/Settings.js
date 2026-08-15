import React from "react";

function Settings() {
  return (
    <main className="settings-page">

      {/* Page Header */}

      <div className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage your account and study preferences.
        </p>
      </div>


      {/* Settings Container */}

      <div className="settings-container">

        {/* Account Settings */}

        <section className="settings-section">

          <h2>Account Settings</h2>

          <div className="settings-row">

            <div>
              <h3>Email Notifications</h3>

              <p>
                Receive notifications about your study activities.
              </p>
            </div>

            <label className="settings-switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>

          </div>


          <div className="settings-row">

            <div>
              <h3>Study Reminders</h3>

              <p>
                Get reminders for your planned study tasks.
              </p>
            </div>

            <label className="settings-switch">
              <input type="checkbox" defaultChecked />
              <span></span>
            </label>

          </div>

        </section>


        {/* Study Preferences */}

        <section className="settings-section">

          <h2>Study Preferences</h2>

          <div className="settings-field">

            <label>
              Default Study Session
            </label>

            <select defaultValue="25">

              <option value="25">
                25 Minutes
              </option>

              <option value="30">
                30 Minutes
              </option>

              <option value="45">
                45 Minutes
              </option>

              <option value="60">
                60 Minutes
              </option>

            </select>

          </div>


          <div className="settings-field">

            <label>
              Default Subject
            </label>

            <select defaultValue="dsa">

              <option value="dsa">
                Data Structures & Algorithms
              </option>

              <option value="dbms">
                Database Management System
              </option>

              <option value="javascript">
                JavaScript
              </option>

              <option value="react">
                React.js
              </option>

            </select>

          </div>

        </section>


        {/* Save Button */}

        <div className="settings-actions">

          <button className="settings-save-button">
            Save Changes
          </button>

        </div>

      </div>

    </main>
  );
}

export default Settings;