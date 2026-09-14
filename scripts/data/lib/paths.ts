import path from 'node:path';

// All pipeline commands resolve the repository through here so tests and
// fixtures can point at a scratch tree with CIVIC_ROOT.
export function repoRoot(): string {
  return process.env.CIVIC_ROOT ?? process.cwd();
}

export function civicDir(root: string = repoRoot()): string {
  return path.join(root, 'data', 'civic');
}

export function recordsPath(root: string = repoRoot()): string {
  return path.join(civicDir(root), 'records.json');
}

export function sourcesPath(root: string = repoRoot()): string {
  return path.join(civicDir(root), 'sources.json');
}

export function registryPath(root: string = repoRoot()): string {
  return path.join(civicDir(root), 'source-registry.yaml');
}

export function schemasDir(root: string = repoRoot()): string {
  return path.join(civicDir(root), 'schemas');
}

export function runsDir(root: string = repoRoot()): string {
  return path.join(root, 'research', 'runs');
}
