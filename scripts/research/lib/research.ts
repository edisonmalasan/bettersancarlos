// Shared reader for topic research (research.v2 contract, see research/FORMAT.md).
//
// Zero new dependencies: frontmatter YAML goes through the existing civic-data
// subset parser (scripts/data/lib/yaml.ts), which covers exactly what the
// contract allows (flat scalars, string lists, one nested mapping).
import fs from 'node:fs';
import path from 'node:path';
import { parseYamlSubset } from '../../data/lib/yaml';
import { repoRoot } from '../../data/lib/paths';

export const RESEARCH_SCHEMA = 'research.v2';

export const VERIFICATION_STATUSES = ['verified', 'partial', 'unverified', 'blocked'] as const;
export const TEMPORAL_STATUSES = ['current', 'historical', 'mixed', 'unknown'] as const;
export const RISKS = ['low', 'medium', 'high'] as const;
export const RESEARCH_TYPES = [
  'dataset',
  'directory',
  'profile',
  'timeline',
  'document-index',
  'gap-report',
] as const;
export const SOURCE_TYPES = [
  'official',
  'archived-official',
  'government-dataset',
  'authoritative-secondary',
  'secondary',
  'community',
  'other',
] as const;

export const DEFAULT_JURISDICTION = {
  country: 'PH',
  province: 'Pangasinan',
  locality: 'San Carlos City',
};

// Directories under research/ that are never governed topic documents.
const SKIPPED_DIRS = new Set(['runs', 'templates', 'data']);
// Files that are never governed topic documents.
const SKIPPED_FILES = new Set(['README.md', 'FORMAT.md', 'product-ideas.md']);

const FRONTMATTER_KEYS = new Set([
  'schema',
  'id',
  'title',
  'category',
  'research_type',
  'verification_status',
  'temporal_status',
  'risk',
  'researched_at',
  'last_checked',
  'canonical_domains',
  'data_files',
  'jurisdiction',
]);

export interface Jurisdiction {
  country: string;
  province: string;
  locality: string;
}

export interface ResearchFrontmatter {
  schema: string;
  id: string;
  title: string;
  category: string;
  research_type: string;
  verification_status: string;
  temporal_status: string;
  risk: string;
  researched_at: string;
  last_checked: string;
  canonical_domains: string[];
  data_files: string[];
  jurisdiction: Jurisdiction | null;
}

export interface ResearchDocument {
  /** Absolute path to the repository/fixture root. */
  root: string;
  category: string;
  filename: string;
  /** Repo-relative path, e.g. research/emergency/26-09-emergency-hotlines.md */
  relPath: string;
  meta: ResearchFrontmatter;
  /** Markdown body after the frontmatter block. */
  body: string;
}

export interface DiscoveredFile {
  category: string;
  filename: string;
  fullPath: string;
  relPath: string;
}

export function researchDir(root: string = repoRoot()): string {
  return path.join(root, 'research');
}

/** Deterministic discovery: category dirs sorted, then filenames sorted. */
export function discoverDocuments(root: string = repoRoot()): DiscoveredFile[] {
  const dir = researchDir(root);
  const out: DiscoveredFile[] = [];
  let categories: string[];
  try {
    categories = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !SKIPPED_DIRS.has(e.name))
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
  for (const category of categories) {
    const catDir = path.join(dir, category);
    let names: string[];
    try {
      names = fs
        .readdirSync(catDir, { withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith('.md') && !SKIPPED_FILES.has(e.name))
        .map((e) => e.name)
        .sort();
    } catch {
      continue;
    }
    for (const filename of names) {
      out.push({
        category,
        filename,
        fullPath: path.join(catDir, filename),
        relPath: path.posix.join('research', category, filename),
      });
    }
  }
  return out;
}

function fail(relPath: string, message: string): never {
  throw new Error(`research: ${relPath}: ${message}`);
}

function asNonEmptyString(value: unknown, relPath: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(relPath, `frontmatter "${field}" must be a non-empty string`);
  }
  return (value as string).trim();
}

function asStringList(value: unknown, relPath: string, field: string): string[] {
  if (!Array.isArray(value)) fail(relPath, `frontmatter "${field}" must be a list`);
  const list = value as unknown[];
  for (const item of list) {
    if (typeof item !== 'string' || item.trim() === '') {
      fail(relPath, `frontmatter "${field}" must list non-empty strings`);
    }
  }
  return (list as string[]).map((s) => s.trim());
}

/** Split `---` frontmatter from the body. The file must start with the fence. */
export function splitFrontmatter(
  text: string,
  relPath: string,
): { raw: string; body: string } {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') fail(relPath, 'missing frontmatter (file must start with ---)');
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
  if (end < 0) fail(relPath, 'unterminated frontmatter (missing closing ---)');
  return { raw: lines.slice(1, end).join('\n'), body: lines.slice(end + 1).join('\n') };
}

