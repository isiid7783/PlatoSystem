"use client";

import { useState } from "react";
import { api } from "../lib/api";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<any>(null);

  async function run() {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/execute",
      {
        prompt,
        models: [
          { provider: "openai", model: "gpt-4o-mini" },
          { provider: "anthropic", model: "claude-3-haiku" }
        ],
        mode: "compare"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setResult(res.data);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Plato System</h1>

      <textarea
        rows={5}
        style={{ width: "100%" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={run}>Execute</button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
