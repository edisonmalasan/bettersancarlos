// Deterministic offline validation for topic research (research.v2).
// See research/FORMAT.md. Structure and traceability only: never truth.
// research/runs/ is out of scope (immutable pipeline snapshots).
import fs from 'node:fs';
import path from 'node:path';
import {
  RESEARCH_SCHEMA,
  VERIFICATION_STATUSES,
  TEMPORAL_STATUSES,
  RISKS,
  RESEARCH_TYPES,
  SOURCE_TYPES,
  DEFAULT_JURISDICTION,
  discoverDocuments,
  readDocument,
  getSections,
  extractTables,
  parseCsv,
  isSourceId,
  looksLikeSourceId,
  findSecretHit,
  findLocalPathHit,
  type ResearchDocument,
  type MdTable,
  type Section,
} from './lib/research';
import { repoRoot } from '../data/lib/paths';

export interface ResearchValidationResult {
  errors: string[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const KEBAB_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const WORD_ID = /\bid\b/i;
const WORD_ENTITY = /\bentity\b/i;
const STATUS_OR_VERIFICATION = /\b(status|verification)\b/i;

function isRealDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** Heading match is exact on trimmed text (migration normalizes names). */
function sectionContent(doc: ResearchDocument, level: number, title: string): string | null {
  for (const s of getSections(doc.body)) {
    if (s.level === level && s.title === title) return s.content;
  }
  return null;
}

function hasHeading(doc: ResearchDocument, title: string): boolean {
  return getSections(doc.body).some((s) => s.title === title);
}

/** ### subsections nested under a ## section (headings are siblings in getSections). */
function h3Under(body: string, h2title: string): Section[] {
  const out: Section[] = [];
  let inside = false;
  for (const s of getSections(body)) {
    if (s.level === 2) inside = s.title === h2title;
    else if (inside) out.push(s);
  }
  return out;
}

function h3Content(body: string, h2title: string, h3title: string): string | null {
  const found = h3Under(body, h2title).find((s) => s.title === h3title);
  return found ? found.content : null;
}

function lowerCells(table: MdTable): string[][] {
  const lower = (cells: string[]) => cells.map((c) => c.trim().toLowerCase());
  return [lower(table.headers), ...table.rows.map(lower)];
}

function headerIndex(headers: string[], test: (h: string) => boolean): number {
  return headers.findIndex(test);
}

/** Strip inline code ticks, emphasis, and link markup for value comparison. */
export function plainCell(cell: string): string {
  return cell
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`_~]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

interface Register {
  ids: Set<string>;
  table: MdTable;
}

function checkRegister(doc: ResearchDocument, errors: string[]): Register | null {
  const sources = sectionContent(doc, 2, 'Sources');
  if (sources === null) return null; // Envelope check reports the missing section.
  const tables = extractTables(sources);
  const reg = tables.find((t) => {
    const h = t.headers.map((c) => c.trim().toLowerCase());
    return h.includes('id') && h.includes('type');
  });
  if (!reg) {
    errors.push(`${doc.relPath}: Sources section has no register table (need ID/Publisher/Document/Published/Accessed/Type/URL)`);
    return null;
  }
  const heads = reg.headers.map((c) => c.trim().toLowerCase());
  for (const need of ['id', 'publisher', 'document', 'published', 'accessed', 'type', 'url']) {
    if (!heads.includes(need)) {
      errors.push(`${doc.relPath}: register table is missing column "${need}"`);
      return null;
    }
  }
  const ids = new Set<string>();
  const seen = new Set<string>();
  const at = (name: string) => heads.indexOf(name);
  for (const row of reg.rows) {
    const id = (row[at('id')] ?? '').trim();
    if (!isSourceId(id)) {
      errors.push(`${doc.relPath}: malformed register ID "${id}" (want S1, S2, …)`);
      continue;
    }
    if (seen.has(id)) errors.push(`${doc.relPath}: duplicate source ID "${id}"`);
    seen.add(id);
    ids.add(id);
    const type = (row[at('type')] ?? '').trim();
    if (!(SOURCE_TYPES as readonly string[]).includes(type)) {
      errors.push(`${doc.relPath}: unknown source type "${type}" for ${id}`);
    }
    if ((row[at('url')] ?? '').trim() === '') {
      errors.push(`${doc.relPath}: source ${id} has an empty URL`);
    }
  }
  return { ids, table: reg };
}

function splitIds(cell: string): string[] {
  return cell
    .replace(/`/g, '')
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== '');
}