export function parseFrontmatter(raw: string, relPath: string): ResearchFrontmatter {
  let parsed: unknown;
  try {
    parsed = parseYamlSubset(raw);
  } catch (err) {
    fail(relPath, `malformed frontmatter: ${(err as Error).message}`);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail(relPath, 'frontmatter must be a mapping');
  }
  const obj = parsed as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!FRONTMATTER_KEYS.has(key)) fail(relPath, `unknown frontmatter key "${key}"`);
  }
  const schema = asNonEmptyString(obj.schema, relPath, 'schema');
  if (schema !== RESEARCH_SCHEMA) fail(relPath, `unknown schema "${schema}"`);
  let jurisdiction: Jurisdiction | null = null;
  if (obj.jurisdiction !== undefined) {
    const j = obj.jurisdiction;
    if (typeof j !== 'object' || j === null || Array.isArray(j)) {
      fail(relPath, 'frontmatter "jurisdiction" must be a mapping');
    }
    const jm = j as Record<string, unknown>;
    for (const key of Object.keys(jm)) {
      if (!['country', 'province', 'locality'].includes(key)) {
        fail(relPath, `unknown jurisdiction key "${key}"`);
      }
    }
    jurisdiction = {
      country: asNonEmptyString(jm.country, relPath, 'jurisdiction.country'),
      province: asNonEmptyString(jm.province, relPath, 'jurisdiction.province'),
      locality: asNonEmptyString(jm.locality, relPath, 'jurisdiction.locality'),
    };
  }
  return {
    schema,
    id: asNonEmptyString(obj.id, relPath, 'id'),
    title: asNonEmptyString(obj.title, relPath, 'title'),
    category: asNonEmptyString(obj.category, relPath, 'category'),
    research_type: asNonEmptyString(obj.research_type, relPath, 'research_type'),
    verification_status: asNonEmptyString(obj.verification_status, relPath, 'verification_status'),
    temporal_status: asNonEmptyString(obj.temporal_status, relPath, 'temporal_status'),
    risk: asNonEmptyString(obj.risk, relPath, 'risk'),
    researched_at: asNonEmptyString(obj.researched_at, relPath, 'researched_at'),
    last_checked: asNonEmptyString(obj.last_checked, relPath, 'last_checked'),
    canonical_domains: asStringList(obj.canonical_domains, relPath, 'canonical_domains'),
    data_files: obj.data_files === undefined ? [] : asStringList(obj.data_files, relPath, 'data_files'),
    jurisdiction,
  };
}

export function readDocument(found: DiscoveredFile, root: string): ResearchDocument {
  const text = fs.readFileSync(found.fullPath, 'utf8');
  const { raw, body } = splitFrontmatter(text, found.relPath);
  return { ...found, root, meta: parseFrontmatter(raw, found.relPath), body };
}

export interface Section {
  level: number;
  title: string;
  content: string;
}

/** Split a body into ## / ### sections in document order. */
export function getSections(body: string): Section[] {
  const out: Section[] = [];
  const lines = body.split(/\r?\n/);
  let current: Section | null = null;
  for (const line of lines) {
    const m = /^(#{2,3})\s+(.*)$/.exec(line.trim());
    if (m) {
      if (current) out.push(current);
      current = { level: m[1].length, title: m[2].trim(), content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
  }
  if (current) out.push(current);
  return out;
}

/** Level-2 section titles in document order. */
export function h2Titles(body: string): string[] {
  return getSections(body)
    .filter((s) => s.level === 2)
    .map((s) => s.title);
}

export interface MdTable {
  headers: string[];
  rows: string[][];
}

function splitRow(line: string): string[] | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  const inner = trimmed.replace(/^\||\|$/g, '');
  return inner.split('|').map((c) => c.trim());
}

function isDelimiter(cells: string[]): boolean {
  return (
    cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c))
  );
}

/** Extract well-formed Markdown tables; malformed row runs are ignored. */
export function extractTables(text: string): MdTable[] {
  const out: MdTable[] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const headers = splitRow(lines[i]);
    if (!headers) continue;
    const delim = i + 1 < lines.length ? splitRow(lines[i + 1]) : null;
    if (!delim || !isDelimiter(delim)) continue;
    const rows: string[][] = [];
    let j = i + 2;
    for (; j < lines.length; j++) {
      const cells = splitRow(lines[j]);
      if (!cells) break;
      rows.push(cells);
    }
    out.push({ headers, rows });
    i = j - 1;
  }
  return out;
}

/** RFC-4180-lite CSV: quoted fields with "" escapes; ragged rows and unbalanced quotes throw. */
export function parseCsv(text: string, relPath: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let hasContent = false;
  const push = () => {
    row.push(field);
    field = '';
    hasContent = true;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      if (field !== '') fail(relPath, 'malformed CSV (stray quote)');
      quoted = true;
    } else if (ch === ',') {
      push();
    } else if (ch === '\r') {
      continue;
    } else if (ch === '\n') {
      push();
      rows.push(row);
      row = [];
      hasContent = false;
    } else {
      field += ch;
    }
  }
  if (quoted) fail(relPath, 'malformed CSV (unbalanced quote)');
  if (hasContent || field !== '' || row.length > 0) {
    push();
    rows.push(row);
  }
  const width = rows.length > 0 ? rows[0].length : 0;
  rows.forEach((r, n) => {
    if (r.length !== width) fail(relPath, `malformed CSV (ragged row ${n + 1})`);
  });
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

// Same secret shapes as civic-data validation: findings stay token-free.
const SECRET_PATTERNS = [
  /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  /\b(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{22,}|xox[bpas]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35})\b/,
  /\b(api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['"]?[A-Za-z0-9_.\-/+=]{12,}['"]?/i,
];

const LOCAL_PATH_PATTERN = /(?<![A-Za-z])(?:[A-Za-z]:[\\/]|\/(?:Users|home|tmp|var|etc)\/)\S*/;

export function findSecretHit(text: string): string | null {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) return String(pattern);
  }
  return null;
}

export function findLocalPathHit(text: string): string | null {
  const m = LOCAL_PATH_PATTERN.exec(text);
  return m ? m[0].slice(0, 48) : null;
}

/** Source-reference token in exact form: S + 1-based integer, no leading zeros. */
export function isSourceId(token: string): boolean {
  return /^S[1-9][0-9]*$/.test(token);
}

/** Anything shaped like an attempted reference (loose): used to catch near-misses. */
export function looksLikeSourceId(token: string): boolean {
  return /^S\d+$/i.test(token);
}
