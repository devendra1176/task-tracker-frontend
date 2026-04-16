import { useEffect, useState } from "react";
import { loginUser, signupUser } from "../services/authService";

function AuthPage({ onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessage("");
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  }, [authMode]);

  function validateForm() {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    if (authMode === "signup" && trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (authMode === "login") {
        const result = await loginUser({
          email: email.trim(),
          password,
        });

        const token = result?.data?.token || result?.token;

        if (!token) {
          throw new Error("No token received from server.");
        }

        onLogin(token);
      } else {
        await signupUser({
          username: username.trim(),
          email: email.trim(),
          password,
        });

        setMessage("Account created successfully. Please sign in.");
        setAuthMode("login");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="auth-page">
        <div className="auth-shell">
          <section className="auth-brand-panel">
            <div className="auth-brand-kicker">TASK TRACKER</div>

            <h1 className="auth-brand-title">
              Work with clarity.
              <br />
              Move with control.
            </h1>

            <p className="auth-brand-text">
              A focused task workspace for planning daily work, tracking progress,
              and finishing what matters without noise.
            </p>

            <div className="auth-brand-divider" />

            <div className="auth-brand-points">
              <div className="auth-brand-point">
                <div className="auth-brand-point-title">Capture</div>
                <div className="auth-brand-point-text">
                  Turn ideas and duties into clear tasks.
                </div>
              </div>

              <div className="auth-brand-point">
                <div className="auth-brand-point-title">Track</div>
                <div className="auth-brand-point-text">
                  See progress, priority, and due dates at a glance.
                </div>
              </div>

              <div className="auth-brand-point">
                <div className="auth-brand-point-title">Finish</div>
                <div className="auth-brand-point-text">
                  Stay consistent with a calmer daily workflow.
                </div>
              </div>
            </div>
          </section>

          <section className="auth-form-panel">
            <div className="auth-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to continue managing your tasks.</p>
            </div>

            <div className="auth-mode-switch">
              <button
                  type="button"
                  className={`auth-mode-btn ${authMode === "login" ? "active" : ""}`}
                  onClick={() => setAuthMode("login")}
              >
                Login
              </button>

              <button
                  type="button"
                  className={`auth-mode-btn ${authMode === "signup" ? "active" : ""}`}
                  onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </button>
            </div>

            {message && <div className="message message-success">{message}</div>}
            {error && <div className="message message-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              {authMode === "signup" && (
                  <div className="auth-field">
                    <label className="label" htmlFor="username">
                      Username
                    </label>
                    <input
                        id="username"
                        className="input"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        disabled={loading}
                    />
                  </div>
              )}

              <div className="auth-field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                    id="email"
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                />
              </div>

              <div className="auth-field">
                <label className="label" htmlFor="password">
                  Password
                </label>

                <div className="auth-password-row">
                  <input
                      id="password"
                      className="input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={loading}
                  />

                  <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="auth-helper-row">
                <button
                    type="button"
                    className="auth-helper-link"
                    onClick={() => setError("Forgot password is not available yet.")}
                >
                  Forgot password?
                </button>
              </div>

              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading
                    ? authMode === "login"
                        ? "Signing in..."
                        : "Creating account..."
                    : authMode === "login"
                        ? "Sign In"
                        : "Create Account"}
              </button>
            </form>

            <div className="auth-footer">
              {authMode === "login" ? "New here? " : "Already have an account? "}
              <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              >
                {authMode === "login" ? "Create an account" : "Sign in"}
              </button>
            </div>

            <div className="auth-note">Simple, secure, and focused task management.</div>
          </section>
        </div>
      </div>
  );
}

export default AuthPage;