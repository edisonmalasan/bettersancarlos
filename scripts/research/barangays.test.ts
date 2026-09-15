import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { extractTables } from './lib/research';

// Production-corpus regression test for research/barangays/data/barangays.csv.
// Order authority: the contiguous # column (1..86) of the pre-migration table;
// spot values verified against the archived LGU list, totals against PSA.
const CSV_REL = path.join('research', 'barangays', 'data', 'barangays.csv');
const MD_REL = path.join('research', 'barangays', '26-09-barangay-directory.md');

const EXPECTED_IDS = [
  'abanon', 'agdao', 'anando', 'ano', 'antipangol', 'aponit', 'bacnar', 'balaya',
  'balayong', 'baldog', 'balite-sur', 'balococ', 'bani', 'bega', 'bocboc', 'bogaoan',
  'bolingit', 'bolosan', 'bonifacio-poblacion', 'buenglat', 'bugallon-posadas-st-poblacion',
  'burgos-padlan-poblacion', 'cacaritan', 'caingal', 'calobaoan', 'calomboyan',
  'caoayan-kiling', 'capataan', 'cobol', 'coliling', 'cruz', 'doyong', 'gamata',
  'guelew', 'ilang', 'inerangan', 'isla', 'libas', 'lilimasan', 'longos',
  'lucban-poblacion', 'mabalbalino', 'mabini-poblacion', 'magtaking', 'malacañang',
  'maliwara', 'mamarlao', 'manzon', 'matagdem', 'mestizo-norte', 'm-soriano-poblacion',
  'naguilayan', 'nelintap', 'padilla-gomez-poblacion', 'pagal', 'paitan-panoypoy',
  'palaming', 'palaris-poblacion', 'palospos', 'pangalangan', 'pangoloan', 'pangpang',
  'parayao', 'payapa', 'payar', 'perez-boulevard-poblacion', 'pnr-station-site-poblacion',
  'polo', 'quezon-boulevard-poblacion', 'quintong', 'rizal-avenue-poblacion',
  'roxas-boulevard-poblacion', 'salinap', 'san-juan', 'san-pedro-taloy-poblacion',
  'sapinit', 'supo', 'talang', 'tamayo', 'tandang-sora', 'tandoc', 'tarece',
  'tarectec', 'tayambani', 'tebag', 'turac',
];

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      out.push(field);
      field = '';
    } else field += ch;
  }
  out.push(field);
  return out;
}

function loadCsv(root: string): { headers: string[]; rows: string[][] } {
  const text = fs.readFileSync(path.join(root, CSV_REL), 'utf8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  return { headers, rows: lines.slice(1).map(splitCsvLine) };
}

function registerIds(root: string): Set<string> {
  const body = fs.readFileSync(path.join(root, MD_REL), 'utf8');
  const ids = new Set<string>();
  for (const table of extractTables(body)) {
    const heads = table.headers.map((h) => h.trim().toLowerCase());
    if (!heads.includes('id') || !heads.includes('type')) continue;
    const col = heads.indexOf('id');
    for (const row of table.rows) {
      const id = (row[col] ?? '').trim();
      if (/^S[1-9][0-9]*$/.test(id)) ids.add(id);
    }
  }
  return ids;
}

test('barangay sidecar keeps the authoritative 86-row order with a final total', () => {
  const root = process.cwd();
  const { headers, rows } = loadCsv(root);
  const at = (name: string) => {
    const i = headers.indexOf(name);
    assert.ok(i >= 0, `missing column ${name}`);
    return i;
  };
  assert.equal(rows.length, 87, '87 data rows excluding the header');
  const barangays = rows.slice(0, 86);
  const total = rows[86];
  assert.deepEqual(
    barangays.map((r) => r[at('id')]),
    EXPECTED_IDS,
    'barangay order and membership match the numbered directory',
  );
  assert.deepEqual(
    barangays.map((r) => r[at('num')]),
    Array.from({ length: 86 }, (_, i) => String(i + 1)),
    'num runs 1..86 in row order',
  );
  assert.equal(new Set(barangays.map((r) => r[at('id')])).size, 86, 'barangay ids are unique');
  assert.equal(total[at('id')], 'total', 'total row is last');
  assert.equal(total[at('num')], '', 'total row carries no num');
  const sum = (col: string, rs: string[][]) => rs.reduce((n, r) => n + parseInt(r[at(col)], 10), 0);
  assert.equal(sum('pop_2020', barangays), 205424, '2020 populations sum to the PSA total');
  assert.equal(sum('pop_2015', barangays), 188571, '2015 populations sum to the PSA total');
  assert.equal(parseInt(total[at('pop_2020')], 10), 205424, 'total row carries the 2020 total');
  assert.equal(parseInt(total[at('pop_2015')], 10), 188571, 'total row carries the 2015 total');
  const registered = registerIds(root);
  assert.ok(registered.size > 0, 'document register found');
  for (const r of rows) {
    for (const token of (r[at('sources')] ?? '')
      .replace(/`/g, '')
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '')) {
      assert.ok(/^S[1-9][0-9]*$/.test(token), `well-formed source reference ${token}`);
      assert.ok(registered.has(token), `source reference ${token} resolves in the register`);
    }
  }
});
