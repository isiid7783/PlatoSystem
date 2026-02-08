import { PRICING_TABLE } from "../config/pricing.config";

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const pricing = PRICING_TABLE[model];

  if (!pricing) {
    throw new Error(`Pricing not found for model: ${model}`);
  }

  const inputCost = (inputTokens / 1000) * pricing.inputPer1k;
  const outputCost = (outputTokens / 1000) * pricing.outputPer1k;

  return parseFloat((inputCost + outputCost).toFixed(6));
}
