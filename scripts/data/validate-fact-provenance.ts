/**
 * Fact-provenance guard.
 *
 * Rejects unsourced civic fee / cost / processing-time literals in page files.
 *
 * Rationale (see openspec/specs/civic-fact-provenance-guard): the civic data
 * pipeline holds no fee, cost, or processing-time field, so any such figure
 * typed into a page file is an unsourced civic claim. A peso amount on a city
 * portal is a decision input for residents, so an unverified one must never be
 * published. This check fails loudly instead.
 *
 * Scope and limits: this is a textual scan, not a dataflow analysis. It catches
 * string literals assigned to a fee/cost/processing-time/turnaround-shaped key,
 * which is the common and most damaging case. A value assembled at runtime
 * (template literal, concatenation, imported constant) is not detected; the
 * pipeline's own promotion review remains the real control for that.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Keys whose string-literal values would be unsourced civic claims.
 * Not anchored: a literal may appear mid-line inside an object literal.
 */
const CLAIM_KEY =
  /(^|[{,(\s])(fee|cost|processing\s*_?time|turnaround|processingTime|processingTimeText)\s*:\s*/i;

/**
 * The second shape the original defect used: a display label naming the claim,
 * paired with a sibling literal value, e.g. `{ label: 'Fee', value: '₱150' }`.
 * A key-only scan would miss this entirely, so both shapes are checked.
 */
const LABEL_VALUE_PAIR =
  /label\s*:\s*['"`](fee|cost|processing\s*time|turnaround|time)['"`]/i;

const CLAIM_LABEL = /['"`](fee|cost|processing\s*time|turnaround)['"`]/i;

/** Directories never scanned (generated output, assets, dependencies). */
const SKIP_DIRS = new Set(['node_modules', '.next', 'out', 'dist', '.git']);

const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);

export interface ProvenanceFinding {
  file: string;
  line: number;
  text: string;
}

export interface ProvenanceOptions {
  /** Absolute or cwd-relative root to scan. Defaults to the repository root. */
  root?: string;
  /** Explicit file list, used by tests to scan a fixture. */
  files?: string[];
}

/** Collect every scannable source file under `dir`, skipping generated trees. */
export function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (current: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      // An unreadable directory cannot be scanned; skip it rather than crash the
      // guard, since the surrounding tree walk has already succeeded.
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        walk(full);
      } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
        out.push(full);
      }
    }
  };
  walk(dir);
  return out;
}

/** Returns one finding per offending line in `text`. */
export function scanText(text: string, file = '<text>'): ProvenanceFinding[] {
  const findings: ProvenanceFinding[] = [];
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;

    // Comment lines may still name these fields in prose.
    if (line.startsWith('//') || line.startsWith('*') || line.startsWith('/*')) return;

    // Shape 1: a claim-named key assigned a string literal.
    // Shape 2: a claim-named label paired with a literal value.
    const keyMatch = CLAIM_KEY.exec(raw);
    const pairMatch = LABEL_VALUE_PAIR.test(raw);
    if (!keyMatch && !pairMatch) return;

    // Only string literals are unambiguously authored in this file. A variable,
    // call, or template expression may come from the pipeline.
    const afterColon = keyMatch ? raw.slice(keyMatch.index + keyMatch[0].length) : raw;
    if (!/['"`]/.test(afterColon)) return;

    // Prose and CSS values are not claims: `<h2>Payments & Fees</h2>` and
    // `bg-[#fee2e2]` both contain the word "fee" with no numeric claim.
    // A JSX text node or class attribute on the same line is enough to skip it.
    if (/className\s*=|class\s*=|<\/?(span|p|h[1-6]|li|td|th|div)\b/.test(raw)) return;
    if (/<[A-Za-z][^>]*>[^<]*$/i.test(raw.trim())) return;

    findings.push({ file, line: index + 1, text: line });
  });
  return findings;
}

/** Scans the source tree (or an explicit file list) for unsourced civic claims. */
export function scanForClaims(options: ProvenanceOptions = {}): ProvenanceFinding[] {
  const root = options.root ?? process.cwd();
  const files = options.files ?? collectSourceFiles(path.join(root, 'src'));
  const findings: ProvenanceFinding[] = [];
  for (const file of files) {
    let text: string;
    try {
      text = fs.readFileSync(file, 'utf8');
    } catch {
      // A file that cannot be read is skipped; unreadable source is reported by
      // the typecheck and build steps that run alongside this guard.
      continue;
    }
    findings.push(...scanText(text, path.relative(root, file)));
  }
  return findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

function main(): void {
  const root = process.cwd();
  const findings = scanForClaims({ root });

  if (findings.length === 0) {
    console.log('fact:validate OK - no unsourced fee/cost/processing-time literals in src/.');
    return;
  }

  console.error('fact:validate FAILED - unsourced civic fee/cost/processing-time literals found:');
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}: ${f.text}`);
  }
  console.error(
    '\nThese values have no canonical source in data/civic/, so publishing them states an\n' +
      'unverified fact to residents. Remove the literal, or source the value through the\n' +
      'civic data pipeline (docs/data-pipeline.md) and render it from the record.',
  );
  process.exitCode = 1;
}

// Only run when invoked directly, so the exports stay unit-testable.
if (import.meta.main) {
  main();
}