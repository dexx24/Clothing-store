import type { Gender } from '@/types';

const MAX_TERMS = 6;

const STOP_WORDS = new Set(['a', 'an', 'the', 'for', 'and', 'in', 'of', 'with', 'to', 'on']);

// Typing "men" or "women" narrows by gender instead of matching text, so no filter UI is needed.
const GENDER_WORDS: Record<string, Gender> = {
  men: 'men',
  mens: 'men',
  man: 'men',
  women: 'women',
  womens: 'women',
  woman: 'women',
};

export interface ParsedQuery {
  /** Whole query, lowercased and cleaned, for phrase ranking. */
  phrase: string;
  /** Searchable words: lowercased, stop words removed, simple plurals folded ("hoodies" -> "hoodie"). */
  terms: string[];
  gender?: Gender;
}

const foldPlural = (w: string) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);

export function parseQuery(query: string): ParsedQuery {
  const words = query
    .toLowerCase()
    .replace(/['\u2019]/g, '') // "men's" -> "mens"
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ') // strip characters that would break PostgREST filters
    .split(/\s+/)
    .filter(Boolean);

  const genders = new Set<Gender>();
  const rest: string[] = [];
  for (const w of words) {
    const g = GENDER_WORDS[w];
    if (g) genders.add(g);
    else if (!STOP_WORDS.has(w)) rest.push(w);
  }

  return {
    phrase: words.join(' '),
    terms: [...new Set(rest.map(foldPlural))].slice(0, MAX_TERMS),
    gender: genders.size === 1 ? [...genders][0] : undefined,
  };
}
