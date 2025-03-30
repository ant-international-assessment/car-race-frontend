import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import { loginAPI } from "../utils/api";

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (customEmail, customPassword) => {
    try {
      const rawEmail = customEmail ?? email;
      const rawPassword = customPassword ?? password;
      const finalEmail = rawEmail.includes("@")
        ? rawEmail
        : `${rawEmail}@test.com`;

      const res = await loginAPI(finalEmail, rawPassword);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login failed");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: finalEmail }));
      localStorage.setItem("email", finalEmail);

      setUser({ email: finalEmail });
      navigate("/start");
    } catch (err) {
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">🔐 Log In</h2>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth-button" onClick={() => handleLogin()}>
          Log In
        </button>

        <button
          className="auth-button test-login"
          onClick={() => handleLogin("khoinguyen1", "123123")}
        >
          🔑 Login with Test Account
        </button>

        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
