/**
 * Phase B join (research-data-integration, tasks.md 3.1):
 * Joins population_2020 / population_2015 from src/data/demographics.json
 * (canonical PSA source) onto every entry in src/data/barangay-officials.json
 * by canonical barangay name. Adds poblacion flags from the research table
 * (research/barangays/26-09-barangay-directory.md lists "(Poblacion)" barangays)
 * and shared-line flags for mobiles the research documents as duplicated.
 * Also fixes the mojibake em dash in the top-level source field.
 *
 * Gate: 86/86 matched, zero unmatched, sums must equal the census totals
 * (205,424 for 2020 / 188,571 for 2015) or the script exits non-zero.
 */
import fs from 'node:fs';

const OFFICIALS_PATH = 'src/data/barangay-officials.json';
const DEMOGRAPHICS_PATH = 'src/data/demographics.json';

const bo = JSON.parse(fs.readFileSync(OFFICIALS_PATH, 'utf8').replace(/^\uFEFF/, ''));
const dem = JSON.parse(fs.readFileSync(DEMOGRAPHICS_PATH, 'utf8').replace(/^\uFEFF/, ''));

const demByName = new Map(dem.barangays.map((b) => [b.name, b]));

// Barangays the research table marks as "(Poblacion)" — the only per-barangay
// urban-area evidence in the verified corpus (14 of 86; the LGU aggregate is
// 30 urban / 56 rural, remainder undocumented).
const POBLACION = new Set([
  'Bonifacio',
  'Bugallon-Posadas St.',
  'Burgos-Padlan',
  'Lucban',
  'Mabini',
  'M. Soriano St.',
  'Padilla-Gomez',
  'Palaris',
  'Perez Boulevard',
  'PNR Station Site',
  'Quezon Boulevard',
  'Rizal Avenue',
  'Roxas Boulevard',
  'San Pedro-Taloy',
]);

// Duplicate mobiles documented in research (do NOT invent; flag as shared).
const SHARED_TELS = {
  '09282087902': ['Agdao', 'Polo'],
  '09464969107': ['Doyong', 'Turac'],
};

const unmatched = [];
for (const b of bo.barangays) {
  const d = demByName.get(b.barangay);
  if (!d) {
    unmatched.push(b.barangay);
    continue;
  }
  b.population_2020 = d.population_2020;
  b.population_2015 = d.population_2015;
  b.poblacion = POBLACION.has(b.barangay);
  const shared = SHARED_TELS[b.tel];
  if (shared && shared.length > 1) {
    b.tel_status = 'shared line';
    b.tel_shared_with = shared.filter((n) => n !== b.barangay);
  }
}

bo.source =
  'City Government of San Carlos — Barangay Officials (official LGU site, archived 2024-06-03); research/barangays/26-09-barangay-directory.md';
bo.populations_source = 'PSA 2020/2015 Census of Population via PhilAtlas (canonical copy: data/demographics.json)';
bo.urban_rural_split = {
  total: 86,
  urban: 30,
  rural: 56,
  source: 'LGU Demography page (archived 2024-06-03) via research/barangays/26-09-barangay-directory.md',
  note: 'Per-barangay urban/rural classification is not in the verified research corpus; only the 30/56 aggregate and the (Poblacion) barangays are documented. poblacion:true marks barangays the research table lists as (Poblacion).',
};
bo.term_note =
  'Captains reflect the term following the October 2023 Barangay and Sangguniang Kabataan Elections (BSKE); re-validate after the next BSKE.';

const sum2020 = bo.barangays.reduce((s, b) => s + (b.population_2020 || 0), 0);
const sum2015 = bo.barangays.reduce((s, b) => s + (b.population_2015 || 0), 0);
const poblacionCount = bo.barangays.filter((b) => b.poblacion).length;

console.log(`matched: ${bo.barangays.length - unmatched.length}/86`);
console.log(`unmatched: ${JSON.stringify(unmatched)}`);
console.log(`sum 2020: ${sum2020} (expect 205424)`);
console.log(`sum 2015: ${sum2015} (expect 188571)`);
console.log(`poblacion-flagged: ${poblacionCount}`);

if (unmatched.length > 0 || bo.barangays.length !== 86 || sum2020 !== 205424 || sum2015 !== 188571) {
  console.error('JOIN FAILED — file NOT written');
  process.exit(1);
}

fs.writeFileSync(OFFICIALS_PATH, JSON.stringify(bo, null, 2) + '\n');
console.log('JOIN OK — 86/86, file written (2-space indent)');
