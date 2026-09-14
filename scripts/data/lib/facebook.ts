// Shared Facebook-post transform — the single home of the battle-tested
// logic from scripts/sync-facebook.js (categorize, deriveTitle, truncate,
// toDate, transformPost, isValidItem, mergeFeeds).
//
// Both the fixture-driven collector (collectors/facebook.ts) and the live
// ingestion path (scripts/data/ingest-facebook.ts, via scripts/sync-facebook.js)
// use these functions so scheduled runs and research runs classify
// identically. Pure and deterministic: same post → same output.

export const FB_TITLE_MAX = 120;
export const FB_SUMMARY_MAX = 300;
export const FB_MAX_ITEMS = 30;

export const FB_BADGES: Record<string, true> = { info: true, success: true, warning: true };

interface CategoryRule {
  category: string;
  badge: string;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Advisory',
    badge: 'warning',
    keywords: [
      'power interruption',
      'water interruption',
      'brownout',
      'outage',
      'road closure',
      'closure',
      'suspension',
      'suspended',
      'cancel',
      'postpone',
      'typhoon',
      'storm',
      'signal no',
      'flood',
      'evacuat',
      'landslide',
      'warning',
      'advisory',
      'alert',
      'emergency',
      'disaster',
      'lockdown',
      'curfew',
    ],
  },
  {
    category: 'Project',
    badge: 'success',
    keywords: [
      'groundbreaking',
      'inaugurat',
      'ribbon',
      'turnover',
      'completed',
      'completion',
      'unveil',
      'project',
      'construction',
      'infrastructure',
      'rehabilitation',
      'improvement',
      'road concreting',
      'opened',
      'now open',
    ],
  },
  {
    category: 'Event',
    badge: 'info',
    keywords: [
      'invites',
      'invitation',
      'join us',
      'will be held',
      'schedule of activities',
      'fiesta',
      'festival',
      'celebration',
      'ceremony',
      'program',
      'seminar',
      'training',
      'webinar',
      'fun run',
      'medical mission',
      'event',
      'foundation day',
    ],
  },
  {
    category: 'Announcement',
    badge: 'info',
    keywords: [
      'announce',
      'deadline',
      'renewal',
      'registration',
      'enroll',
      'hiring',
      'vacancy',
      'job order',
      'notice',
      'reminder',
      'requirements',
      'application',
      'now accepting',
      'available',
    ],
  },
];

const HASHTAG_MAP: Record<string, { category: string; badge: string }> = {
  advisory: { category: 'Advisory', badge: 'warning' },
  alert: { category: 'Advisory', badge: 'warning' },
  project: { category: 'Project', badge: 'success' },
  event: { category: 'Event', badge: 'info' },
  announcement: { category: 'Announcement', badge: 'info' },
  notice: { category: 'Announcement', badge: 'info' },
};

export function categorizeFbPost(message: string | null | undefined): { category: string; badge: string } {
  const text = (message ?? '').toLowerCase();

  // Editors can force a category from the post itself with a hashtag.
  const hashtags = text.match(/#([a-z0-9_]+)/g) ?? [];
  for (const tag of hashtags) {
    const hit = HASHTAG_MAP[tag.slice(1)];
    if (hit) return hit;
  }

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw)) return { category: rule.category, badge: rule.badge };
    }
  }
  return { category: 'Announcement', badge: 'info' };
}

export function collapseWhitespace(s: string | null | undefined): string {
  return String(s ?? '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export function truncateFb(s: string | null | undefined, max: number): string {
  const str = collapseWhitespace(s);
  if (str.length <= max) return str;
  const cut = str.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:!-]+$/, '') + '…';
}

export function deriveFbTitle(message: string | null | undefined, category: string): string {
  const firstLine = String(message ?? '')
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!firstLine) return `${category} Update`;
  // Prefer the first sentence if it's a reasonable length.
  const sentence = firstLine.split(/(?<=[.!?])\s/)[0];
  const base = sentence && sentence.length <= FB_TITLE_MAX ? sentence : firstLine;
  return truncateFb(base.replace(/#[a-z0-9_]+/gi, '').trim() || firstLine, FB_TITLE_MAX);
}

export function toFbDate(createdTime: string | null | undefined): string {
  // Graph returns ISO 8601, e.g. "2026-06-10T08:30:00+0000".
  const d = new Date(String(createdTime ?? ''));
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export interface FbRawPost {
  id?: unknown;
  message?: unknown;
  story?: unknown;
  created_time?: unknown;
  permalink_url?: unknown;
}

export interface FbPostItem {
  id: string;
  title: string;
  date: string;
  category: string;
  badge: string;
  summary: string;
  url: string | null;
  source: string;
}

export function transformFbPost(post: FbRawPost): FbPostItem {
  const message = typeof post.message === 'string' ? post.message : typeof post.story === 'string' ? post.story : '';
  const { category, badge } = categorizeFbPost(message);
  return {
    id: `fb-${String(post.id)}`,
    title: deriveFbTitle(message, category),
    date: toFbDate(typeof post.created_time === 'string' ? post.created_time : ''),
    category,
    badge,
    summary: message ? truncateFb(message, FB_SUMMARY_MAX) : 'See the full post on the official Facebook page.',
    url: typeof post.permalink_url === 'string' ? post.permalink_url : null,
    source: 'View on Facebook',
  };
}

// Validation — bad items are dropped, not written.
export function isValidFbItem(item: FbPostItem | null | undefined): boolean {
  if (!item || typeof item !== 'object') return false;
  if (!item.title || item.title.length > FB_TITLE_MAX) return false;
  if (!item.date || isNaN(new Date(`${item.date}T00:00:00`).getTime())) return false;
  if (!FB_BADGES[item.badge]) return false;
  if (!item.category) return false;
  if (!item.summary || item.summary.length > FB_SUMMARY_MAX) return false;
  if (item.url && !/^https?:\/\//i.test(item.url)) return false;
  return true;
}

// Merge: keep manual entries, replace Facebook entries with the fresh set.
// Manual = any item whose id does not start with 'fb-'. The combined list is
// newest-first; Facebook items are capped so one noisy run cannot flood it.
export function mergeFbFeeds<T extends { id: string; date?: string }>(
  existing: T[],
  fbItems: T[],
  maxFbItems: number = FB_MAX_ITEMS,
): T[] {
  const manual = (existing ?? []).filter((e) => !String(e.id ?? '').startsWith('fb-'));
  const fb = (fbItems ?? [])
    .slice()
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, maxFbItems);
  return manual.concat(fb).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}
