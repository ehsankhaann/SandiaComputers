import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Check, Columns3, Filter, Search, X } from "lucide-react";
import { Link, navigate, type Route } from "@/lib/router";
import { cn } from "@/utils/cn";
import { categories, categoryMap, formatPrice, products } from "@/data/products";
import type { CategorySlug, Product } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Fields";
import { Badge, Container, Modal } from "@/components/ui/Primitives";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";

type Sort = "featured" | "price-asc" | "price-desc" | "name";
const priceBands = [
  { id: "lt1500", label: "Under $1,500", test: (p: number) => p < 1500 },
  { id: "1500-3000", label: "$1,500 – $3,000", test: (p: number) => p >= 1500 && p < 3000 },
  { id: "3000-6000", label: "$3,000 – $6,000", test: (p: number) => p >= 3000 && p < 6000 },
  { id: "gt6000", label: "$6,000+", test: (p: number) => p >= 6000 },
];
const badgeFilters = ["NDAA Compliant", "ISV Certified", "Best Seller"];

export function SystemsPage({ route }: { route: Route }) {
  const categoryParam = route.query.get("category") as CategorySlug | null;
  const category = categoryParam && categoryMap[categoryParam] ? categoryParam : null;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [bands, setBands] = useState<string[]>([]);
  const [forms, setForms] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(route.query.get("compare") === "1");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    if (route.query.get("compare") === "1") setCompareMode(true);
  }, [route.query]);

  const formFactors = useMemo(() => {
    const set = new Set<string>();
    products
      .filter((p) => !category || p.category === category)
      .forEach((p) => set.add(p.formFactor.split(" (")[0].split(" / ")[0]));
    return [...set].sort();
  }, [category]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (q) {
        const hay = [p.name, p.tagline, p.description, ...p.useCases, ...p.specs.map((s) => s.value)].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (bands.length && !bands.some((b) => priceBands.find((x) => x.id === b)?.test(p.startingPrice))) return false;
      if (forms.length && !forms.some((f) => p.formFactor.startsWith(f))) return false;
      if (badges.length && !badges.every((b) => p.badges.includes(b))) return false;
      return true;
    });
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [category, search, bands, forms, badges, sort]);

  const activeFilterCount = bands.length + forms.length + badges.length;
  const reset = () => {
    setSearch("");
    setBands([]);
    setForms([]);
    setBadges([]);
  };
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const toggleCompare = (slug: string) =>
    setCompareIds((ids) => (ids.includes(slug) ? ids.filter((x) => x !== slug) : ids.length < 3 ? [...ids, slug] : ids));

  const current = category ? categoryMap[category] : null;

  const filterPanel = (
    <div className="space-y-7">
      <FilterGroup title="Price">
        {priceBands.map((b) => (
          <CheckRow key={b.id} label={b.label} checked={bands.includes(b.id)} onChange={() => toggle(bands, setBands, b.id)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Form factor">
        {formFactors.map((f) => (
          <CheckRow key={f} label={f} checked={forms.includes(f)} onChange={() => toggle(forms, setForms, f)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Certifications">
        {badgeFilters.map((b) => (
          <CheckRow key={b} label={b} checked={badges.includes(b)} onChange={() => toggle(badges, setBadges, b)} />
        ))}
      </FilterGroup>
      {activeFilterCount > 0 && (
        <button type="button" onClick={reset} className="text-sm font-semibold text-brand-red hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Page header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/systems" className="hover:text-slate-900">
              Systems
            </Link>
            {current && (
              <>
                <span className="mx-2">/</span>
                <span className="text-slate-900">{current.shortName}</span>
              </>
            )}
          </nav>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {current ? current.name : "All systems"}
              </h1>
              <p className="mt-3 text-slate-600 sm:text-lg">
                {current
                  ? current.description
                  : "Every system below is a starting point. Customize any configuration, or tell us the outcome you need and we'll build the spec."}
              </p>
            </div>
            <Button to="/configurator" variant="outline">
              Build your own <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Category tabs */}
          <div className="-mx-4 mt-8 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
            <div className="flex w-max gap-2" role="tablist" aria-label="System categories">
              <TabButton active={!category} onClick={() => navigate("/systems")}>
                All ({products.length})
              </TabButton>
              {categories.map((c) => (
                <TabButton key={c.slug} active={category === c.slug} onClick={() => navigate(`/systems?category=${c.slug}`)}>
                  {c.shortName} ({products.filter((p) => p.category === c.slug).length})
                </TabButton>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, spec or use case…"
              aria-label="Search systems"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-[15px] placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 lg:hidden"
            >
              <Filter className="h-4 w-4" /> Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-blue px-1 text-[11px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setCompareMode((m) => !m);
                if (compareMode) setCompareIds([]);
              }}
              aria-pressed={compareMode}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors",
                compareMode ? "border-brand-blue bg-brand-blue-light text-brand-blue" : "border-slate-300 bg-white text-slate-800",
              )}
            >
              <Columns3 className="h-4 w-4" /> Compare
            </button>
            <div className="w-44">
              <label htmlFor="sort" className="sr-only">
                Sort
              </label>
              <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name A–Z</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28 rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-900">Filters</h2>
              {filterPanel}
            </div>
          </aside>

          <div className="lg:col-span-9">
            <p className="text-sm text-slate-500" aria-live="polite">
              Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of {products.length} systems
              {compareMode && <span className="ml-2 text-brand-blue">· Select up to 3 to compare</span>}
            </p>
            {filtered.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <p className="text-lg font-semibold text-slate-900">No systems match those filters.</p>
                <p className="mt-2 text-sm text-slate-600">Try clearing filters—or tell us what you need and we'll spec it.</p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button variant="outline" onClick={reset}>
                    Clear filters
                  </Button>
                  <Button to="/quote">Request a custom quote</Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    compare={
                      compareMode
                        ? { selected: compareIds.includes(p.slug), onToggle: () => toggleCompare(p.slug), disabled: compareIds.length >= 3 }
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[95] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-slate-900/50 animate-fade-in" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setFiltersOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>
            <div className="border-t border-slate-200 p-4 safe-bottom">
              <Button full size="lg" onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} systems
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Compare bar */}
      {compareMode && compareIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-[72px] z-40 px-3 md:bottom-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lift">
            <div className="flex flex-1 flex-wrap gap-2">
              {compareIds.map((id) => {
                const p = products.find((x) => x.slug === id)!;
                return (
                  <span key={id} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-800">
                    {p.name}
                    <button type="button" aria-label={`Remove ${p.name}`} onClick={() => toggleCompare(id)} className="ml-0.5 rounded p-0.5 hover:bg-slate-200">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            <Button size="sm" onClick={() => setCompareOpen(true)} disabled={compareIds.length < 2}>
              Compare ({compareIds.length})
            </Button>
          </div>
        </div>
      )}

      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} items={compareIds.map((id) => products.find((p) => p.slug === id)!)} />
    </>
  );
}

/* ------------------------------------------------------------------ */
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "h-11 whitespace-nowrap rounded-full border px-5 text-sm font-semibold transition-colors",
        active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-slate-900">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-[40px] cursor-pointer items-center gap-3 rounded-lg px-1 text-sm text-slate-700 hover:bg-slate-50">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-blue/40",
          checked ? "border-brand-blue bg-brand-blue text-white" : "border-slate-300 bg-white",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      {label}
    </label>
  );
}

function CompareModal({ open, onClose, items }: { open: boolean; onClose: () => void; items: Product[] }) {
  const { addItem, toast } = useApp();
  const labels = useMemo(() => {
    const seen: string[] = [];
    items.forEach((p) => p.specs.forEach((s) => !seen.includes(s.label) && seen.push(s.label)));
    return seen;
  }, [items]);

  return (
    <Modal open={open} onClose={onClose} title="Compare systems" size="xl">
      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 py-3 text-left align-bottom text-xs font-bold uppercase tracking-wider text-slate-400">System</th>
              {items.map((p) => (
                <th key={p.slug} className="py-3 pl-4 text-left align-bottom">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-3 text-base font-bold text-slate-900">{p.name}</p>
                  <p className="font-normal text-slate-500">{p.tagline}</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">{formatPrice(p.startingPrice)}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 border-t border-slate-200">
            <tr>
              <th className="py-3 pr-4 text-left font-semibold text-slate-700">Category</th>
              {items.map((p) => (
                <td key={p.slug} className="py-3 pl-4 text-slate-700">
                  {categoryMap[p.category].shortName}
                </td>
              ))}
            </tr>
            <tr>
              <th className="py-3 pr-4 text-left font-semibold text-slate-700">Form factor</th>
              {items.map((p) => (
                <td key={p.slug} className="py-3 pl-4 text-slate-700">
                  {p.formFactor}
                </td>
              ))}
            </tr>
            {labels.map((label) => (
              <tr key={label}>
                <th className="py-3 pr-4 text-left font-semibold text-slate-700">{label}</th>
                {items.map((p) => (
                  <td key={p.slug} className="py-3 pl-4 text-slate-700">
                    {p.specs.find((s) => s.label === label)?.value ?? <span className="text-slate-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th className="py-3 pr-4 text-left font-semibold text-slate-700">Lead time</th>
              {items.map((p) => (
                <td key={p.slug} className="py-3 pl-4 text-slate-700">
                  {p.leadTime}
                </td>
              ))}
            </tr>
            <tr>
              <th className="py-3 pr-4 text-left font-semibold text-slate-700">Warranty</th>
              {items.map((p) => (
                <td key={p.slug} className="py-3 pl-4 text-slate-700">
                  {p.warranty}
                </td>
              ))}
            </tr>
            <tr>
              <th className="py-3 pr-4 text-left font-semibold text-slate-700">Badges</th>
              {items.map((p) => (
                <td key={p.slug} className="py-3 pl-4">
                  <div className="flex flex-wrap gap-1">
                    {p.badges.map((b) => (
                      <Badge key={b}>{b}</Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <th className="py-4 pr-4" />
              {items.map((p) => (
                <td key={p.slug} className="py-4 pl-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        addItem({ id: p.slug, name: p.name, detail: p.tagline, price: p.startingPrice, kind: "system", link: `/systems/${p.slug}` });
                        toast(`${p.name} added to your quote list.`);
                      }}
                    >
                      Add to quote
                    </Button>
                    <Button size="sm" variant="outline" to={`/systems/${p.slug}`} onClick={onClose}>
                      View details
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
