export interface PlatoResponse {
  provider: string;
  model: string;
  content: string;

  inputTokens: number;
  outputTokens: number;
  totalTokens: number;

  latencyMs: number;
  estimatedCostUsd: number;
}
