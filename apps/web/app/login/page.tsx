"use client";

import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await axios.post(
      "http://localhost:3001/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);
    alert("Logged in");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
