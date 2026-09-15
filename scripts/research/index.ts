// Deterministic research index: regenerates marked README regions from
// frontmatter. See research/FORMAT.md. Byte-identical reruns by construction
// (sorted discovery, fixed column order, no timestamps in output).
import fs from 'node:fs';
import path from 'node:path';
import {
  discoverDocuments,
  readDocument,
  type ResearchDocument,
} from './lib/research';
import { repoRoot } from '../data/lib/paths';

export const INV_START = '<!-- research:index:start:inventory -->';
export const INV_END = '<!-- research:index:end:inventory -->';
export const SUM_START = '<!-- research:index:start:summary -->';
export const SUM_END = '<!-- research:index:end:summary -->';

export function loadIndexDocuments(root: string = repoRoot()): ResearchDocument[] {
  const docs: ResearchDocument[] = [];
  for (const found of discoverDocuments(root)) {
    docs.push(readDocument(found, root));
  }
  // Discovery is already category-then-filename; order the index by
  // category, then stable id (both fixed strings: no timestamps involved).
  docs.sort((a, b) =>
    a.category < b.category ? -1 : a.category > b.category ? 1 : a.meta.id < b.meta.id ? -1 : 1,
  );
  return docs;
}

function esc(cell: string): string {
  return cell.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

export function buildInventory(docs: ResearchDocument[]): string {
  const lines = [
    '| Category | Topic | Type | Verification | Temporal | Risk | Last checked |',
    '|---|---|---|---|---|---|---|',
  ];
  for (const doc of docs) {
    const m = doc.meta;
    lines.push(
      `| ${esc(doc.category)} | ${esc(m.title)} | ${esc(m.research_type)} | ${esc(m.verification_status)} | ${esc(m.temporal_status)} | ${esc(m.risk)} | ${esc(m.last_checked)} |`,
    );
  }
  return lines.join('\n') + '\n';
}

export function buildSummary(docs: ResearchDocument[]): string {
  const count = (fn: (m: ResearchDocument['meta']) => boolean) => docs.filter((d) => fn(d.meta)).length;
  const last = docs.map((d) => d.meta.last_checked).sort().at(-1) ?? '—';
  return (
    `- Research documents: ${docs.length}\n` +
    `- Verified: ${count((m) => m.verification_status === 'verified')} · ` +
    `Partial: ${count((m) => m.verification_status === 'partial')} · ` +
    `Unverified: ${count((m) => m.verification_status === 'unverified')} · ` +
    `Blocked: ${count((m) => m.verification_status === 'blocked')}\n` +
    `- High-risk: ${count((m) => m.risk === 'high')}\n` +
    `- Last research update: ${last}\n`
  );
}

function replaceRegion(text: string, start: string, end: string, body: string): string {
  const a = text.indexOf(start);
  const b = text.indexOf(end);
  if (a < 0 || b < 0 || b < a) {
    throw new Error(`research: README is missing markers ${start} … ${end}`);
  }
  return text.slice(0, a + start.length) + '\n' + body + text.slice(b);
}

export function renderReadme(readme: string, docs: ResearchDocument[]): string {
  let out = replaceRegion(readme, INV_START, INV_END, buildInventory(docs));
  out = replaceRegion(out, SUM_START, SUM_END, buildSummary(docs));
  return out;
}

export function readmePath(root: string = repoRoot()): string {
  return path.join(root, 'research', 'README.md');
}

function main(): number {
  const root = repoRoot();
  const checkOnly = process.argv.includes('--check');
  const file = readmePath(root);
  if (!fs.existsSync(file)) {
    console.error('research: research/README.md not found');
    return 2;
  }
  let docs: ResearchDocument[];
  try {
    docs = loadIndexDocuments(root);
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return 1;
  }
  const current = fs.readFileSync(file, 'utf8');
  let next: string;
  try {
    next = renderReadme(current, docs);
  } catch (err) {
    console.error(`error: ${(err as Error).message}`);
    return 1;
  }
  if (checkOnly) {
    if (next !== current) {
      console.error('research: index out of sync (run bun run research:index)');
      return 1;
    }
    console.log(`research index in sync (${docs.length} documents)`);
    return 0;
  }
  fs.writeFileSync(file, next);
  console.log(`research index regenerated (${docs.length} documents)`);
  return 0;
}

const invokedDirectly = (process.argv[1] ?? '').replace(/\\/g, '/').endsWith('/scripts/research/index.ts');

if (invokedDirectly) {
  process.exit(main());
}
