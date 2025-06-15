import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // ✅ Login and get token
      const res = await api.post("auth/token/login/", {
        username,
        password,
      });

      const token = res.data.auth_token;
      localStorage.setItem("token", token);
      console.log("Token received:", token);

      // ✅ Get user profile
      const profile = await api.get("auth/users/me/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      console.log("User profile:", profile.data);

      // ✅ Redirect based on user role
      if (profile.data.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errData = error?.response?.data;
      console.error("Login error:", errData || error.message);
      alert("Login failed: " + (JSON.stringify(errData) || "Unknown error"));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