/** Resolve references in body tables (any section except the register itself). */
function checkTableRefs(
  doc: ResearchDocument,
  register: Register,
  errors: string[],
): void {
  const sections = getSections(doc.body);
  const preamble: string[] = [];
  const firstHeading = doc.body.search(/^#{2,3}\s+/m);
  if (firstHeading > 0) preamble.push(doc.body.slice(0, firstHeading));
  const blocks: string[] = [...preamble];
  for (const s of sections) {
    if (s.level === 2 && s.title === 'Sources') continue;
    blocks.push(s.content);
  }
  for (const block of blocks) {
    for (const table of extractTables(block)) {
      if (table === register.table) continue;
      const col = table.headers.findIndex((h) => h === 'Sources');
      if (col < 0) continue;
      for (const row of table.rows) {
        const cell = row[col] ?? '';
        if (cell.trim() === '' || cell.trim() === '—' || cell.trim() === '-') continue;
        for (const token of splitIds(cell)) {
          if (!isSourceId(token)) {
            errors.push(`${doc.relPath}: malformed source reference "${token}" (want S1 or S1, S3)`);
          } else if (!register.ids.has(token)) {
            errors.push(`${doc.relPath}: unknown source reference "${token}"`);
          }
        }
      }
    }
  }
}

/** Resolve `S<n>` references in prose inline code spans; bare prose is unparsed. */
function checkCodeSpanRefs(doc: ResearchDocument, register: Register, errors: string[]): void {
  const spans = doc.body.match(/`([^`\n]*)`/g) ?? [];
  for (const span of spans) {
    const inner = span.slice(1, -1);
    for (const token of inner
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '')) {
      if (!looksLikeSourceId(token)) continue;
      if (!isSourceId(token)) {
        errors.push(`${doc.relPath}: malformed source reference "${token}" (want S1, S2, …)`);
      } else if (!register.ids.has(token)) {
        errors.push(`${doc.relPath}: unknown source reference "${token}"`);
      }
    }
  }
}

function checkTypeMinima(doc: ResearchDocument, errors: string[]): void {
  const type = doc.meta.research_type;
  if (type === 'gap-report') {
    if (sectionContent(doc, 2, 'Findings') !== null) {
      errors.push(`${doc.relPath}: gap-report must not carry a Findings section (Current Conclusion stands in its place)`);
    }
    for (const need of ['Research Question', 'Current Conclusion']) {
      if (sectionContent(doc, 2, need) === null) {
        errors.push(`${doc.relPath}: gap-report is missing "## ${need}"`);
      }
    }
    const conclusion = sectionContent(doc, 2, 'Current Conclusion') ?? '';
    const firstLine = conclusion
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l !== '');
    if (firstLine !== undefined && firstLine.startsWith('BLOCKED') && doc.meta.verification_status !== 'blocked') {
      errors.push(
        `${doc.relPath}: Current Conclusion declares BLOCKED but verification_status is "${doc.meta.verification_status}"`,
      );
    }
    return;
  }
  const findings = sectionContent(doc, 2, 'Findings');
  if (findings === null) {
    errors.push(`${doc.relPath}: missing "## Findings"`);
    return;
  }
  if (type === 'dataset') {
    for (const need of ['Summary', 'Dataset']) {
      if (h3Content(doc.body, 'Findings', need) === null) {
        errors.push(`${doc.relPath}: dataset Findings is missing "### ${need}"`);
      }
    }
  } else if (type === 'directory') {
    const dir = h3Content(doc.body, 'Findings', 'Directory');
    if (dir === null) {
      errors.push(`${doc.relPath}: directory Findings is missing "### Directory"`);
      return;
    }
    const table = extractTables(dir).find((t) => {
      const h = t.headers.map((c) => c.trim().toLowerCase());
      return h.some((c) => WORD_ID.test(c));
    });
    if (table) {
      checkDirectoryColumns(doc, table.headers, errors);
    } else {
      // No inline table: a declared sidecar CSV may carry the Directory table
      // instead (never duplicated). Unparseable sidecars already error on
      // their own, so only flag the missing minimum when a parsed sidecar
      // still lacks the columns.
      const parsed = doc.meta.data_files
        .map((entry) => tryParseSidecar(doc, entry))
        .filter((rows): rows is string[][] => rows !== null);
      if (doc.meta.data_files.length === 0) {
        errors.push(`${doc.relPath}: "### Directory" has no table with an ID column`);
      } else if (parsed.length > 0 && !parsed.some(sidecarMeetsDirectoryMinima)) {
        errors.push(
          `${doc.relPath}: "### Directory" has no inline table and no declared sidecar carries ID/Entity/Status/Sources columns`,
        );
      }
    }
  } else if (type === 'profile') {
    const subs = h3Under(doc.body, 'Findings');
    if (subs.length === 0) errors.push(`${doc.relPath}: profile Findings needs at least one thematic subsection`);
  } else if (type === 'timeline') {
    const tl = h3Content(doc.body, 'Findings', 'Timeline');
    if (tl === null) {
      errors.push(`${doc.relPath}: timeline Findings is missing "### Timeline"`);
      return;
    }
    const table = extractTables(tl)[0];
    if (!table) {
      errors.push(`${doc.relPath}: "### Timeline" has no table`);
      return;
    }
    const heads = table.headers.map((c) => c.trim().toLowerCase());
    const dateOk = heads.some((c) => ['date / period', 'date/period', 'date'].includes(c));
    if (!dateOk) errors.push(`${doc.relPath}: Timeline table is missing a Date / period column`);
    if (!heads.includes('event')) errors.push(`${doc.relPath}: Timeline table is missing an Event column`);
    if (!heads.some((c) => STATUS_OR_VERIFICATION.test(c))) {
      errors.push(`${doc.relPath}: Timeline table is missing a Verification column`);
    }
    if (!table.headers.some((c) => c === 'Sources')) {
      errors.push(`${doc.relPath}: Timeline table is missing an exact "Sources" column`);
    }
  } else if (type === 'document-index') {
    const inv = h3Content(doc.body, 'Findings', 'Document inventory');
    if (inv === null) {
      errors.push(`${doc.relPath}: document-index Findings is missing "### Document inventory"`);
    } else {
      const table = extractTables(inv)[0];
      if (!table) {
        errors.push(`${doc.relPath}: "### Document inventory" has no table`);
      } else {
        const heads = table.headers.map((c) => c.trim().toLowerCase());
        for (const need of ['document id', 'title', 'date', 'availability']) {
          if (!heads.includes(need)) {
            errors.push(`${doc.relPath}: inventory table is missing a "${need}" column`);
          }
        }
        if (!heads.some((c) => STATUS_OR_VERIFICATION.test(c))) {
          errors.push(`${doc.relPath}: inventory table is missing a Verification column`);
        }
        if (!table.headers.some((c) => c === 'Sources')) {
          errors.push(`${doc.relPath}: inventory table is missing an exact "Sources" column`);
        }
      }
    }
    if (!hasHeading(doc, 'Missing documents')) {
      errors.push(`${doc.relPath}: document-index is missing "Missing documents"`);
    }
  }
}

function checkEnvelope(doc: ResearchDocument, errors: string[]): void {
  for (const need of ['Scope', 'Summary', 'Sources']) {
    if (sectionContent(doc, 2, need) === null) {
      errors.push(`${doc.relPath}: missing "## ${need}"`);
    }
  }
  const needsAttempts =
    ['partial', 'unverified', 'blocked'].includes(doc.meta.verification_status) ||
    doc.meta.research_type === 'gap-report';
  if (needsAttempts && sectionContent(doc, 2, 'Research Attempts') === null) {
    errors.push(`${doc.relPath}: missing "## Research Attempts" (required for ${doc.meta.verification_status})`);
  }
}

function checkJurisdiction(doc: ResearchDocument, errors: string[]): void {
  const j = doc.meta.jurisdiction;
  if (!j) return;
  const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
  const isDefault =
    same(j.country, DEFAULT_JURISDICTION.country) &&
    same(j.province, DEFAULT_JURISDICTION.province) &&
    same(j.locality, DEFAULT_JURISDICTION.locality);
  if (isDefault) return;
  const scope = sectionContent(doc, 2, 'Scope') ?? '';
  if (!scope.toLowerCase().includes(j.locality.trim().toLowerCase())) {
    errors.push(
      `${doc.relPath}: non-default jurisdiction must name "${j.locality.trim()}" in ## Scope`,
    );
  }
}

