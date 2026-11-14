import { Check, Plus } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/utils/cn";
import { useApp } from "@/context/AppContext";
import { categoryMap, formatPrice } from "@/data/products";
import type { Product } from "@/data/types";
import { Badge } from "@/components/ui/Primitives";

interface Props {
  product: Product;
  compact?: boolean;
  compare?: { selected: boolean; onToggle: () => void; disabled?: boolean };
}

export function ProductCard({ product, compact = false, compare }: Props) {
  const { addItem, toast } = useApp();
  const specs = product.specs.slice(0, 3);

  const add = () => {
    addItem({
      id: product.slug,
      name: product.name,
      detail: product.tagline,
      price: product.startingPrice,
      kind: "system",
      link: `/systems/${product.slug}`,
    });
    toast(`${product.name} added to your quote list.`, { action: { label: "View", to: "/quote" } });
  };

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[22px] border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-brand-violet/40",
        compare?.selected ? "border-brand-violet ring-2 ring-brand-violet/20" : "border-brand-lav-deep/70",
      )}
    >
      <Link to={`/systems/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-brand-lav/50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {product.badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} tone={b === "Best Seller" ? "red" : b === "New" ? "blue" : "navy"}>
                {b}
              </Badge>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{categoryMap[product.category].shortName}</p>
        <h3 className="mt-1 text-lg font-bold text-slate-900">
          <Link to={`/systems/${product.slug}`} className="hover:text-brand-blue">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-slate-600">{product.tagline}</p>

        {!compact && (
          <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
            {specs.map((s) => (
              <li key={s.label} className="flex gap-2">
                <span className="w-20 shrink-0 text-slate-400">{s.label}</span>
                <span className="text-slate-700 line-clamp-1">{s.value}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Starting at</p>
              <p className="text-xl font-bold text-slate-900">{formatPrice(product.startingPrice)}</p>
            </div>
            <p className="text-right text-xs text-slate-500">
              Ships in
              <br />
              <span className="font-medium text-slate-700">{product.leadTime}</span>
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              to={`/systems/${product.slug}`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-ink/40 hover:bg-brand-lav"
            >
              Details
            </Link>
            <button
              type="button"
              onClick={add}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-brand-ink text-sm font-semibold text-white transition-colors hover:bg-brand-violet"
            >
              <Plus className="h-4 w-4" /> Quote
            </button>
          </div>
          {compare && (
            <button
              type="button"
              onClick={compare.onToggle}
              disabled={compare.disabled && !compare.selected}
              aria-pressed={compare.selected}
              className={cn(
                "mt-3 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40",
                compare.selected ? "bg-brand-blue-light text-brand-blue" : "text-slate-500 hover:bg-slate-50",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border",
                  compare.selected ? "border-brand-blue bg-brand-blue text-white" : "border-slate-300",
                )}
              >
                {compare.selected && <Check className="h-3 w-3" />}
              </span>
              {compare.selected ? "Added to compare" : "Add to compare"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
