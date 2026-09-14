// Deterministic JSON evidence parsing. Throws Error('parse: ...') on failure
// so refresh records it as a format problem, never as empty evidence.
export function parseJsonEvidence(text: string, evidenceName: string): unknown {
  if (!text || text.trim() === '') throw new Error(`parse: empty evidence: ${evidenceName}`);
  try {
    return JSON.parse(text) as unknown;
  } catch (err) {
    throw new Error(`parse: invalid JSON in ${evidenceName}: ${(err as Error).message}`);
  }
}
