import axios from "axios";
import { AIAdapter, AdapterResponse } from "./adapter.interface";
import { estimateTokens } from "../token.util";

export class AnthropicAdapter implements AIAdapter {
  constructor(private apiKey: string) {}

  async execute(prompt: string, model: string): Promise<AdapterResponse> {
    const start = Date.now();

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    );

    const latency = Date.now() - start;

    const content = response.data.content[0].text;

    const inputTokens = estimateTokens(prompt);
    const outputTokens = estimateTokens(content);

    return {
      content,
      inputTokens,
      outputTokens,
      latencyMs: latency,
    };
  }
}
