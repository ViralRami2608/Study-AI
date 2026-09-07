import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      setErrorMessage(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">

      <div className="login-background-circle login-circle-one"></div>
      <div className="login-background-circle login-circle-two"></div>

      <section className="login-wrapper">

        {/* LEFT SIDE */}

        <div className="login-showcase">

          <div className="login-brand">

            <div className="login-brand-icon">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 3H8" />
                <path d="m15.007 5.008 3.987 3.986" />
                <path d="M20 15v4" />
                <path d="M21.174 6.813a2.82 2.82 0 0 0-3.986-3.987L3.842 16.175a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="M22 17h-4" />
                <path d="M4 5v4" />
                <path d="M6 7H2" />
                <path d="M9 2v2" />
              </svg>

            </div>

            <div>

              <h1>StudyAI</h1>

              <span>
                Smart Learning Assistant
              </span>

            </div>

          </div>

          <div className="login-showcase-content">

            <span className="login-badge">
              AI-POWERED LEARNING
            </span>

            <h2>
              Learn smarter.
              <br />
              Study better.
            </h2>

            <p>
              One place to manage your notes,
              study plans, focused sessions and
              AI-powered learning assistance.
            </p>

            <div className="login-simple-message">

              <span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 2v8l3-3 3 3V2" />
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>

              </span>

              <p>
                Your learning journey starts here.
              </p>

            </div>

          </div>

          <div className="login-showcase-footer">
            Smart Study Assistant
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-form-section">

          <div className="login-card">

            <div className="login-card-header">

              <span className="login-welcome">
                WELCOME BACK
              </span>

              <h2>
                Login to StudyAI
              </h2>

              <p>
                Continue your learning journey.
              </p>

            </div>

            <form onSubmit={handleLogin}>

              <div className="login-input-group">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="4"
                      />
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                    </svg>

                  </span>

                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              <div className="login-input-group">

                <label htmlFor="login-password">
                  Password
                </label>

                <div className="login-input-wrapper">

                  <span className="login-input-icon">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle
                        cx="12"
                        cy="16"
                        r="1"
                      />
                      <rect
                        x="3"
                        y="10"
                        width="18"
                        height="12"
                        rx="2"
                      />
                      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                    </svg>

                  </span>

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {errorMessage && (
                <div className="login-error">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}

                {!loading && (
                  <span className="login-arrow">
                    →
                  </span>
                )}

              </button>

            </form>

            <div className="login-security-note">

              <span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 13v3" />
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <circle
                    cx="12"
                    cy="11"
                    r="2"
                  />
                </svg>

              </span>

              <span>
                Secure account authentication
              </span>

            </div>

            <div className="login-register-link">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate("/register")
                }
              >
                Create Account
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Login;