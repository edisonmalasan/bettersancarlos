// Two-file atomic commit for the canonical pair (records.json + sources.json).
//
// Each individual rename is atomic, but the pair is not: a crash between the
// two renames would leave a torn canonical state. This helper stages both
// replacements, snapshots the live files, renames in order, verifies, and
// cleans up — rolling back to the complete previous pair on any failure.
// Crash leftovers (staged `.next-*`, backups `.prev-*`, legacy `.tmp-*`) are
// detected by detectTornPair (loud validation errors) and recovered
// deterministically by recoverAtomicPair (complete-if-valid else restore).
// Git remains the final backstop. No database, no new dependencies.
//
// Recovery assumes no concurrent writer (promotions are CLI-invoked and the
// scheduled workflow serializes runs).

import fs from 'node:fs';
import path from 'node:path';

export interface AtomicPairOptions {
  pid?: number;
  /** Test-only fault injection: throw after the first rename to simulate a mid-commit crash. */
  faultAfterFirstRename?: boolean;
}

export type RecoverResult = 'clean' | 'completed' | 'restored' | 'cleaned';

function stagedName(file: string, pid: number): string {
  return `${file}.next-${pid}`;
}

function backupName(file: string, pid: number): string {
  return `${file}.prev-${pid}`;
}

function tryRemove(p: string): void {
  try {
    fs.rmSync(p, { force: true });
  } catch {
    // Best effort only; detection will surface leftovers.
  }
}

function parseJsonFile(p: string): unknown {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function commitAtomicPair(
  dir: string,
  files: Record<string, unknown>,
  opts: AtomicPairOptions = {},
): void {
  const pid = opts.pid ?? process.pid;
  const names = Object.keys(files);
  // 1. Stage both replacements. Throws before anything live is touched.
  for (const name of names) {
    fs.writeFileSync(path.join(dir, stagedName(name, pid)), JSON.stringify(files[name], null, 2) + '\n');
  }
  const staged = names.map((name) => path.join(dir, stagedName(name, pid)));
  const live = names.map((name) => path.join(dir, name));
  const backups = names.map((name) => path.join(dir, backupName(name, pid)));
  const existed = live.map((p) => fs.existsSync(p));
  try {
    // 2. Snapshot the live pair.
    live.forEach((p, i) => {
      if (existed[i]) fs.copyFileSync(p, backups[i]);
    });
    // 3. Commit in order.
    let renamed = 0;
    try {
      for (const tmp of staged) {
        fs.renameSync(tmp, live[staged.indexOf(tmp)]);
        renamed++;
        if (opts.faultAfterFirstRename && renamed === 1 && staged.length > 1) {
          throw new Error('atomic: injected fault after first rename (test only)');
        }
      }
    } catch (commitErr) {
      // 4. Roll back to the complete previous pair.
      let restored = true;
      live.forEach((p, i) => {
        try {
          if (existed[i]) fs.copyFileSync(backups[i], p);
          else fs.rmSync(p, { force: true });
        } catch {
          restored = false;
        }
      });
      staged.forEach(tryRemove);
      if (restored) backups.forEach(tryRemove);
      throw commitErr;
    }
    // 5. Verify readability of the committed pair.
    for (const p of live) parseJsonFile(p);
    // 6. Success cleanup: no temp, backup, or journal artifacts remain.
    backups.forEach(tryRemove);
  } catch (err) {
    staged.forEach(tryRemove);
    throw err;
  }
}

/** Stray transaction artifact basenames in dir (staged, backups, legacy tmps). Empty means clean. */
export function detectTornPair(dir: string, files: string[]): string[] {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return [];
  }
  const wanted = new Set<string>();
  for (const name of files) {
    for (const f of entries) {
      if (f === name) continue;
      if (f.startsWith(`${name}.next-`) || f.startsWith(`${name}.prev-`) || f.startsWith(`${name}.tmp-`)) {
        wanted.add(f);
      }
    }
  }
  return [...wanted].sort();
}

function groupByPid(names: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const name of names) {
    const match = /-(\d+)$/.exec(name);
    if (!match) continue;
    const list = groups.get(match[1]) ?? [];
    list.push(name);
    groups.set(match[1], list);
  }
  return groups;
}

function mtimeOf(dir: string, name: string): number {
  try {
    return fs.statSync(path.join(dir, name)).mtimeMs;
  } catch {
    return -1;
  }
}

/**
 * Deterministically recover a torn directory: complete the newest fully
 * staged pair that parses, else restore the newest complete backup set,
 * else remove orphan artifacts. Returns what happened ('clean' = nothing
 * was there). Never guesses between incomplete alternatives — leftovers it
 * cannot resolve deterministically are left for loud validation errors.
 */
export function recoverAtomicPair(dir: string, files: string[]): RecoverResult {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return 'clean';
  }
  const stagedFor = (pid: string): string[] => files.map((f) => `${f}.next-${pid}`);
  const backupFor = (pid: string): string[] => files.map((f) => `${f}.prev-${pid}`);
  const present = new Set(entries);

  // Newest complete staged set whose contents all parse: finish the commit.
  const stagedPids = [...groupByPid(entries.filter((f) => files.some((base) => f.startsWith(`${base}.next-`)))).keys()];
  stagedPids.sort((a, b) => Math.max(...stagedFor(b).map((f) => mtimeOf(dir, f))) - Math.max(...stagedFor(a).map((f) => mtimeOf(dir, f))));
  for (const pid of stagedPids) {
    const set = stagedFor(pid);
    if (!set.every((f) => present.has(f))) continue;
    try {
      for (const f of set) parseJsonFile(path.join(dir, f));
    } catch {
      continue;
    }
    for (const f of set) {
      const base = f.slice(0, -`.next-${pid}`.length);
      fs.renameSync(path.join(dir, f), path.join(dir, base));
      tryRemove(path.join(dir, `${base}.prev-${pid}`));
    }
    return 'completed';
  }

  // Newest complete backup set: restore it over the live files.
  const backupPids = [...groupByPid(entries.filter((f) => files.some((base) => f.startsWith(`${base}.prev-`)))).keys()];
  backupPids.sort((a, b) => Math.max(...backupFor(b).map((f) => mtimeOf(dir, f))) - Math.max(...backupFor(a).map((f) => mtimeOf(dir, f))));
  for (const pid of backupPids) {
    const set = backupFor(pid);
    if (!set.every((f) => present.has(f))) continue;
    for (const f of set) {
      const base = f.slice(0, -`.prev-${pid}`.length);
      fs.copyFileSync(path.join(dir, f), path.join(dir, base));
      tryRemove(path.join(dir, f));
    }
    return 'restored';
  }

  // Orphan temps/backups/legacy files: remove them.
  const orphans = detectTornPair(dir, files);
  if (orphans.length === 0) return 'clean';
  orphans.forEach((f) => tryRemove(path.join(dir, f)));
  return 'cleaned';
}