function resolveSidecar(doc: ResearchDocument, entry: string, errors: string[]): string | null {
  if (path.isAbsolute(entry) || entry.split(/[\\/]/).includes('..')) {
    errors.push(`${doc.relPath}: sidecar "${entry}" must stay inside the document directory`);
    return null;
  }
  const docDir = path.join(doc.root, 'research', doc.category);
  const full = path.normalize(path.join(docDir, entry));
  if (!full.startsWith(path.normalize(docDir + path.sep))) {
    errors.push(`${doc.relPath}: sidecar "${entry}" must stay inside the document directory`);
    return null;
  }
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    errors.push(`${doc.relPath}: declared sidecar "${entry}" is missing`);
    return null;
  }
  const ext = path.extname(full).toLowerCase();
  try {
    if (ext === '.csv') parseCsv(fs.readFileSync(full, 'utf8'), entry);
    else if (ext === '.json') JSON.parse(fs.readFileSync(full, 'utf8'));
    else errors.push(`${doc.relPath}: sidecar "${entry}" must be .csv or .json`);
  } catch (err) {
    errors.push(`${doc.relPath}: sidecar "${entry}" does not parse: ${(err as Error).message}`);
  }
  return full;
}

function checkDirectoryColumns(doc: ResearchDocument, headers: string[], errors: string[]): void {
  const heads = headers.map((c) => c.trim().toLowerCase());
  if (!heads.some((c) => WORD_ENTITY.test(c))) {
    errors.push(`${doc.relPath}: Directory table is missing an Entity column`);
  }
  if (!heads.some((c) => STATUS_OR_VERIFICATION.test(c))) {
    errors.push(`${doc.relPath}: Directory table is missing a Status/Verification column`);
  }
  if (!headers.some((c) => c === 'Sources')) {
    errors.push(`${doc.relPath}: Directory table is missing an exact "Sources" column`);
  }
}

