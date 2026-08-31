/**
 * Convert a barangay (or any) name into a URL-safe slug.
 * Shared by the barangay listing links and the [slug] detail route so
 * both always produce identical slugs.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics (e.g. ñ -> n)
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumerics -> hyphen
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}
