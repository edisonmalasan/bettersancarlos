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

    const previewBadgeClass =
        badge === 'success'
            ? 'bg-[#dcfce7] text-[#15803d]'
            : badge === 'warning'
              ? 'bg-[#fef3c7] text-[#b45309]'
              : 'bg-[#e0f2fe] text-[#0369a1]';

    // Tailwind equivalents of the legacy ne-* styles from the removed <style> block.
    const neBtn =
        'cursor-pointer rounded-lg border border-[#e2e8e0] bg-white px-3 py-2 text-[#1f2937] transition-colors hover:border-[#3a7d44]';
    const neBtnPrimary = `${neBtn} border-[#3a7d44] bg-[#3a7d44] text-white hover:bg-[#2f6136]`;
    const neBtnSm =
        'cursor-pointer rounded-lg border border-[#e2e8e0] bg-white px-[9px] py-1 text-[0.78rem] text-[#1f2937] transition-colors hover:border-[#3a7d44]';
    const neBtnSmDanger = `${neBtnSm} border-[#fecaca] text-[#b91c1c]`;
    const nePanelH2 = 'm-0 mb-3 text-[0.85rem] font-semibold uppercase tracking-[0.04em] text-[#6b7280]';
    const neInput = 'w-full rounded-lg border border-[#e2e8e0] bg-white px-2.5 py-2 text-[#1f2937] focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-[rgba(58, 125, 68,0.2)]';
    const neInputInvalid = 'w-full rounded-lg border border-[#b91c1c] bg-white px-2.5 py-2 text-[#1f2937] focus:border-[#b91c1c] focus:outline-none focus:ring-[3px] focus:ring-[rgba(58, 125, 68,0.2)]';
    const neLabel = 'mb-1 mt-3 block text-[0.8rem] font-semibold';
    const neHint = 'mt-1 text-[0.72rem] text-[#6b7280]';

    return (
        <>
            <header className="sticky top-0 z-[5] flex flex-wrap items-center gap-2.5 border-b border-[#e2e8e0] bg-white px-5 py-[14px]">
                <h1 className="m-0 flex-[1_1_220px] text-[1.05rem]">
                    News Curation <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[0.7rem] font-semibold text-[#b45309]">internal tool · not deployed</span>
                </h1>
                <button className={neBtn} type="button" onClick={fetchFromServer}>
                    Reload from server
                </button>
                <button className={neBtn} type="button" onClick={() => fileInputRef.current?.click()}>
                    Import file…
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="absolute left-[-9999px]"
                    onChange={handleImport}
                />
                <button className={neBtn} type="button" onClick={handleCopy}>
                    Copy JSON
                </button>
                <button className={neBtnPrimary} type="button" onClick={handleDownload}>
                    Download news.json
                </button>
                <span className={`ml-auto text-[0.78rem] ${statusKind === 'ok' ? 'text-[#15803d]' : statusKind === 'bad' ? 'text-[#b91c1c]' : 'text-[#6b7280]'}`}>{statusText}</span>
            </header>

            <main className="grid grid-cols-[minmax(280px,360px)_1fr] items-start gap-[18px] px-5 py-[18px] max-[840px]:grid-cols-1">
                <section className="rounded-xl border border-[#e2e8e0] bg-white p-4" aria-label="Current entries">
                    <h2 className={nePanelH2}>Entries ({entries.length})</h2>
                    <button
                        className={neBtnPrimary}
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
                        {sortedEntries.length === 0 && <p className={neHint}>No updates yet. Click “Add new update”.</p>}
                        {sortedEntries.map(({ e, i }) => (
                            <div key={e.id + i} className={`mb-2.5 rounded-[10px] border px-3 py-2.5 ${i === editingIndex ? 'border-[#3a7d44] shadow-[0_0_0_2px_rgba(58, 125, 68,0.15)]' : 'border-[#e2e8e0]'}`}>
                                <div className="flex items-baseline justify-between gap-2">
                                    <strong className="text-[0.92rem] leading-[1.3]" dangerouslySetInnerHTML={{ __html: escHtml(e.title) }} />
                                </div>
                                <div className="mt-1 text-[0.72rem] text-[#6b7280]">
                                    {escHtml(e.category)} · {escHtml(e.badge)} · {fmtDate(e.date)}
                                    {e.url ? ' · 🔗' : ''}
                                </div>
                                <div className="mt-2 flex gap-1.5">
                                    <button className={neBtnSm} type="button" onClick={() => loadIntoForm(i)}>
                                        Edit
                                    </button>
                                    <button className={neBtnSmDanger} type="button" onClick={() => handleDelete(i)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-[#e2e8e0] bg-white p-4" aria-label="Editor">
                    <h2 className={nePanelH2}>{editingIndex === -1 ? 'Add update' : 'Edit update'}</h2>
                    <form noValidate onSubmit={handleSubmit}>
                        <div>
                            <label className={neLabel} htmlFor="f-title">Title</label>
                            <input
                                id="f-title"
                                className={invalidFields.has('title') ? neInputInvalid : neInput}
                                maxLength={120}
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div className={neHint}>
                                <span className={title.length > 120 ? 'font-semibold text-[#b91c1c]' : ''}>{title.length}</span>/120
                            </div>
                            <div className={invalidFields.has('title') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>A title is required (max 120 characters).</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <label className={neLabel} htmlFor="f-date">Date</label>
                                <input
                                    id="f-date"
                                    className={invalidFields.has('date') ? neInputInvalid : neInput}
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <div className={invalidFields.has('date') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>A valid date is required.</div>
                            </div>
                            <div>
                                <label className={neLabel} htmlFor="f-badge">Badge color</label>
                                <select
                                    id="f-badge"
                                    className={invalidFields.has('badge') ? neInputInvalid : neInput}
                                    required
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value as NewsEntry['badge'])}
                                >
                                    <option value="info">info (blue)</option>
                                    <option value="success">success (green)</option>
                                    <option value="warning">warning (amber)</option>
                                </select>
                                <div className={invalidFields.has('badge') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>Choose a badge color.</div>
                            </div>
                        </div>

                        <div>
                            <label className={neLabel} htmlFor="f-category">Category label</label>
                            <input
                                id="f-category"
                                className={invalidFields.has('category') ? neInputInvalid : neInput}
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
                            <div className={neHint}>Presets auto-pick a badge color; you can override it above.</div>
                            <div className={invalidFields.has('category') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>A category label is required.</div>
                        </div>

                        <div>
                            <label className={neLabel} htmlFor="f-summary">Summary</label>
                            <textarea
                                id="f-summary"
                                className={`${invalidFields.has('summary') ? neInputInvalid : neInput} min-h-[84px] resize-y`}
                                maxLength={300}
                                required
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                            <div className={neHint}>
                                <span className={summary.length > 300 ? 'font-semibold text-[#b91c1c]' : ''}>{summary.length}</span>/300
                            </div>
                            <div className={invalidFields.has('summary') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>A summary is required (max 300 characters).</div>
                        </div>

                        <div>
                            <label className={neLabel} htmlFor="f-url">
                                Link URL <span className="font-normal text-[#6b7280]">(optional — e.g. the Facebook post)</span>
                            </label>
                            <input
                                id="f-url"
                                className={invalidFields.has('url') ? neInputInvalid : neInput}
                                type="url"
                                placeholder="https://facebook.com/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                            <div className={invalidFields.has('url') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>Enter a valid http(s) URL or leave blank.</div>
                        </div>

                        <div>
                            <label className={neLabel} htmlFor="f-source">
                                Link label <span className="font-normal text-[#6b7280]">(optional)</span>
                            </label>
                            <input
                                id="f-source"
                                className={neInput}
                                maxLength={40}
                                placeholder="View on Facebook"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                            <div className={neHint}>Shown on the link. Defaults to “Read more” when a URL is set.</div>
                        </div>

                        <div>
                            <label className={neLabel} htmlFor="f-id">
                                ID <span className="font-normal text-[#6b7280]">(auto from title; must be unique)</span>
                            </label>
                            <input
                                id="f-id"
                                className={invalidFields.has('id') ? neInputInvalid : neInput}
                                maxLength={80}
                                required
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <div className={invalidFields.has('id') ? 'mt-1 block text-[0.75rem] text-[#b91c1c]' : 'hidden'}>A unique ID is required (lowercase, dashes).</div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className={neBtnPrimary} type="submit">
                                Save update
                            </button>
                            <button
                                className={neBtn}
                                type="button"
                                onClick={() => clearForm(entries)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div className="mt-[14px] border-t border-dashed border-[#e2e8e0] pt-[14px]">
                        <h2 className={nePanelH2}>Live preview (News page card)</h2>
                        <article className="max-w-[360px] overflow-hidden rounded-xl border border-[#e2e8e0] bg-white">
                            <div className="flex items-center justify-between px-[14px] pt-3">
                                <span className={`rounded-full px-2.5 py-1 text-[0.75rem] font-semibold ${previewBadgeClass}`}>{category || 'Category'}</span>
                                <span className="text-[0.75rem] text-[#6b7280]">{fmtDate(date)}</span>
                            </div>
                            <div className="px-[14px] pb-[14px] pt-2">
                                <h3 className="m-0 mb-1.5 text-base font-semibold">{title || 'Title preview'}</h3>
                                <p className="m-0 text-[0.8125rem] leading-[1.55] text-[#6b7280]">{summary || 'Summary preview…'}</p>
                            </div>
                            {url && (
                                <div className="px-[14px] pb-3 text-[0.8125rem] font-medium text-[#3a7d44]">{(source.trim() || 'Read more') + ' →'}</div>
                            )}
                        </article>
                    </div>
                </section>
            </main>
        </>
    );
}
