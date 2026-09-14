import { collectCityWebsite } from './city-website';
import { collectFacebook } from './facebook';
import type { Collector } from './types';

// Registry collector names resolve here. Refresh refuses any source whose
// collector is null or not listed: collection is registry-driven only.
export const COLLECTORS: Record<string, Collector> = {
  facebook: collectFacebook,
  'city-website': collectCityWebsite,
};

export function resolveCollector(name: string | null): Collector | null {
  if (!name) return null;
  return COLLECTORS[name] ?? null;
}
