import { OpenAIAdapter } from "./adapters/openai.adapter";
import { AnthropicAdapter } from "./adapters/anthropic.adapter";
import { calculateCost } from "./cost.engine";

export type RoutingMode = "cheapest" | "fastest" | "compare";

export interface RoutingResult {
  provider: string;
  model: string;
  content: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCostUsd: number;
}

export async function routeExecution(
  prompt: string,
  models: { provider: string; model: string }[],
  mode: RoutingMode,
  apiKeys: Record<string, string>
): Promise<RoutingResult[]> {

  const results: RoutingResult[] = [];

  for (const m of models) {
    let adapter;

    if (m.provider === "openai") {
      if (!apiKeys.openai) continue;
      adapter = new OpenAIAdapter(apiKeys.openai);
    } else if (m.provider === "anthropic") {
      if (!apiKeys.anthropic) continue;
      adapter = new AnthropicAdapter(apiKeys.anthropic);
    } else {
      continue;
    }

    const res = await adapter.execute(prompt, m.model);

    const totalTokens = res.inputTokens + res.outputTokens;
    const cost = calculateCost(m.model, res.inputTokens, res.outputTokens);

    results.push({
      provider: m.provider,
      model: m.model,
      content: res.content,
      inputTokens: res.inputTokens,
      outputTokens: res.outputTokens,
      totalTokens,
      latencyMs: res.latencyMs,
      estimatedCostUsd: cost,
    });
  }

  if (mode === "compare") return results;

  if (mode === "cheapest")
    return [results.sort((a, b) => a.estimatedCostUsd - b.estimatedCostUsd)[0]];

  if (mode === "fastest")
    return [results.sort((a, b) => a.latencyMs - b.latencyMs)[0]];

  return results;
}