/** A parsed sidecar meets the Directory minimum when its header carries the same columns. */
function sidecarMeetsDirectoryMinima(rows: string[][]): boolean {
  if (rows.length === 0) return false;
  const heads = rows[0].map((c) => c.trim().toLowerCase());
  return (
    heads.some((c) => WORD_ID.test(c)) &&
    heads.some((c) => WORD_ENTITY.test(c)) &&
    heads.some((c) => STATUS_OR_VERIFICATION.test(c)) &&
    heads.includes('sources')
  );
}

/** Best-effort sidecar parse for minima checks; real errors surface via resolveSidecar. */
function tryParseSidecar(doc: ResearchDocument, entry: string): string[][] | null {
  if (path.isAbsolute(entry) || entry.split(/[\\/]/).includes('..')) return null;
  const docDir = path.join(doc.root, 'research', doc.category);
  const full = path.normalize(path.join(docDir, entry));
  if (!full.startsWith(path.normalize(docDir + path.sep))) return null;
  let text: string;
  try {
    text = fs.readFileSync(full, 'utf8');
  } catch {
    return null;
  }
  const ext = path.extname(full).toLowerCase();
  try {
    if (ext === '.csv') return parseCsv(text, entry);
    if (ext === '.json') {
      JSON.parse(text);
      return null; // JSON sidecars carry nested data, not directory tables.
    }
    return null;
  } catch {
    return null;
  }
}

