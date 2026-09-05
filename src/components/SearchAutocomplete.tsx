'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  title: string;
  category: string;
  categoryId?: string;
  description?: string;
  keywords?: string[];
  fee?: string;
  processingTime?: string;
  office?: string;
  url: string;
}

interface SearchResult extends Service {
  score: number;
  _query: string;
}

interface Props {
  placeholder?: string;
}

const RECENT_SEARCHES_KEY = 'bettersancarlos_recent_searches';
const ANALYTICS_KEY = 'bettersancarlos_search_analytics';
const MAX_RECENT = 10;
const MAX_ANALYTICS = 100;

const CURATED_POPULAR = [
  'birth certificate',
  'business permit',
  'cedula',
  'real property tax',
  'senior citizen id',
  'pwd id',
  'barangay clearance',
  'building permit',
  'marriage certificate',
  'death certificate',
  'tricycle franchise',
  'property declaration',
  'online payment',
  'mswdo',
  'slaughterhouse',
];

function tokenize(text?: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(term: string, target: string, threshold = 0.3): boolean {
  if (target.includes(term) || term.includes(target)) return true;
  if (target.startsWith(term) || term.startsWith(target)) return true;
  const distance = levenshteinDistance(term, target);
  const maxLen = Math.max(term.length, target.length);
  if (maxLen === 0) return false;
  const similarity = 1 - distance / maxLen;
  return similarity >= 1 - threshold;
}

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  if (!query || query.length < 2) return;
  try {
    let recent = getRecentSearches();
    recent = recent.filter((q) => q.toLowerCase() !== query.toLowerCase());
    recent.unshift(query);
    recent = recent.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
  } catch {
    // localStorage unavailable
  }
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // ignore
  }
}

