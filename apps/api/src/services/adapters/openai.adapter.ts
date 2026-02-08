import axios from "axios";
import { AIAdapter, AdapterResponse } from "./adapter.interface";
import { estimateTokens } from "../token.util";

export class OpenAIAdapter implements AIAdapter {
  constructor(private apiKey: string) {}

  async execute(prompt: string, model: string): Promise<AdapterResponse> {
    const start = Date.now();

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const latency = Date.now() - start;

    const content = response.data.choices[0].message.content;

    const inputTokens = estimateTokens(prompt);
    const outputTokens = estimateTokens(content);

    return {
      content,
      inputTokens,
      outputTokens,
      latencyMs: latency,
    };
  }
  
