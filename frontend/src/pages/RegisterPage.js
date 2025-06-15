import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== rePassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("auth/users/", {
        username,
        email,
        password,
        re_password: rePassword,
      });

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Raw error:", error);

      if (error.response) {
        const contentType = error.response.headers["content-type"];

        if (contentType && contentType.includes("application/json")) {
          const errData = error.response.data;
          const messages = Object.entries(errData)
            .map(([field, msgs]) => {
              const safeMsgs = Array.isArray(msgs) ? msgs : [msgs];
              return `${field}: ${safeMsgs.join(", ")}`;
            })
            .join("\n");
          alert("Registration failed:\n" + messages);
        } else {
          alert("Registration failed: " + error.response.statusText);
        }
      } else {
        alert("Registration failed: Server not reachable");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Confirm Password"
        type="password"
        value={rePassword}
        onChange={(e) => setRePassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;
