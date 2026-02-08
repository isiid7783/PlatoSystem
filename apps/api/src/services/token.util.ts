export function estimateTokens(text: string): number {
  // 暫定ロジック: 4文字 ≒ 1トークン
  return Math.ceil(text.length / 4);
}
