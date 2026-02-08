export interface AdapterResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}

export interface AIAdapter {
  execute(prompt: string, model: string): Promise<AdapterResponse>;
}