function checkDuplicateEntityIds(doc: ResearchDocument, errors: string[]): void {
  const seen = new Set<string>();
  const consider = (value: string) => {
    const key = plainCell(value);
    if (key === '' || key === '—' || key === '-') return;
    if (seen.has(key)) {
      errors.push(`${doc.relPath}: duplicate entity ID "${key}"`);
    } else {
      seen.add(key);
    }
  };
  for (const table of extractTables(doc.body)) {
    const col = table.headers.findIndex((h) => WORD_ID.test(h.trim()));
    if (col < 0) continue;
    if (table.headers.some((h) => h.trim().toLowerCase() === 'type')) continue; // source register: checked separately
    for (const row of table.rows) consider(row[col] ?? '');
  }
}

function checkSidecarEntityIds(
  doc: ResearchDocument,
  full: string,
  registerIds: Set<string> | null,
  errors: string[],
): void {
  if (path.extname(full).toLowerCase() !== '.csv') return;
  let rows: string[][];
  try {
    rows = parseCsv(fs.readFileSync(full, 'utf8'), full);
  } catch {
    return; // Parse failure already reported by resolveSidecar.
  }
  if (rows.length === 0) return;
  const base = path.basename(full);
  const heads = rows[0].map((c) => c.trim().toLowerCase());
  const idCol = heads.findIndex((c) => WORD_ID.test(c));
  if (idCol >= 0) {
    const seen = new Set<string>();
    for (const row of rows.slice(1)) {
      const key = (row[idCol] ?? '').trim();
      if (key === '') continue;
      if (seen.has(key)) {
        errors.push(`${doc.relPath}: duplicate entity ID "${key}" in sidecar ${base}`);
      } else {
        seen.add(key);
      }
    }
  }
  // A sidecar carrying the Directory table resolves its Sources cells too.
  const srcCol = heads.findIndex((c) => c === 'sources');
  if (srcCol >= 0 && registerIds) {
    for (const row of rows.slice(1)) {
      const cell = (row[srcCol] ?? '').trim();
      if (cell === '' || cell === '—' || cell === '-') continue;
      for (const token of cell
        .replace(/`/g, '')
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '')) {
        if (!isSourceId(token)) {
          errors.push(`${doc.relPath}: malformed source reference "${token}" in sidecar ${base}`);
        } else if (!registerIds.has(token)) {
          errors.push(`${doc.relPath}: unknown source reference "${token}" in sidecar ${base}`);
        }
      }
    }
  }
}

function checkSecretsAndPaths(
  relPath: string,
  text: string,
  errors: string[],
): void {
  const secret = findSecretHit(text);
  if (secret) errors.push(`${relPath}: possible secret (matches ${secret})`);
  const local = findLocalPathHit(text);
  if (local) errors.push(`${relPath}: machine-local absolute path "${local}"`);
}

function checkDocument(doc: ResearchDocument, errors: string[]): Set<string> | null {
  const meta = doc.meta;
  if (meta.category !== doc.category) {
    errors.push(`${doc.relPath}: category "${meta.category}" does not match directory "${doc.category}"`);
  }
  if (!KEBAB_ID.test(meta.id)) {
    errors.push(`${doc.relPath}: id "${meta.id}" must be kebab-case`);
  }
  if (!(VERIFICATION_STATUSES as readonly string[]).includes(meta.verification_status)) {
    errors.push(`${doc.relPath}: unknown verification_status "${meta.verification_status}"`);
  }
  if (!(TEMPORAL_STATUSES as readonly string[]).includes(meta.temporal_status)) {
    errors.push(`${doc.relPath}: unknown temporal_status "${meta.temporal_status}"`);
  }
  if (!(RISKS as readonly string[]).includes(meta.risk)) {
    errors.push(`${doc.relPath}: unknown risk "${meta.risk}"`);
  }
  if (!(RESEARCH_TYPES as readonly string[]).includes(meta.research_type)) {
    errors.push(`${doc.relPath}: unknown research_type "${meta.research_type}"`);
    return null;
  }
  if (!isRealDate(meta.researched_at)) {
    errors.push(`${doc.relPath}: researched_at "${meta.researched_at}" is not a valid ISO date`);
  }
  if (!isRealDate(meta.last_checked)) {
    errors.push(`${doc.relPath}: last_checked "${meta.last_checked}" is not a valid ISO date`);
  }
  if (isRealDate(meta.researched_at) && isRealDate(meta.last_checked) && meta.last_checked < meta.researched_at) {
    errors.push(`${doc.relPath}: last_checked must not be earlier than researched_at`);
  }
  if (meta.canonical_domains.length === 0) {
    errors.push(`${doc.relPath}: canonical_domains must list at least one domain`);
  }
  checkEnvelope(doc, errors);
  checkTypeMinima(doc, errors);
  checkJurisdiction(doc, errors);
  const register = checkRegister(doc, errors);
  let registerIds: Set<string> | null = null;
  if (register) {
    registerIds = register.ids;
    checkTableRefs(doc, register, errors);
    checkCodeSpanRefs(doc, register, errors);
  }
  checkDuplicateEntityIds(doc, errors);
  checkSecretsAndPaths(doc.relPath, doc.body, errors);
  return registerIds;
}

export function validateResearchRoot(root: string = repoRoot()): ResearchValidationResult {
  const errors: string[] = [];
  const found = discoverDocuments(root);
  const seenIds = new Map<string, string>();
  const declaredSidecars = new Set<string>();
  const docs: ResearchDocument[] = [];
  for (const f of found) {
    let doc: ResearchDocument;
    try {
      doc = readDocument(f, root);
    } catch (err) {
      errors.push((err as Error).message);
      continue;
    }
    const first = seenIds.get(doc.meta.id);
    if (first !== undefined) {
      errors.push(`${doc.relPath}: duplicate document id "${doc.meta.id}" (also in ${first})`);
    } else {
      seenIds.set(doc.meta.id, doc.relPath);
    }
    docs.push(doc);
  }
  for (const doc of docs) {
    const registerIds = checkDocument(doc, errors);
    for (const entry of doc.meta.data_files) {
      const full = resolveSidecar(doc, entry, errors);
      if (full) {
        declaredSidecars.add(full);
        checkSidecarEntityIds(doc, full, registerIds, errors);
      }
    }
  }
  // Orphan sidecars: anything under <category>/data/ without a declaring owner.
  const researchRoot = path.join(root, 'research');
  let categories: string[] = [];
  try {
    categories = fs
      .readdirSync(researchRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name !== 'runs' && e.name !== 'templates')
      .map((e) => e.name);
  } catch {
    categories = [];
  }
  const walk = (dir: string) => {
    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (dir.split(path.sep).includes('data')) {
        if (!declaredSidecars.has(path.normalize(full))) {
          errors.push(
            `${path.relative(root, full).split(path.sep).join('/')}: orphan sidecar with no declaring document`,
          );
        }
      }
    }
  };
  for (const category of categories) walk(path.join(researchRoot, category));
  return { errors };
}

function main(): number {
  const root = repoRoot();
  if (!fs.existsSync(path.join(root, 'research'))) {
    console.error(`no research directory under ${root} (is CIVIC_ROOT wrong?)`);
    return 2;
  }
  const result = validateResearchRoot(root);
  for (const error of result.errors) console.error(`error: ${error}`);
  console.log(`research validation: ${result.errors.length} error(s)`);
  return result.errors.length > 0 ? 1 : 0;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/research/validate.ts');

if (invokedDirectly) {
  process.exit(main());
}
