import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Copy, Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import { Link, navigate, type Route } from "@/lib/router";
import { cn } from "@/utils/cn";
import { baseSystems, componentGroups } from "@/data/configurator";
import { formatPrice, productMap } from "@/data/products";
import type { BaseSystemId, ComponentGroup, ComponentOption } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { Badge, Container } from "@/components/ui/Primitives";
import { useApp } from "@/context/AppContext";

type Selections = Record<string, string[]>;
const STORAGE_KEY = "sandia-config-v1";

function availableOptions(group: ComponentGroup, base: BaseSystemId): ComponentOption[] {
  return group.options.filter((o) => o.systems.includes(base));
}

function defaultsFor(base: BaseSystemId): Selections {
  const sel: Selections = {};
  componentGroups.forEach((g) => {
    const opts = availableOptions(g, base);
    if (g.multi) {
      sel[g.id] = [];
    } else {
      const rec = opts.find((o) => o.recommended) ?? opts[0];
      sel[g.id] = rec ? [rec.id] : [];
    }
  });
  return sel;
}

function volumeDiscount(qty: number) {
  if (qty >= 25) return 0.08;
  if (qty >= 10) return 0.05;
  if (qty >= 5) return 0.03;
  return 0;
}

export function ConfiguratorPage({ route }: { route: Route }) {
  const { addItem, toast } = useApp();
  const baseParam = route.query.get("base") as BaseSystemId | null;
  const fromSlug = route.query.get("from");
  const fromProduct = fromSlug ? productMap[fromSlug] : undefined;

  const [base, setBase] = useState<BaseSystemId>(() => {
    if (baseParam && baseSystems.some((b) => b.id === baseParam)) return baseParam;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.base && baseSystems.some((b) => b.id === saved.base)) return saved.base;
    } catch {
      /* noop */
    }
    return "workstation";
  });
  const [selections, setSelections] = useState<Selections>(() => {
    if (baseParam) return defaultsFor(baseParam);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.base && saved?.selections) return saved.selections as Selections;
    } catch {
      /* noop */
    }
    return defaultsFor("workstation");
  });
  const [qty, setQty] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (baseParam && baseParam !== base && baseSystems.some((b) => b.id === baseParam)) {
      setBase(baseParam);
      setSelections(defaultsFor(baseParam));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseParam]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ base, selections }));
    } catch {
      /* noop */
    }
  }, [base, selections]);

  const baseSystem = baseSystems.find((b) => b.id === base)!;

  const chosen = useMemo(
    () =>
      componentGroups.map((g) => ({
        group: g,
        options: availableOptions(g, base).filter((o) => (selections[g.id] ?? []).includes(o.id)),
      })),
    [base, selections],
  );

  const unitPrice = baseSystem.basePrice + chosen.reduce((sum, c) => sum + c.options.reduce((s, o) => s + o.price, 0), 0);
  const discount = volumeDiscount(qty);
  const total = Math.round(unitPrice * qty * (1 - discount));
  const leadDays =
    baseSystem.leadDays +
    (chosen.some((c) => c.options.some((o) => o.price >= 3000)) ? 2 : 0) +
    ((selections.services ?? []).includes("svc-burn") ? 4 : 0) +
    (qty >= 10 ? 3 : 0);

  const changeBase = (id: BaseSystemId) => {
    setBase(id);
    setSelections(defaultsFor(id));
  };

  const select = (group: ComponentGroup, optionId: string) => {
    setSelections((prev) => {
      if (group.multi) {
        const cur = prev[group.id] ?? [];
        return { ...prev, [group.id]: cur.includes(optionId) ? cur.filter((x) => x !== optionId) : [...cur, optionId] };
      }
      return { ...prev, [group.id]: [optionId] };
    });
  };

  const summaryText = () =>
    [
      `Sandia custom build — ${baseSystem.name}`,
      ...chosen.filter((c) => c.options.length).map((c) => `${c.group.name}: ${c.options.map((o) => o.name).join(", ")}`),
      `Quantity: ${qty}`,
      `Estimated total: ${formatPrice(total)}`,
    ].join("\n");

  const buildItem = () => ({
    id: `build-${base}-${Date.now()}`,
    name: `Custom ${baseSystem.name}`,
    detail: chosen
      .filter((c) => c.options.length && ["cpu", "gpu", "memory", "storage1"].includes(c.group.id))
      .map((c) => c.options.map((o) => o.name).join(", "))
      .join(" · "),
    price: unitPrice,
    kind: "build" as const,
    link: "/configurator",
  });

  const addToList = () => {
    addItem(buildItem(), qty);
    toast("Custom build added to your quote list.", { action: { label: "View", to: "/quote" } });
    setSheetOpen(false);
  };

  const requestQuote = () => {
    addItem(buildItem(), qty);
    navigate("/quote");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      toast("Build summary copied to clipboard.");
    } catch {
      toast("Copy not available in this browser.", { tone: "info" });
    }
  };

  const reset = () => {
    setSelections(defaultsFor(base));
    setQty(1);
    toast("Configuration reset to recommended defaults.", { tone: "info" });
  };

  const groupsForBase = componentGroups.filter((g) => availableOptions(g, base).length > 0);

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Configurator</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Build your system with live pricing.</h1>
          <p className="mt-3 max-w-2xl text-slate-600 sm:text-lg">
            Pick a platform, choose components and watch the estimate update. Send the build to a specialist and we'll validate compatibility, benchmark it and return a formal quote within one business day.
          </p>
          {fromProduct && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <Sparkles className="h-4 w-4 text-brand-red" /> Customizing from{" "}
              <Link to={`/systems/${fromProduct.slug}`} className="font-semibold text-brand-blue hover:underline">
                {fromProduct.name}
              </Link>
            </p>
          )}
        </Container>
      </section>

      <Container className="py-8 pb-32 sm:py-12 lg:pb-12">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Steps */}
          <div className="space-y-12 lg:col-span-8">
            {/* Base */}
            <section id="step-base">
              <StepHeading n={1} title="Choose a platform" description="Each platform unlocks the components appropriate for its workload." />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {baseSystems.map((b) => {
                  const active = b.id === base;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => changeBase(b.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex min-h-[96px] flex-col rounded-2xl border p-4 text-left transition-all",
                        active ? "border-brand-blue bg-brand-blue-light/60 ring-2 ring-brand-blue/20" : "border-slate-200 bg-white hover:border-slate-300",
                      )}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900">{b.name}</span>
                        <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border", active ? "border-brand-blue bg-brand-blue text-white" : "border-slate-300")}>
                          {active && <Check className="h-3 w-3" />}
                        </span>
                      </span>
                      <span className="mt-1 text-sm text-slate-600">{b.description}</span>
                      <span className="mt-2 text-xs font-semibold text-slate-500">Base from {formatPrice(b.basePrice)}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {groupsForBase.map((g, i) => {
              const opts = availableOptions(g, base);
              const sel = selections[g.id] ?? [];
              return (
                <section key={g.id} id={`step-${g.id}`}>
                  <StepHeading n={i + 2} title={g.name} description={g.description} />
                  <div className="mt-5 grid gap-3 sm:grid-cols-2" role={g.multi ? "group" : "radiogroup"} aria-label={g.name}>
                    {opts.map((o) => {
                      const active = sel.includes(o.id);
                      return (
                        <button
                          key={o.id}
                          type="button"
                          role={g.multi ? "checkbox" : "radio"}
                          aria-checked={active}
                          onClick={() => select(g, o.id)}
                          className={cn(
                            "flex min-h-[64px] items-start gap-3 rounded-xl border p-4 text-left transition-all",
                            active ? "border-brand-blue bg-brand-blue-light/60 ring-2 ring-brand-blue/20" : "border-slate-200 bg-white hover:border-slate-300",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border",
                              g.multi ? "rounded" : "rounded-full",
                              active ? "border-brand-blue bg-brand-blue text-white" : "border-slate-300",
                            )}
                          >
                            {active && <Check className="h-3 w-3" />}
                          </span>
                          <span className="flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-slate-900">{o.name}</span>
                              {o.recommended && <Badge tone="blue">Recommended</Badge>}
                            </span>
                            {o.note && <span className="mt-0.5 block text-sm text-slate-500">{o.note}</span>}
                          </span>
                          <span className={cn("shrink-0 text-sm font-semibold", o.price === 0 ? "text-slate-400" : o.price < 0 ? "text-emerald-600" : "text-slate-900")}>
                            {o.price === 0 ? "Included" : `${o.price > 0 ? "+" : "−"}${formatPrice(Math.abs(o.price))}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Desktop summary */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28 space-y-4">
              <Summary
                baseName={baseSystem.name}
                chosen={chosen}
                unitPrice={unitPrice}
                qty={qty}
                setQty={setQty}
                discount={discount}
                total={total}
                leadDays={leadDays}
                onAdd={addToList}
                onQuote={requestQuote}
                onCopy={copy}
                onReset={reset}
              />
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile summary bar + sheet */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        {sheetOpen && <div className="fixed inset-0 bg-slate-900/50 animate-fade-in" onClick={() => setSheetOpen(false)} />}
        <div className={cn("relative rounded-t-2xl border-t border-slate-200 bg-white shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.25)] safe-bottom", sheetOpen && "animate-slide-up")}>
          <button
            type="button"
            onClick={() => setSheetOpen((s) => !s)}
            aria-expanded={sheetOpen}
            className="flex w-full items-center justify-between gap-4 px-4 py-3"
          >
            <span className="text-left">
              <span className="block text-xs text-slate-500">Estimated total · {qty} unit{qty > 1 ? "s" : ""}</span>
              <span className="block text-xl font-extrabold text-slate-900">{formatPrice(total)}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
              {sheetOpen ? "Hide" : "Review build"} <ChevronDown className={cn("h-4 w-4 transition-transform", !sheetOpen && "rotate-180")} />
            </span>
          </button>
          {sheetOpen && (
            <div className="max-h-[60dvh] overflow-y-auto border-t border-slate-200 px-4 py-4">
              <Summary
                baseName={baseSystem.name}
                chosen={chosen}
                unitPrice={unitPrice}
                qty={qty}
                setQty={setQty}
                discount={discount}
                total={total}
                leadDays={leadDays}
                onAdd={addToList}
                onQuote={requestQuote}
                onCopy={copy}
                onReset={reset}
                bare
              />
            </div>
          )}
          {!sheetOpen && (
            <div className="grid grid-cols-2 gap-2 px-4 pb-3">
              <Button variant="outline" onClick={addToList}>
                Add to list
              </Button>
              <Button onClick={requestQuote}>Request quote</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
function StepHeading({ n, title, description }: { n: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{n}</span>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

interface SummaryProps {
  baseName: string;
  chosen: { group: ComponentGroup; options: ComponentOption[] }[];
  unitPrice: number;
  qty: number;
  setQty: (n: number) => void;
  discount: number;
  total: number;
  leadDays: number;
  onAdd: () => void;
  onQuote: () => void;
  onCopy: () => void;
  onReset: () => void;
  bare?: boolean;
}

function Summary({ baseName, chosen, unitPrice, qty, setQty, discount, total, leadDays, onAdd, onQuote, onCopy, onReset, bare }: SummaryProps) {
  return (
    <div className={cn(!bare && "rounded-2xl border border-slate-200 bg-white p-6 shadow-soft")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Your build</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{baseName}</h3>
        </div>
        <button type="button" onClick={onReset} className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <dl className="mt-4 space-y-2.5 border-t border-slate-200 pt-4 text-sm">
        {chosen
          .filter((c) => c.options.length > 0)
          .map((c) => (
            <div key={c.group.id} className="flex justify-between gap-3">
              <dt className="shrink-0 text-slate-500">{c.group.name}</dt>
              <dd className="text-right font-medium text-slate-800">{c.options.map((o) => o.name).join(", ")}</dd>
            </div>
          ))}
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm font-semibold text-slate-800">Quantity</span>
        <div className="inline-flex h-10 items-center rounded-lg border border-slate-300">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-full w-10 items-center justify-center text-slate-600 hover:bg-slate-50">
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            max={999}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
            aria-label="Quantity"
            className="h-full w-12 border-x border-slate-300 text-center text-sm font-semibold focus:outline-none"
          />
          <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(999, qty + 1))} className="flex h-full w-10 items-center justify-center text-slate-600 hover:bg-slate-50">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Unit price</span>
          <span>{formatPrice(unitPrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Volume pricing ({Math.round(discount * 100)}% off)</span>
            <span>−{formatPrice(Math.round(unitPrice * qty * discount))}</span>
          </div>
        )}
        <div className="flex items-end justify-between pt-2">
          <span className="font-semibold text-slate-900">Estimated total</span>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-slate-500">
          Est. lead time {leadDays}–{leadDays + 2} business days · ≈ {formatPrice(Math.round(total / 36))}/mo on a 36-month lease
        </p>
      </div>

      <div className="mt-5 grid gap-2">
        <Button onClick={onQuote} size="lg">
          Request a quote for this build <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onAdd}>
          Add to quote list
        </Button>
        <button type="button" onClick={onCopy} className="inline-flex h-10 items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <Copy className="h-4 w-4" /> Copy build summary
        </button>
      </div>
      {qty < 5 && <p className="mt-3 text-center text-xs text-slate-500">Volume pricing starts at 5 units.</p>}
    </div>
  );
}
