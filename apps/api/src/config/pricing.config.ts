export interface ModelPricing {
  inputPer1k: number;
  outputPer1k: number;
}

export const PRICING_TABLE: Record<string, ModelPricing> = {
  "gpt-4o-mini": {
    inputPer1k: 0.00015,
    outputPer1k: 0.0006,
  },
  "gpt-4o": {
    inputPer1k: 0.005,
    outputPer1k: 0.015,
  },
  "claude-3-haiku": {
    inputPer1k: 0.00025,
    outputPer1k: 0.00125,
  },
  "claude-3-sonnet": {
    inputPer1k: 0.003,
    outputPer1k: 0.015,
  },
};
