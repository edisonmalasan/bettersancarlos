// Minimal fixed-purpose YAML subset parser.
//
// Supports exactly what data/civic/source-registry.yaml uses:
// - full-line comments and blank lines
// - mappings with 2-space indentation
// - sequences of mappings ("- key: value") and sequences of scalars
// - scalars: single-quoted, double-quoted, bare; `null`/`~`/empty -> null;
//   integers, floats, booleans
// Duplicate mapping keys are rejected. Anything outside this subset throws.
// Do NOT extend casually: keep the registry file inside this subset instead.

interface Line {
  indent: number;
  content: string;
  lineNo: number;
}

function tokenize(text: string): Line[] {
  const out: Line[] = [];
  const rawLines = text.split(/\r?\n/);
  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    if (/^\s*(#|$)/.test(raw)) continue;
    if (/\t/.test(raw)) throw new Error(`yaml: tabs are not supported (line ${i + 1})`);
    const indent = raw.length - raw.trimStart().length;
    if (indent % 2 !== 0) throw new Error(`yaml: odd indentation (line ${i + 1})`);
    out.push({ indent, content: raw.trim(), lineNo: i + 1 });
  }
  return out;
}

function parseScalar(token: string, lineNo: number): unknown {
  if (token === '' || token === 'null' || token === '~') return null;
  if (token === 'true') return true;
  if (token === 'false') return false;
  if (token.startsWith("'") && token.endsWith("'") && token.length >= 2) {
    return token.slice(1, -1).replace(/''/g, "'");
  }
  if (token.startsWith('"') && token.endsWith('"') && token.length >= 2) {
    try {
      return JSON.parse(token) as unknown;
    } catch {
      throw new Error(`yaml: bad double-quoted scalar (line ${lineNo})`);
    }
  }
  if (/^-?\d+$/.test(token)) return parseInt(token, 10);
  if (/^-?\d+\.\d+$/.test(token)) return parseFloat(token);
  if (/[{}\[\],]/.test(token)) throw new Error(`yaml: flow syntax not supported (line ${lineNo})`);
  return token;
}

function splitPair(text: string, lineNo: number): [string, string] {
  const idx = text.indexOf(':');
  if (idx <= 0) throw new Error(`yaml: expected "key: value" (line ${lineNo})`);
  const key = text.slice(0, idx).trim();
  if (key === '' || /[\s'"]/.test(key)) throw new Error(`yaml: bad mapping key (line ${lineNo})`);
  return [key, text.slice(idx + 1).trim()];
}

function parseMapping(lines: Line[], i: number, keyIndent: number): [Record<string, unknown>, number] {
  const obj: Record<string, unknown> = {};
  let j = i;
  while (j < lines.length && lines[j].indent === keyIndent && !lines[j].content.startsWith('- ')) {
    const [key, rest] = splitPair(lines[j].content, lines[j].lineNo);
    if (key in obj) throw new Error(`yaml: duplicate key "${key}" (line ${lines[j].lineNo})`);
    if (rest === '') {
      if (j + 1 >= lines.length || lines[j + 1].indent <= keyIndent) {
        throw new Error(`yaml: key "${key}" needs a nested value (line ${lines[j].lineNo})`);
      }
      const [child, next] = parseBlock(lines, j + 1, lines[j + 1].indent);
      obj[key] = child;
      j = next;
    } else {
      obj[key] = parseScalar(rest, lines[j].lineNo);
      j++;
    }
  }
  return [obj, j];
}

function parseSequence(lines: Line[], i: number, indent: number): [unknown[], number] {
  const out: unknown[] = [];
  let j = i;
  while (j < lines.length && lines[j].indent === indent && lines[j].content.startsWith('-')) {
    const rest = lines[j].content.slice(1).trim();
    if (rest === '') {
      if (j + 1 >= lines.length || lines[j + 1].indent <= indent) {
        throw new Error(`yaml: empty sequence item (line ${lines[j].lineNo})`);
      }
      const [child, next] = parseBlock(lines, j + 1, lines[j + 1].indent);
      out.push(child);
      j = next;
    } else if (/^[^:]+:(\s|$)/.test(rest)) {
      // "- key: value" starts a mapping whose remaining keys sit one level deeper.
      const [key, first] = splitPair(rest, lines[j].lineNo);
      const obj: Record<string, unknown> = {};
      if (first === '') throw new Error(`yaml: key "${key}" needs a value (line ${lines[j].lineNo})`);
      obj[key] = parseScalar(first, lines[j].lineNo);
      j++;
      if (j < lines.length && lines[j].indent === indent + 2) {
        const [more, next] = parseMapping(lines, j, indent + 2);
        for (const k of Object.keys(more)) {
          if (k in obj) throw new Error(`yaml: duplicate key "${k}" (line ${lines[j].lineNo})`);
          obj[k] = more[k];
        }
        j = next;
      }
      out.push(obj);
    } else {
      out.push(parseScalar(rest, lines[j].lineNo));
      j++;
    }
  }
  return [out, j];
}

function parseBlock(lines: Line[], i: number, indent: number): [unknown, number] {
  if (i >= lines.length || lines[i].indent !== indent) {
    throw new Error('yaml: unexpected indentation');
  }
  if (lines[i].content.startsWith('-')) return parseSequence(lines, i, indent);
  return parseMapping(lines, i, indent);
}

export function parseYamlSubset(text: string): unknown {
  const lines = tokenize(text);
  if (lines.length === 0) return {};
  const [value, next] = parseBlock(lines, 0, lines[0].indent);
  if (next !== lines.length) throw new Error(`yaml: unexpected content (line ${lines[next].lineNo})`);
  return value;
}
