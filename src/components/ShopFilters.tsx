import Link from 'next/link';
import type { Gender, SortKey } from '@/types';

interface Props {
  categories: { slug: string; name: string }[];
  active: { gender?: Gender; category?: string; sort?: SortKey };
  /** Route the filter links point at. Defaults to the shop page. */
  basePath?: string;
  /** Search text to carry through when filtering from the search page. */
  query?: string;
  showSort?: boolean;
}

const GENDERS: { value?: Gender; label: string }[] = [
  { label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
];

const SORTS: { value?: SortKey; label: string }[] = [
  { label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

function href(basePath: string, query: string | undefined, current: Props['active'], patch: Partial<Props['active']>) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (next.gender) params.set('gender', next.gender);
  if (next.category) params.set('category', next.category);
  if (next.sort) params.set('sort', next.sort);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-x-5 gap-y-1">
      {children}
    </div>
  );
}

function Option({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={to}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={active ? 'underline underline-offset-4' : 'text-neutral-500 hover:text-neutral-900'}
    >
      {children}
    </Link>
  );
}

export default function ShopFilters({ categories, active, basePath = '/shop', query, showSort = true }: Props) {
  const link = (patch: Partial<Props['active']>) => href(basePath, query, active, patch);

  return (
    <div className="flex flex-col gap-3 text-sm md:flex-row md:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:gap-10">
        <Group label="Gender">
          {GENDERS.map((g) => (
            <Option key={g.label} to={link({ gender: g.value })} active={active.gender === g.value}>
              {g.label}
            </Option>
          ))}
        </Group>
        <Group label="Category">
          <Option to={link({ category: undefined })} active={!active.category}>
            All
          </Option>
          {categories.map((c) => (
            <Option key={c.slug} to={link({ category: c.slug })} active={active.category === c.slug}>
              {c.name}
            </Option>
          ))}
        </Group>
      </div>
      {showSort && (
        <Group label="Sort">
          {SORTS.map((s) => (
            <Option key={s.label} to={link({ sort: s.value })} active={active.sort === s.value}>
              {s.label}
            </Option>
          ))}
        </Group>
      )}
    </div>
  );
}
