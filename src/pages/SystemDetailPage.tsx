import { useState } from "react";
import { ArrowRight, Check, Minus, Plus, Settings2, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/utils/cn";
import { categoryMap, formatPrice, productMap, products } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { Badge, Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";
import { NotFoundPage } from "./NotFoundPage";

type Tab = "overview" | "specs" | "support";

export function SystemDetailPage({ slug }: { slug: string }) {
  const product = productMap[slug];
  const { addItem, toast } = useApp();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("overview");

  if (!product) return <NotFoundPage />;
  const category = categoryMap[product.category];
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  const add = () => {
    addItem(
      { id: product.slug, name: product.name, detail: product.tagline, price: product.startingPrice, kind: "system", link: `/systems/${product.slug}` },
      qty,
    );
    toast(`${qty} × ${product.name} added to your quote list.`, { action: { label: "View", to: "/quote" } });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "specs", label: "Specifications" },
    { id: "support", label: "Warranty & support" },
  ];

  return (
    <>
      <Container className="py-6 sm:py-10">
        <nav className="text-xs text-slate-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-slate-900">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/systems" className="hover:text-slate-900">Systems</Link>
          <span className="mx-2">/</span>
          <Link to={`/systems?category=${category.slug}`} className="hover:text-slate-900">{category.shortName}</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-slate-600 sm:text-sm">
              <li className="rounded-xl border border-slate-200 p-3">
                <Truck className="mx-auto mb-1.5 h-5 w-5 text-brand-blue" />
                Ships in {product.leadTime}
              </li>
              <li className="rounded-xl border border-slate-200 p-3">
                <ShieldCheck className="mx-auto mb-1.5 h-5 w-5 text-brand-blue" />
                3-year warranty
              </li>
              <li className="rounded-xl border border-slate-200 p-3">
                <Settings2 className="mx-auto mb-1.5 h-5 w-5 text-brand-blue" />
                Fully configurable
              </li>
            </ul>
          </div>

          {/* Buy box */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">{category.name}</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
              <p className="mt-2 text-lg text-slate-600">{product.tagline}</p>
              {product.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.badges.map((b) => (
                    <Badge key={b} tone={b === "Best Seller" ? "red" : "blue"}>{b}</Badge>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Starting configuration</p>
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900">{formatPrice(product.startingPrice)}</p>
                  </div>
                  <p className="text-right text-xs text-slate-500">
                    Est. {formatPrice(Math.round(product.startingPrice / 36))}/mo
                    <br />
                    36-mo lease available
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">Quantity</span>
                  <div className="ml-auto inline-flex h-11 items-center rounded-lg border border-slate-300">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-full w-11 items-center justify-center text-slate-600 hover:bg-slate-50">
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                      className="h-full w-14 border-x border-slate-300 text-center text-sm font-semibold focus:outline-none"
                      aria-label="Quantity"
                    />
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(999, q + 1))} className="flex h-full w-11 items-center justify-center text-slate-600 hover:bg-slate-50">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-2">
                  <Button variant="secondary" size="lg" onClick={add}>
                    Add to quote list
                  </Button>
                  <Button variant="outline" size="lg" to={`/configurator?base=${product.configuratorBase}&from=${product.slug}`}>
                    <Settings2 className="h-4 w-4" /> Customize this system
                  </Button>
                </div>
                <p className="mt-4 text-center text-xs text-slate-500">
                  Volume pricing on 5+ units ·{" "}
                  <Link to="/quote" className="font-semibold text-brand-blue hover:underline">
                    talk to a specialist
                  </Link>
                </p>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-slate-600">
                {product.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <div className="-mx-4 overflow-x-auto border-b border-slate-200 px-4 scrollbar-none sm:mx-0 sm:px-0" role="tablist" aria-label="System details">
            <div className="flex w-max gap-6">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "-mb-px whitespace-nowrap border-b-2 py-3.5 text-sm font-semibold transition-colors",
                    tab === t.id ? "border-brand-blue text-brand-blue" : "border-transparent text-slate-500 hover:text-slate-900",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8 animate-fade-in" key={tab}>
            {tab === "overview" && (
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <h2 className="text-xl font-bold text-slate-900">About the {product.name}</h2>
                  <p className="mt-3 leading-relaxed text-slate-600">{product.description}</p>
                  <h3 className="mt-8 text-base font-bold text-slate-900">Highlights</h3>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {product.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-5">
                  <h3 className="text-base font-bold text-slate-900">Ideal for</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.useCases.map((u) => (
                      <span key={u} className="rounded-full border border-slate-200 px-3.5 py-1.5 text-sm text-slate-700">{u}</span>
                    ))}
                  </div>
                  <div className="mt-8 rounded-2xl bg-brand-navy p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Not sure it's the right fit?</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Tell us your applications and file sizes. A specialist will confirm this configuration or recommend a better one—free.
                    </p>
                    <Button to="/quote" variant="white" size="sm" className="mt-4">
                      Ask a specialist <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {tab === "specs" && (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <dl className="divide-y divide-slate-200">
                  {[...product.specs, { label: "Form factor", value: product.formFactor }, { label: "Lead time", value: product.leadTime }].map((s, i) => (
                    <div key={s.label} className={cn("grid gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-6", i % 2 === 1 && "bg-slate-50/60")}>
                      <dt className="text-sm font-semibold text-slate-900">{s.label}</dt>
                      <dd className="text-sm text-slate-700 sm:col-span-2">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {tab === "support" && (
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { title: "Standard warranty", body: product.warranty },
                  { title: "Lifetime technical support", body: "Call or email the US-based team that built your system. No scripts, no tiers—just answers." },
                  { title: "Upgrades for life", body: "We keep a record of every configuration we ship and recommend compatible upgrades whenever you're ready." },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl border border-slate-200 p-6">
                    <ShieldCheck className="h-6 w-6 text-brand-blue" />
                    <h3 className="mt-3 font-bold text-slate-900">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <Section tone="gray">
          <Container>
            <SectionHeading eyebrow="Related systems" title={`More ${category.shortName.toLowerCase()}`} />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
