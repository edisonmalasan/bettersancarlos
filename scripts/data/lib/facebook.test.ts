import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  categorizeFbPost,
  deriveFbTitle,
  isValidFbItem,
  mergeFbFeeds,
  toFbDate,
  transformFbPost,
  truncateFb,
} from './facebook';

test('categorize matches keyword rules with hashtag override', () => {
  assert.deepEqual(categorizeFbPost('Power interruption advisory for Barangay Talang'), {
    category: 'Advisory',
    badge: 'warning',
  });
  assert.deepEqual(categorizeFbPost('Groundbreaking for the new road project'), {
    category: 'Project',
    badge: 'success',
  });
  assert.deepEqual(categorizeFbPost('Join us for the festival parade!'), {
    category: 'Event',
    badge: 'info',
  });
  assert.deepEqual(categorizeFbPost('Random post #project about nothing'), {
    category: 'Project',
    badge: 'success',
  });
  assert.deepEqual(categorizeFbPost('Just saying hello'), { category: 'Announcement', badge: 'info' });
});

test('deriveTitle prefers the first sentence and strips hashtags', () => {
  assert.equal(deriveFbTitle('Short line here', 'Advisory'), 'Short line here');
  assert.equal(deriveFbTitle('', 'Event'), 'Event Update');
  assert.equal(
    deriveFbTitle('Mango festival opens Saturday! #event Come join us.', 'Event'),
    'Mango festival opens Saturday!',
  );
});

test('truncate keeps whole words and appends an ellipsis', () => {
  assert.equal(truncateFb('short', 10), 'short');
  const long = truncateFb('word '.repeat(50), 30);
  assert.ok(long.length <= 30, long);
  assert.ok(long.endsWith('…'), long);
});

test('toFbDate parses Graph timestamps and rejects garbage', () => {
  assert.equal(toFbDate('2026-09-10T08:30:00+0000'), '2026-09-10');
  assert.equal(toFbDate('not a date'), '');
});

test('transformPost maps a Graph post to a feed item', () => {
  const item = transformFbPost({
    id: '123_456',
    message: 'Power interruption advisory for Barangay Talang tomorrow',
    created_time: '2026-09-10T08:30:00+0000',
    permalink_url: 'https://www.facebook.com/post/1',
  });
  assert.equal(item.id, 'fb-123_456');
  assert.equal(item.category, 'Advisory');
  assert.equal(item.badge, 'warning');
  assert.equal(item.date, '2026-09-10');
  assert.equal(item.url, 'https://www.facebook.com/post/1');
  assert.equal(item.source, 'View on Facebook');
  assert.ok(isValidFbItem(item));
});

test('isValidItem drops bad items instead of writing them', () => {
  const good = transformFbPost({
    id: '1',
    message: 'Hello world',
    created_time: '2026-09-10T08:30:00+0000',
  });
  assert.ok(isValidFbItem(good));
  assert.ok(!isValidFbItem({ ...good, badge: 'danger' }));
  assert.ok(!isValidFbItem({ ...good, date: '' }));
  assert.ok(!isValidFbItem({ ...good, url: 'ftp://example.test/x' }));
  assert.ok(!isValidFbItem(null));
});

test('mergeFeeds keeps manual entries and caps refreshed fb items newest-first', () => {
  const manual = { id: 'manual-1', date: '2020-01-01' };
  const fb = [
    { id: 'fb-old', date: '2026-09-08' },
    { id: 'fb-new', date: '2026-09-10' },
    { id: 'fb-mid', date: '2026-09-09' },
  ];
  const merged = mergeFbFeeds([manual, { id: 'fb-stale', date: '2020-06-01' }], fb, 2);
  assert.deepEqual(
    merged.map((e) => e.id),
    ['fb-new', 'fb-mid', 'manual-1'],
  );
});
