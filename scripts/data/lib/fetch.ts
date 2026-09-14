// Polite HTTP fetching for collectors.
//
// Error convention shared by the pipeline:
// - fetch failures throw Error('fetch: ...')  -> diff maps these to SOURCE_UNAVAILABLE
// - content that cannot be parsed throws Error('parse: ...') -> SOURCE_CHANGED
// Refresh records the message verbatim in the run manifest.

export interface FetchOptions {
  timeoutMs?: number;
  retries?: number;
  maxBytes?: number;
}

const DEFAULTS = {
  timeoutMs: 15000,
  retries: 2,
  maxBytes: 5 * 1024 * 1024,
};

export const CIVIC_USER_AGENT =
  'BetterSanCarlos-CivicRefresh/1.0 (+https://github.com/edisonmalasan/bettersancarlos)';

export async function fetchText(url: string, options: FetchOptions = {}): Promise<string> {
  const { timeoutMs, retries, maxBytes } = { ...DEFAULTS, ...options };
  let lastErr: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'user-agent': CIVIC_USER_AGENT, accept: 'text/html,application/json,text/*' },
        });
        if (!res.ok) throw new Error(`fetch: HTTP ${res.status} for ${url}`);
        const text = await res.text();
        if (text.length > maxBytes) throw new Error(`fetch: response exceeds ${maxBytes} bytes`);
        return text;
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      lastErr = err;
      if (attempt === retries) break;
      const delay = Math.min(1000 * 2 ** attempt, 8000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  const message = lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(message.startsWith('fetch:') ? message : `fetch: ${message} (${url})`);
}
