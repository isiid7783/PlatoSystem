"use client";

import { useState } from "react";
import { api } from "../../lib/api";

export default function ApiKeys() {
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");

  async function save() {
    const token = localStorage.getItem("token");

    await api.post(
      "/apikeys",
      { provider, apiKey },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("API key saved");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Register API Key</h1>

      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
      </select>

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%" }}
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
