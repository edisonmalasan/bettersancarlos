// Deterministic HTML evidence helpers. Pure string operations, no
// dependencies, no network. Throws Error('parse: ...') on failure.

export function htmlToText(html: string, evidenceName: string): string {
  if (!html || html.trim() === '') throw new Error(`parse: empty evidence: ${evidenceName}`);
  return html
    .replace(/<script[\s>][\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style[\s>][\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

export interface ObservedPhone {
  number: string;
  context: string;
}

const PHONE_RE =
  /(\(0\d{2,3}\)\s*\d{3}[- ]\d{4}|09\d{2}[- ]?\d{3}[- ]?\d{4}|\b(?:911|117|143|8888|1555)\b)/g;

export function extractPhones(text: string): ObservedPhone[] {
  const out: ObservedPhone[] = [];
  let match: RegExpExecArray | null;
  PHONE_RE.lastIndex = 0;
  while ((match = PHONE_RE.exec(text)) !== null) {
    const start = Math.max(0, match.index - 80);
    const end = Math.min(text.length, match.index + match[0].length + 20);
    out.push({
      number: match[0].replace(/\s+/g, ' ').trim(),
      context: text.slice(start, end).replace(/\s+/g, ' ').trim(),
    });
  }
  return out;
}

export function extractLinks(html: string): Array<{ href: string; text: string }> {
  const out: Array<{ href: string; text: string }> = [];
  const re = /<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a\s*>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    out.push({ href: match[1], text: match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() });
  }
  return out;
}

/**
 * Decode the entities government portal pages actually emit
 * (`&nbsp;`, numeric `&#160;`/`&#8209;`/`&#8211;`/`&#8212;`), then collapse
 * whitespace. Shared by source-specific collectors; pure string operations.
 */
export function cleanText(raw: string): string {
  return raw
    .replace(/&#0*160;/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#0*39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#0*8211;/g, '–')
    .replace(/&#0*8212;/g, '—')
    .replace(/&#0*8209;/g, '‑')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Visible text of an HTML fragment: strip tags, decode, collapse. */
export function cellText(fragment: string): string {
  return cleanText(fragment.replace(/<[^>]+>/g, ' '));
}
