'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface NewsEntry {
    id: string;
    title: string;
    date: string;
    category: string;
    badge: 'info' | 'success' | 'warning';
    summary: string;
    url: string | null;
    source?: string;
}

const DATA_URL = '/data/news.json';
const BADGES: Record<string, 'info' | 'success' | 'warning'> = {
    info: 'info',
    success: 'success',
    warning: 'warning',
};
const PRESET_BADGE: Record<string, 'info' | 'success' | 'warning'> = {
    announcement: 'info',
    advisory: 'warning',
    project: 'success',
    event: 'info',
    service: 'success',
    notice: 'warning',
    health: 'info',
    weather: 'warning',
};

export default function NewsEditorPage() {
    const [entries, setEntries] = useState<NewsEntry[]>([]);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [statusText, setStatusText] = useState('');
    const [statusKind, setStatusKind] = useState('');

    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [badge, setBadge] = useState<'info' | 'success' | 'warning'>('info');
    const [category, setCategory] = useState('');
    const [summary, setSummary] = useState('');
    const [url, setUrl] = useState('');
    const [source, setSource] = useState('');
    const [id, setId] = useState('');

    const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchFromServer();
    }, []);

    useEffect(() => {
        if (editingIndex === -1 && title) {
            setId(uniqueId(slugify(title), entries, editingIndex));
        }
    }, [title]);

    useEffect(() => {
        const preset = PRESET_BADGE[category.trim().toLowerCase()];
        if (preset) setBadge(preset);
    }, [category]);

    function slugify(s: string) {
        return (s || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 70);
    }

    function uniqueId(base: string, all: NewsEntry[], ignoreIndex: number) {
        let candidate = base || 'update';
        const taken = new Set(all.filter((_, i) => i !== ignoreIndex).map((e) => e.id));
        if (!taken.has(candidate)) return candidate;
        let n = 2;
        while (taken.has(`${candidate}-${n}`)) n++;
        return `${candidate}-${n}`;
    }

    function fmtDate(d: string) {
        const dt = new Date(`${d}T00:00:00`);
        if (isNaN(dt.getTime())) return d || '—';
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function escHtml(s: string) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function normalize(list: any[]): NewsEntry[] {
        return (list || []).map((e, i) => ({
            id: e.id || slugify(e.title) || `update-${i + 1}`,
            title: e.title || '',
            date: e.date || '',
            category: e.category || '',
            badge: BADGES[e.badge] ? e.badge : 'info',
            summary: e.summary || '',
            url: e.url || null,
            source: e.source || undefined,
        }));
    }

    function setStatus(msg: string, kind?: string) {
        setStatusText(msg || '');
        setStatusKind(kind || '');
    }

    function fetchFromServer() {
        setStatus('Loading…', '');
        fetch(DATA_URL, { cache: 'no-store' })
            .then((r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then((data) => {
                const normalized = normalize((data && data.news) || []);
                setEntries(normalized);
                clearForm(normalized);
                setStatus(`Loaded ${normalized.length} entries from server.`, 'ok');
            })
            .catch((err) => {
                setEntries([]);
                clearForm([]);
                setStatus(`Could not load data/news.json (${err.message}). Use “Import file”.`, 'bad');
            });
    }

    function clearForm(nextEntries?: NewsEntry[]) {
        setEditingIndex(-1);
        setTitle('');
        setDate(new Date().toISOString().slice(0, 10));
        setBadge('info');
        setCategory('');
        setSummary('');
        setUrl('');
        setSource('');
        setId(uniqueId('', nextEntries ?? entries, -1));
        setInvalidFields(new Set());
    }

    function loadIntoForm(i: number) {
        const e = entries[i];
        setEditingIndex(i);
        setTitle(e.title || '');
        setDate(e.date || '');
        setBadge(BADGES[e.badge] ? e.badge : 'info');
        setCategory(e.category || '');
        setSummary(e.summary || '');
        setUrl(e.url || '');
        setSource(e.source || '');
        setId(e.id || '');
        setInvalidFields(new Set());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validUrl(u: string) {
        if (!u) return true;
        return /^https?:\/\/.+/i.test(u);
    }

    function collectAndValidate(): NewsEntry | null {
        const bad = new Set<string>();
        const idSlug = slugify(id.trim());

        if (!title.trim() || title.trim().length > 120) bad.add('title');
        if (!date || isNaN(new Date(`${date}T00:00:00`).getTime())) bad.add('date');
        if (!BADGES[badge]) bad.add('badge');
        if (!category.trim() || category.trim().length > 32) bad.add('category');
        if (!summary.trim() || summary.trim().length > 300) bad.add('summary');
        if (!validUrl(url.trim())) bad.add('url');

        const finalId = idSlug || slugify(title.trim());
        const duplicate = entries.some((e, i) => i !== editingIndex && e.id === finalId);
        if (!finalId || duplicate) bad.add('id');

        setInvalidFields(bad);
        if (bad.size > 0) return null;

        const item: NewsEntry = {
            id: finalId,
            title: title.trim(),
            date,
            category: category.trim(),
            badge,
            summary: summary.trim(),
            url: url.trim() || null,
        };
        if (source.trim()) item.source = source.trim();
        return item;
    }

    function toJSON() {
        const sorted = entries.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        return JSON.stringify({ news: sorted }, null, 2) + '\n';
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const item = collectAndValidate();
        if (!item) {
            setStatus('Please fix the highlighted fields.', 'bad');
            return;
        }
        const next = entries.slice();
        if (editingIndex === -1) {
            next.push(item);
            setStatus(`Added “${item.title}”. Remember to Download news.json.`, 'ok');
        } else {
            next[editingIndex] = item;
            setStatus(`Updated “${item.title}”. Remember to Download news.json.`, 'ok');
        }
        setEntries(next);
        clearForm(next);
    }

    function handleDelete(i: number) {
        if (!confirm(`Delete “${entries[i].title}”?`)) return;
        const next = entries.filter((_, idx) => idx !== i);
        setEntries(next);
        if (editingIndex === i) clearForm(next);
        else if (editingIndex > i) setEditingIndex(editingIndex - 1);
        setStatus('Deleted. Remember to Download news.json.', 'ok');
    }

    function handleDownload() {
        const blob = new Blob([toJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'news.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        setStatus('Downloaded news.json — replace data/news.json and deploy.', 'ok');
    }

    function handleCopy() {
        navigator.clipboard.writeText(toJSON()).then(
            () => setStatus('JSON copied to clipboard.', 'ok'),
            () => setStatus('Copy failed — use Download instead.', 'bad')
        );
    }

    function handleImport(ev: React.ChangeEvent<HTMLInputElement>) {
        const file = ev.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(String(reader.result));
                const normalized = normalize((data && data.news) || []);
                setEntries(normalized);
                clearForm(normalized);
                setStatus(`Imported ${normalized.length} entries from file.`, 'ok');
            } catch {
                setStatus('Invalid JSON file.', 'bad');
            }
        };
        reader.readAsText(file);
        ev.target.value = '';
    }

    const sortedEntries = useMemo(
        () =>
            entries
                .map((e, i) => ({ e, i }))
                .sort((a, b) => (b.e.date || '').localeCompare(a.e.date || '')),
        [entries]
    );

    const previewBadgeClass = `nc-badge b-${badge}`;

    return (
        <>
            <style>{`
        :root {
          --primary: #1d4ed8;
          --primary-dark: #1e3a8a;
          --border: #e5e7eb;
          --text: #1f2937;
          --muted: #6b7280;
          --bg: #f3f4f6;
          --danger: #b91c1c;
          --ok: #15803d;
        }
        .ne-app-header {
          background: #fff;
          border-bottom: 1px solid var(--border);
          padding: 14px 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .ne-app-header h1 {
          font-size: 1.05rem;
          margin: 0;
          flex: 1 1 220px;
        }
        .ne-tag {
          font-size: 0.7rem;
          background: #fef3c7;
          color: #b45309;
          padding: 2px 8px;
          border-radius: 50px;
          font-weight: 600;
        }
        .ne-btn {
          font: inherit;
          cursor: pointer;
          border: 1px solid var(--border);
          background: #fff;
          color: var(--text);
          padding: 8px 12px;
          border-radius: 8px;
        }
        .ne-btn:hover { border-color: var(--primary); }
        .ne-btn-primary {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }
        .ne-btn-primary:hover { background: var(--primary-dark); }
        .ne-btn-danger { color: var(--danger); border-color: #fecaca; }
        .ne-main {
          display: grid;
          grid-template-columns: minmax(280px, 360px) 1fr;
          gap: 18px;
          padding: 18px 20px;
          align-items: start;
        }
        @media (max-width: 840px) {
          .ne-main { grid-template-columns: 1fr; }
        }
        .ne-panel {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }
        .ne-panel h2 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--muted);
          margin: 0 0 12px;
        }
        .ne-entry {
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 10px;
        }
        .ne-entry.active {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.15);
        }
        .ne-entry .row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: baseline;
        }
        .ne-entry strong {
          font-size: 0.92rem;
          line-height: 1.3;
        }
        .ne-entry .meta {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 4px;
        }
        .ne-entry .actions {
          margin-top: 8px;
          display: flex;
          gap: 6px;
        }
        .ne-entry .actions button {
          padding: 4px 9px;
          font-size: 0.78rem;
        }
        .ne-field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          margin: 12px 0 4px;
        }
        .ne-field label .opt {
          color: var(--muted);
          font-weight: 400;
        }
        .ne-field input,
        .ne-field select,
        .ne-field textarea {
          width: 100%;
          font: inherit;
          padding: 8px 10px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: #fff;
        }
        .ne-field textarea {
          min-height: 84px;
          resize: vertical;
        }
        .ne-hint {
          font-size: 0.72rem;
          color: var(--muted);
          margin-top: 4px;
        }
        .ne-counter.over {
          color: var(--danger);
          font-weight: 600;
        }
        .ne-err {
          color: var(--danger);
          font-size: 0.75rem;
          margin-top: 4px;
          display: none;
        }
        .ne-field.invalid input,
        .ne-field.invalid textarea,
        .ne-field.invalid select {
          border-color: var(--danger);
        }
        .ne-field.invalid .ne-err { display: block; }
        .ne-form-actions {
          margin-top: 16px;
          display: flex;
          gap: 8px;
        }
        .ne-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ne-status {
          font-size: 0.78rem;
          color: var(--muted);
          margin-left: auto;
        }
        .ne-status.ok { color: var(--ok); }
        .ne-status.bad { color: var(--danger); }
        .ne-preview-wrap {
          margin-top: 14px;
          border-top: 1px dashed var(--border);
          padding-top: 14px;
        }
        .ne-nc {
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          max-width: 360px;
          background: #fff;
        }
        .ne-nc-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px 0;
        }
        .ne-nc-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 50px;
        }
        .b-info { background: #e0f2fe; color: #0369a1; }
        .b-success { background: #dcfce7; color: #15803d; }
        .b-warning { background: #fef3c7; color: #b45309; }
        .ne-nc-date { font-size: 0.75rem; color: var(--muted); }
        .ne-nc-body { padding: 8px 14px 14px; }
        .ne-nc-title { font-size: 1rem; font-weight: 600; margin: 0 0 6px; }
        .ne-nc-desc { font-size: 0.8125rem; color: var(--muted); margin: 0; line-height: 1.55; }
        .ne-nc-foot {
          padding: 0 14px 12px;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--primary);
        }
        .visually-hidden {
          position: absolute;
          left: -9999px;
        }
      `}</style>

            <header className="ne-app-header">
                <h1>
                    News Curation <span className="ne-tag">internal tool · not deployed</span>
                </h1>
                <button className="ne-btn" type="button" onClick={fetchFromServer}>
                    Reload from server
                </button>
                <button className="ne-btn" type="button" onClick={() => fileInputRef.current?.click()}>
                    Import file…
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="visually-hidden"
                    onChange={handleImport}
                />
                <button className="ne-btn" type="button" onClick={handleCopy}>
                    Copy JSON
                </button>
                <button className="ne-btn ne-btn-primary" type="button" onClick={handleDownload}>
                    Download news.json
                </button>
                <span className={`ne-status ${statusKind}`}>{statusText}</span>
            </header>

            <main className="ne-main">
                <section className="ne-panel" aria-label="Current entries">
                    <h2>Entries ({entries.length})</h2>
                    <button
                        className="ne-btn ne-btn-primary"
                        type="button"
                        style={{ width: '100%', marginBottom: 12 }}
                        onClick={() => {
                            clearForm();
                            document.getElementById('f-title')?.focus();
                        }}
                    >
                        + Add new update
                    </button>
                    <div id="list">
                        {sortedEntries.length === 0 && <p className="ne-hint">No updates yet. Click “Add new update”.</p>}
                        {sortedEntries.map(({ e, i }) => (
                            <div key={e.id + i} className={`ne-entry${i === editingIndex ? ' active' : ''}`}>
                                <div className="row">
                                    <strong dangerouslySetInnerHTML={{ __html: escHtml(e.title) }} />
                                </div>
                                <div className="meta">
                                    {escHtml(e.category)} · {escHtml(e.badge)} · {fmtDate(e.date)}
                                    {e.url ? ' · 🔗' : ''}
                                </div>
                                <div className="actions">
                                    <button className="ne-btn" type="button" onClick={() => loadIntoForm(i)}>
                                        Edit
                                    </button>
                                    <button className="ne-btn ne-btn-danger" type="button" onClick={() => handleDelete(i)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="ne-panel" aria-label="Editor">
                    <h2>{editingIndex === -1 ? 'Add update' : 'Edit update'}</h2>
                    <form noValidate onSubmit={handleSubmit}>
                        <div className={`ne-field${invalidFields.has('title') ? ' invalid' : ''}`}>
                            <label htmlFor="f-title">Title</label>
                            <input
                                id="f-title"
                                maxLength={120}
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className="ne-hint">
                                <span className={`ne-counter${title.length > 120 ? ' over' : ''}`}>{title.length}</span>/120
                            </div>
                            <div className="ne-err">A title is required (max 120 characters).</div>
                        </div>

                        <div className="ne-grid-2">
                            <div className={`ne-field${invalidFields.has('date') ? ' invalid' : ''}`}>
                                <label htmlFor="f-date">Date</label>
                                <input
                                    id="f-date"
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <div className="ne-err">A valid date is required.</div>
                            </div>
                            <div className={`ne-field${invalidFields.has('badge') ? ' invalid' : ''}`}>
                                <label htmlFor="f-badge">Badge color</label>
                                <select
                                    id="f-badge"
                                    required
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value as NewsEntry['badge'])}
                                >
                                    <option value="info">info (blue)</option>
                                    <option value="success">success (green)</option>
                                    <option value="warning">warning (amber)</option>
                                </select>
                                <div className="ne-err">Choose a badge color.</div>
                            </div>
                        </div>

                        <div className={`ne-field${invalidFields.has('category') ? ' invalid' : ''}`}>
                            <label htmlFor="f-category">Category label</label>
                            <input
                                id="f-category"
                                list="category-presets"
                                maxLength={32}
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <datalist id="category-presets">
                                <option value="Announcement" />
                                <option value="Advisory" />
                                <option value="Project" />
                                <option value="Event" />
                                <option value="Service" />
                                <option value="Notice" />
                                <option value="Health" />
                                <option value="Weather" />
                            </datalist>
                            <div className="ne-hint">Presets auto-pick a badge color; you can override it above.</div>
                            <div className="ne-err">A category label is required.</div>
                        </div>

                        <div className={`ne-field${invalidFields.has('summary') ? ' invalid' : ''}`}>
                            <label htmlFor="f-summary">Summary</label>
                            <textarea
                                id="f-summary"
                                maxLength={300}
                                required
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                            <div className="ne-hint">
                                <span className={`ne-counter${summary.length > 300 ? ' over' : ''}`}>{summary.length}</span>/300
                            </div>
                            <div className="ne-err">A summary is required (max 300 characters).</div>
                        </div>

                        <div className={`ne-field${invalidFields.has('url') ? ' invalid' : ''}`}>
                            <label htmlFor="f-url">
                                Link URL <span className="opt">(optional — e.g. the Facebook post)</span>
                            </label>
                            <input
                                id="f-url"
                                type="url"
                                placeholder="https://facebook.com/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <div className="ne-err">Enter a valid http(s) URL or leave blank.</div>
                        </div>

                        <div className="ne-field">
                            <label htmlFor="f-source">
                                Link label <span className="opt">(optional)</span>
                            </label>
                            <input
                                id="f-source"
                                maxLength={40}
                                placeholder="View on Facebook"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                            <div className="ne-hint">Shown on the link. Defaults to “Read more” when a URL is set.</div>
                        </div>

                        <div className={`ne-field${invalidFields.has('id') ? ' invalid' : ''}`}>
                            <label htmlFor="f-id">
                                ID <span className="opt">(auto from title; must be unique)</span>
                            </label>
                            <input
                                id="f-id"
                                maxLength={80}
                                required
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <div className="ne-err">A unique ID is required (lowercase, dashes).</div>
                        </div>

                        <div className="ne-form-actions">
                            <button className="ne-btn ne-btn-primary" type="submit">
                                Save update
                            </button>
                            <button
                                className="ne-btn"
                                type="button"
                                onClick={() => clearForm(entries)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div className="ne-preview-wrap">
                        <h2>Live preview (News page card)</h2>
                        <article className="ne-nc">
                            <div className="ne-nc-head">
                                <span className={`ne-nc-badge ${previewBadgeClass}`}>{category || 'Category'}</span>
                                <span className="ne-nc-date">{fmtDate(date)}</span>
                            </div>
                            <div className="ne-nc-body">
                                <h3 className="ne-nc-title">{title || 'Title preview'}</h3>
                                <p className="ne-nc-desc">{summary || 'Summary preview…'}</p>
                            </div>
                            {url && (
                                <div className="ne-nc-foot">{(source.trim() || 'Read more') + ' →'}</div>
                            )}
                        </article>
                    </div>
                </section>
            </main>
        </>
    );
}