function getSearchAnalytics(): { query: string; count: number; lastSearched: number }[] {
  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function trackSearch(query: string, resultsCount: number) {
  if (!query || query.length < 2) return;
  try {
    let analytics = getSearchAnalytics();
    const existing = analytics.find((a) => a.query.toLowerCase() === query.toLowerCase());
    if (existing) {
      existing.count++;
      existing.lastSearched = Date.now();
    } else {
      analytics.push({ query, count: 1, lastSearched: Date.now() });
    }
    analytics.sort((a, b) => b.count - a.count);
    analytics = analytics.slice(0, MAX_ANALYTICS);
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  } catch {
    // ignore
  }
}

function getPopularSearches(limit = 5): string[] {
  const analytics = getSearchAnalytics();
  const popular = analytics
    .filter((a) => a.count >= 2)
    .slice(0, limit)
    .map((a) => a.query);
  CURATED_POPULAR.forEach((term) => {
    if (popular.length < limit && !popular.some((p) => p.toLowerCase() === term)) {
      popular.push(term);
    }
  });
  return popular;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightMatch(text: string, query: string): string {
  if (!query) return escapeHtml(text);
  const terms = tokenize(query);
  let result = escapeHtml(text);
  terms.forEach((term) => {
    if (term.length >= 2) {
      const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    }
  });
  return result;
}

function resolveRoute(url: string): string {
  if (url.startsWith('http') || url.startsWith('/')) return url;
  let clean = url.replace(/^\.\.\//, '').replace(/\.html$/, '');
  if (clean.includes('/')) {
    const parts = clean.split('/');
    return `/${parts[0]}/${parts[1]}`;
  }
  return `/services/${clean}`;
}

function buildIndex(services: Service[]) {
  const titleIndex = new Map<string, number[]>();
  const keywordIndex = new Map<string, number[]>();
  const categoryIndex = new Map<string, number[]>();
  const officeIndex = new Map<string, number[]>();
  const allTerms = new Set<string>();

  services.forEach((service, idx) => {
    tokenize(service.title).forEach((word) => {
      if (!titleIndex.has(word)) titleIndex.set(word, []);
      titleIndex.get(word)!.push(idx);
      allTerms.add(word);
    });
    (service.keywords || []).forEach((keyword) => {
      const kw = keyword.toLowerCase();
      if (!keywordIndex.has(kw)) keywordIndex.set(kw, []);
      keywordIndex.get(kw)!.push(idx);
      allTerms.add(kw);
    });
    tokenize(service.category).forEach((word) => {
      if (!categoryIndex.has(word)) categoryIndex.set(word, []);
      categoryIndex.get(word)!.push(idx);
    });
    tokenize(service.office).forEach((word) => {
      if (!officeIndex.has(word)) officeIndex.set(word, []);
      officeIndex.get(word)!.push(idx);
    });
  });

  return { titleIndex, keywordIndex, categoryIndex, officeIndex, allTerms };
}

function calculateScore(service: Service, searchTerms: string[], originalQuery: string): number {
  let score = 0;
  const titleLower = service.title.toLowerCase();
  const categoryLower = service.category.toLowerCase();
  const descLower = (service.description || '').toLowerCase();
  const officeLower = (service.office || '').toLowerCase();
  const processingTime = (service.processingTime || '').toLowerCase();
  const keywords = service.keywords || [];
  const queryLower = originalQuery.toLowerCase();

  if (titleLower === queryLower) score += 200;
  else if (titleLower.includes(queryLower)) score += 100;

  searchTerms.forEach((term) => {
    if (titleLower === term) score += 80;
    else if (titleLower.startsWith(term)) score += 60;
    else if (titleLower.includes(term)) score += 40;
    else if (isFuzzyMatch(term, titleLower, 0.25)) score += 20;

    keywords.forEach((keyword) => {
      const kw = keyword.toLowerCase();
      if (kw === term) score += 35;
      else if (kw.includes(term)) score += 20;
      else if (isFuzzyMatch(term, kw, 0.3)) score += 10;
    });

    if (categoryLower.includes(term)) score += 15;
    else if (isFuzzyMatch(term, categoryLower, 0.3)) score += 8;

    if (descLower.includes(term)) score += 10;

    if (officeLower.includes(term)) score += 12;
    else if (isFuzzyMatch(term, officeLower, 0.3)) score += 6;

    if (processingTime.includes(term)) score += 8;
  });

  if (service.fee) score += 2;
  if (service.processingTime) score += 2;
  if (service.description) score += 1;

  return score;
}

function searchServices(
  query: string,
  services: Service[],
  index: ReturnType<typeof buildIndex>,
  options: { category?: string | null; limit?: number } = {}
): SearchResult[] {
  if (!query || query.length < 2) return [];
  const { category = null, limit = 10 } = options;
  const searchTerms = tokenize(query);
  if (searchTerms.length === 0) return [];

  const candidateIndices = new Set<number>();
  searchTerms.forEach((term) => {
    const addMatches = (map: Map<string, number[]>) => {
      map.forEach((indices, key) => {
        if (isFuzzyMatch(term, key, 0.35)) indices.forEach((idx) => candidateIndices.add(idx));
      });
    };
    addMatches(index.titleIndex);
    addMatches(index.keywordIndex);
    addMatches(index.categoryIndex);
    addMatches(index.officeIndex);
  });

  const results: SearchResult[] = [];
  candidateIndices.forEach((idx) => {
    const service = services[idx];
    if (!service) return;
    if (
      category &&
      service.categoryId !== category &&
      !service.category.toLowerCase().includes(category.toLowerCase())
    ) {
      return;
    }
    const score = calculateScore(service, searchTerms, query);
    if (score > 0) {
      results.push({ ...service, score, _query: query });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

function getSuggestions(
  query: string,
  services: Service[],
  index: ReturnType<typeof buildIndex>
) {
  if (!query || query.length < 1) {
    return {
      popular: getPopularSearches(4),
      recent: getRecentSearches().slice(0, 3),
      suggestions: [] as string[],
    };
  }

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  services.forEach((service) => {
    if (service.title.toLowerCase().includes(queryLower)) {
      suggestions.add(service.title);
    }
  });

  index.allTerms.forEach((term) => {
    if (term.startsWith(queryLower) && term !== queryLower) {
      suggestions.add(term);
    }
  });

  CURATED_POPULAR.forEach((term) => {
    if (term.includes(queryLower) || isFuzzyMatch(queryLower, term, 0.4)) {
      suggestions.add(term);
    }
  });

  return {
    popular: [] as string[],
    recent: [] as string[],
    suggestions: Array.from(suggestions).slice(0, 8),
  };
}

export interface SearchAutocompleteHandle {
  getTopResultUrl: () => string | null;
  submit: () => void;
}

const SearchAutocomplete = forwardRef<SearchAutocompleteHandle, Props>(
  function SearchAutocomplete({ placeholder }, ref) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [index, setIndex] = useState<ReturnType<typeof buildIndex> | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [suggestions, setSuggestions] = useState<{
      popular: string[];
      recent: string[];
      suggestions: string[];
    }>({ popular: [], recent: [], suggestions: [] });
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimer = useRef<number | null>(null);

    const categories = useMemo(() => {
      const map = new Map<string, string>();
      services.forEach((s) => {
        if (s.categoryId && s.category) map.set(s.categoryId, s.category);
      });
      return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [services]);

    useEffect(() => {
      setLoading(true);
      fetch('/data/services.json')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load services'))))
        .then((data: { services?: Service[] }) => {
          const loaded = data.services || [];
          setServices(loaded);
          setIndex(buildIndex(loaded));
        })
        .catch((err) => {
          console.warn('Could not load services data:', err);
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
      function handleClick(e: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
          setSelectedIndex(-1);
        }
      }
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, []);

    useImperativeHandle(ref, () => ({
      getTopResultUrl: () => {
        if (results.length > 0) return resolveRoute(results[0].url);
        return null;
      },
      submit: () => {
        if (!index || !services.length) {
          router.push('/services');
          return;
        }
        const trimmed = query.trim();
        if (trimmed.length < 2) {
          router.push('/services');
          return;
        }
        if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
        const res = searchServices(trimmed, services, index, { category: currentCategory, limit: 10 });
        const sug = getSuggestions(trimmed, services, index);
        // Update state for consistency, but navigate synchronously from computed results.
        setResults(res);
        setSuggestions(sug);
        setOpen(true);
        trackSearch(trimmed, res.length);
        const url = res.length > 0 ? resolveRoute(res[0].url) : '/services';
        addRecentSearch(trimmed);
        setOpen(false);
        setSelectedIndex(-1);
        if (url.startsWith('http')) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    }));

    function performSearch(rawQuery: string, category: string | null = currentCategory) {
      const trimmed = rawQuery.trim();
      if (!index || !services.length) return;
      if (trimmed.length < 2) {
        const sug = getSuggestions(trimmed, services, index);
        setSuggestions(sug);
        setResults([]);
        return;
      }
      const res = searchServices(trimmed, services, index, { category, limit: 10 });
      const sug = getSuggestions(trimmed, services, index);
      setResults(res);
      setSuggestions(sug);
      trackSearch(trimmed, res.length);
    }

    function handleFocus() {
      if (!index) return;
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        const sug = getSuggestions('', services, index);
        setSuggestions(sug);
        setResults([]);
        setOpen(true);
      } else {
        performSearch(trimmed);
        setOpen(true);
      }
    }

    function handleInput(value: string) {
      setQuery(value);
      setSelectedIndex(-1);
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      if (!index) return;
      const trimmed = value.trim();
      if (trimmed.length < 2) {
        const sug = getSuggestions(trimmed, services, index);
        setSuggestions(sug);
        setResults([]);
        setOpen(true);
        return;
      }
      debounceTimer.current = window.setTimeout(() => {
        performSearch(trimmed);
        setOpen(true);
      }, 150);
    }

    function handleSelectSuggestion(suggestion: string) {
      setQuery(suggestion);
      performSearch(suggestion);
      inputRef.current?.focus();
    }

    function handleNavigate(url: string, saveRecent = false) {
      if (saveRecent) addRecentSearch(query);
      setOpen(false);
      setSelectedIndex(-1);
      if (url.startsWith('http')) {
        window.location.href = url;
      } else {
        router.push(url);
      }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const items = wrapperRef.current?.querySelectorAll<HTMLElement>(
        '.search-suggestion-item, .search-result-item'
      );
      if (!items) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && items[selectedIndex]) {
          e.preventDefault();
          const item = items[selectedIndex];
          const suggestion = item.getAttribute('data-suggestion');
          const href = item.getAttribute('data-href');
          if (suggestion) {
            handleSelectSuggestion(suggestion);
          } else if (href) {
            addRecentSearch(query);
            handleNavigate(href);
          }
        }
        // Unselected Enter falls through to form onSubmit which calls ref.submit().
      } else if (e.key === 'Escape') {
        setOpen(false);
        setSelectedIndex(-1);
      }
    }

    useEffect(() => {
      const items = wrapperRef.current?.querySelectorAll<HTMLElement>(
        '.search-suggestion-item, .search-result-item'
      );
      if (!items) return;
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }, [selectedIndex, results, suggestions, open]);

    function handleCategoryClick(categoryId: string) {
      setCurrentCategory(categoryId || null);
      performSearch(query, categoryId || null);
    }

    function handleClearRecent() {
      clearRecentSearches();
      if (index) {
        const sug = getSuggestions(query, services, index);
        setSuggestions(sug);
      }
    }

    // Tailwind equivalents of the legacy search-* styles. The
    // `search-suggestion-item` / `search-result-item` / `selected` names are
    // kept because keyboard navigation queries/toggles them via classList.
    const filterBtnCls = (isActive: boolean) =>
      `shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
        isActive
          ? 'border-primary bg-gradient-to-br from-primary to-[#2f6136] text-white shadow-[0_2px_8px_rgba(58, 125, 68,0.3)]'
          : 'border-[rgba(58, 125, 68,0.15)] bg-white text-[#555] hover:border-primary hover:bg-[rgba(58, 125, 68,0.04)] hover:text-primary'
      }`;
    const suggestionItemCls =
      'search-suggestion-item flex items-center border-l-[3px] border-l-transparent px-4 py-[11px] text-left text-sm text-[#333] no-underline transition-all duration-150 hover:border-l-primary hover:bg-gradient-to-r hover:from-[rgba(58, 125, 68,0.06)] hover:to-[rgba(58, 125, 68,0.02)] hover:text-primary hover:no-underline [&.selected]:border-l-primary [&.selected]:bg-gradient-to-r [&.selected]:from-[rgba(58, 125, 68,0.06)] [&.selected]:to-[rgba(58, 125, 68,0.02)] [&.selected]:text-primary [&_i]:mr-2.5 [&_i]:text-[0.8125rem] [&_i]:text-[#999] [&_i]:transition-colors hover:[&_i]:text-primary [&.selected]:[&_i]:text-primary';
    const resultItemCls =
      'search-result-item block border-b border-l-[3px] border-b-[rgba(58, 125, 68,0.06)] border-l-transparent px-4 py-[14px] text-left text-[#2f3e46] no-underline transition-all duration-150 last:border-b-0 hover:border-l-primary hover:bg-gradient-to-r hover:from-[rgba(58, 125, 68,0.06)] hover:to-[rgba(58, 125, 68,0.02)] hover:no-underline [&.selected]:border-l-primary [&.selected]:bg-gradient-to-r [&.selected]:from-[rgba(58, 125, 68,0.06)] [&.selected]:to-[rgba(58, 125, 68,0.02)]';
    const sectionHeaderCls =
      'flex items-center justify-between px-4 pb-2 pt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.5px] text-[#888] [&_i]:mr-[5px] [&_i]:text-primary';

    function renderDropdown() {
      if (!open) return null;

      const showSuggestions =
        suggestions.popular.length > 0 ||
        suggestions.recent.length > 0 ||
        suggestions.suggestions.length > 0;

      return (
        <div
          className="search-autocomplete absolute left-0 right-0 top-[calc(100%+6px)] z-[100] overflow-hidden rounded-[10px] border border-[rgba(58, 125, 68,0.12)] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
          role="listbox"
          aria-label="Search suggestions"
        >
          {categories.length > 0 && (
            <div className="flex flex-nowrap gap-1.5 overflow-x-auto rounded-t-[10px] border-b border-[rgba(58, 125, 68,0.06)] bg-gradient-to-b from-[#fafbfc] to-white px-[14px] py-3 [&::-webkit-scrollbar]:h-0">
              <button
                type="button"
                data-category=""
                className={filterBtnCls(!currentCategory)}
                onClick={() => handleCategoryClick('')}
              >
                All
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  data-category={cat.id}
                  className={filterBtnCls(currentCategory === cat.id)}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.name.split(' ')[0].replace(/,$/, '')}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center p-6 text-sm text-[#5c6b73]">
              <span className="mr-2.5 h-5 w-5 animate-[searchSpin_0.8s_linear_infinite] rounded-full border-2 border-[rgba(58, 125, 68,0.2)] border-t-primary" aria-hidden="true"></span>
              <span>Loading services…</span>
            </div>
          )}

          {!loading && showSuggestions && results.length === 0 && (
            <>
              {suggestions.recent.length > 0 && (
                <div className="border-b border-[rgba(58, 125, 68,0.06)] last:border-b-0">
                  <div className={sectionHeaderCls}>
                    <span>
                      <i className="bi bi-clock-history"></i> Recent Searches
                    </span>
                    <button
                      type="button"
                      className="cursor-pointer rounded border-0 bg-transparent px-2 py-[3px] text-[0.6875rem] font-medium text-primary transition-colors hover:bg-[rgba(58, 125, 68,0.08)]"
                      onClick={handleClearRecent}
                    >
                      Clear
                    </button>
                  </div>
                  {suggestions.recent.map((term) => (
                    <a
                      key={`recent-${term}`}
                      href="#"
                      className={suggestionItemCls}
                      data-suggestion={term}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(term);
                      }}
                    >
                      <i className="bi bi-arrow-counterclockwise"></i> {term}
                    </a>
                  ))}
                </div>
              )}
              {suggestions.popular.length > 0 && (
                <div className="border-b border-[rgba(58, 125, 68,0.06)] last:border-b-0">
                  <div className={sectionHeaderCls}>
                    <span>
                      <i className="bi bi-fire"></i> Popular Searches
                    </span>
                  </div>
                  {suggestions.popular.map((term) => (
                    <a
                      key={`popular-${term}`}
                      href="#"
                      className={suggestionItemCls}
                      data-suggestion={term}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(term);
                      }}
                    >
                      <i className="bi bi-search"></i> {term}
                    </a>
                  ))}
                </div>
              )}
              {suggestions.suggestions.length > 0 && (
                <div className="border-b border-[rgba(58, 125, 68,0.06)] last:border-b-0">
                  <div className={sectionHeaderCls}>
                    <span>
                      <i className="bi bi-lightbulb"></i> Did you mean?
                    </span>
                  </div>
                  {suggestions.suggestions.slice(0, 5).map((term) => (
                    <a
                      key={`suggest-${term}`}
                      href="#"
                      className={suggestionItemCls}
                      data-suggestion={term}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(term);
                      }}
                    >
                      <i className="bi bi-search"></i> {term}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <div className="px-6 py-8 text-center text-[#5c6b73]">
              <i className="bi bi-search mb-3 block text-[2.5rem] text-[rgba(58, 125, 68,0.2)]"></i>
              <p className="m-0 mb-1.5 font-semibold text-[#333]">No services found</p>
              <small className="text-[0.8125rem] text-[#888]">Try different keywords or check spelling</small>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              {results.map((result) => {
                const url = resolveRoute(result.url);
                return (
                  <a
                    key={result.id}
                    href={url}
                    className={resultItemCls}
                    role="option"
                    data-href={url}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate(url, true);
                    }}
                  >
                    <div className="mb-1.5 flex items-center gap-2 text-[0.9375rem] font-semibold text-primary [&_mark]:rounded-none [&_mark]:bg-[linear-gradient(180deg,transparent_60%,rgba(58, 125, 68,0.15)_60%)] [&_mark]:p-0 [&_mark]:text-inherit">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(result.title, result._query),
                        }}
                      />
                      {result.processingTime &&
                        result.processingTime.toLowerCase().includes('same day') && (
                          <span className="rounded bg-[rgba(58, 125, 68,0.1)] px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.3px] text-success">Fast</span>
                        )}
                    </div>
                    <div className="mb-1.5 flex flex-wrap gap-3 text-xs [&_i]:text-[0.6875rem] [&_i]:opacity-80 [&_span]:inline-flex [&_span]:items-center [&_span]:gap-[5px]">
                      <span className="rounded bg-[rgba(0,0,0,0.04)] px-2 py-0.5 text-[#5c6b73]">
                        <i className="bi bi-folder"></i> {result.category}
                      </span>
                      {result.fee && (
                        <span className="font-semibold text-success">
                          <i className="bi bi-cash"></i> {result.fee}
                        </span>
                      )}
                      {result.processingTime && (
                        <span className="text-[#0077be]">
                          <i className="bi bi-clock"></i> {result.processingTime}
                        </span>
                      )}
                    </div>
                    {result.office && (
                      <div className="mb-1 flex items-center text-xs text-[#777] [&_i]:mr-1.5 [&_i]:text-[0.6875rem] [&_i]:text-primary">
                        <i className="bi bi-building"></i> {result.office}
                      </div>
                    )}
                    {result.description && (
                      <div className="truncate text-[0.8125rem] leading-[1.4] text-[#5c6b73]">{result.description}</div>
                    )}
                  </a>
                );
              })}
              <div className="flex items-center justify-between border-t border-[rgba(58, 125, 68,0.06)] bg-[#fafbfc] px-4 py-2.5 text-xs text-[#888]">
                <span className="font-medium">
                  {results.length} service{results.length !== 1 ? 's' : ''} found
                </span>
                <span className="flex items-center justify-center gap-4 max-[767px]:hidden [&_kbd]:mx-0.5 [&_kbd]:inline-flex [&_kbd]:h-5 [&_kbd]:min-w-5 [&_kbd]:items-center [&_kbd]:justify-center [&_kbd]:rounded [&_kbd]:border [&_kbd]:border-[#ddd] [&_kbd]:bg-white [&_kbd]:px-[5px] [&_kbd]:font-inherit [&_kbd]:text-[0.625rem] [&_kbd]:font-semibold [&_kbd]:text-[#555] [&_kbd]:shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <span>
                    <kbd>↑</kbd>
                    <kbd>↓</kbd> Navigate
                  </span>
                  <span>
                    <kbd>Enter</kbd> Select
                  </span>
                  <span>
                    <kbd>Esc</kbd> Close
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div ref={wrapperRef} className="search-autocomplete-wrapper relative min-w-0 flex-1">
        <input
          ref={inputRef}
          type="search"
          id="hero-search"
          className="service-search-input w-full rounded-[10px] border-2 border-[#e2e8e0] bg-[#fafbfc] px-4 py-[14px] font-sans text-base text-foreground transition-all placeholder:text-[#9ca3af] hover:border-[#d0d5dd] hover:bg-white focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-[rgba(58, 125, 68,0.1)]"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Search services…'}
          aria-label="Search services"
          autoComplete="off"
        />
        {renderDropdown()}
      </div>
    );
  }
);

export default SearchAutocomplete;

