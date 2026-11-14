import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Headset, LifeBuoy, Mail, Phone, Search, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/utils/cn";
import { company, faqs } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { AccordionItem, Container, Section, SectionHeading } from "@/components/ui/Primitives";

const faqCategories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

const warrantyTiers = [
  { name: "Standard", price: "Included", items: ["3-year parts & labor", "Lifetime technical support", "Depot repair, return shipping paid", "Configuration record for upgrades"] },
  { name: "Advance Replacement", price: "From $190", items: ["Everything in Standard", "Replacement parts ship before return", "Priority support queue", "Loaner options for workstations"], featured: true },
  { name: "On-Site NBD", price: "From $540", items: ["Everything in Advance Replacement", "Next-business-day on-site service", "Servers, storage & workstations", "5-year extension available"] },
];

export function SupportPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(0);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs
      .map((f, i) => ({ ...f, i }))
      .filter((f) => (cat === "All" || f.category === cat) && (!q || `${f.question} ${f.answer}`.toLowerCase().includes(q)));
  }, [query, cat]);

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Support</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Talk to the people who built your system.</h1>
          <p className="mt-3 max-w-2xl text-slate-600 sm:text-lg">
            US-based technicians, lifetime support, and a configuration record for every machine we've ever shipped.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Phone, title: "Call support", body: company.phone, href: company.phoneHref },
              { icon: Mail, title: "Email support", body: company.supportEmail, href: `mailto:${company.supportEmail}` },
              { icon: Headset, title: "Hours", body: company.hours },
            ].map((c) => {
              const Comp = c.href ? "a" : "div";
              return (
                <Comp key={c.title} href={c.href} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">{c.title}</span>
                    <span className="block font-semibold text-slate-900">{c.body}</span>
                  </span>
                </Comp>
              );
            })}
          </div>
        </Container>
      </section>

      <Section id="warranty">
        <Container>
          <SectionHeading eyebrow="Warranty" title="Coverage that matches how critical the system is." align="center" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {warrantyTiers.map((t) => (
              <div key={t.name} className={cn("flex flex-col rounded-2xl border p-7", t.featured ? "border-brand-blue bg-brand-blue-light/40 ring-2 ring-brand-blue/20" : "border-slate-200")}>
                <ShieldCheck className={cn("h-7 w-7", t.featured ? "text-brand-blue" : "text-slate-400")} />
                <h3 className="mt-4 text-xl font-bold text-slate-900">{t.name}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-500">{t.price}</p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-700">
                  {t.items.map((i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" /> {i}
                    </li>
                  ))}
                </ul>
                <Button to="/quote" variant={t.featured ? "secondary" : "outline"} className="mt-7">
                  Include in quote
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="gray" id="faq">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-4">
              <SectionHeading eyebrow="FAQ" title="Answers for buyers and IT teams." />
              <div className="relative mt-6">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(null);
                  }}
                  placeholder="Search questions…"
                  aria-label="Search FAQs"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-[15px] focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10"
                />
              </div>
              <div className="-mx-4 mt-4 overflow-x-auto px-4 scrollbar-none lg:mx-0 lg:px-0">
                <div className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
                  {faqCategories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCat(c);
                        setOpen(null);
                      }}
                      aria-pressed={cat === c}
                      className={cn(
                        "h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors",
                        cat === c ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-8 hidden rounded-2xl border border-slate-200 bg-white p-6 lg:block">
                <LifeBuoy className="h-6 w-6 text-brand-red" />
                <h3 className="mt-3 font-bold text-slate-900">Still need help?</h3>
                <p className="mt-1 text-sm text-slate-600">Open a ticket and a technician will respond within one business hour during support hours.</p>
                <Button to="/contact?topic=support" size="sm" variant="secondary" className="mt-4">
                  Contact support <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 sm:px-8">
                {list.length === 0 ? (
                  <p className="py-12 text-center text-sm text-slate-500">No questions match your search.</p>
                ) : (
                  list.map((f) => (
                    <AccordionItem key={f.i} title={f.question} meta={f.category} open={open === f.i} onToggle={() => setOpen(open === f.i ? null : f.i)}>
                      {f.answer}
                    </AccordionItem>
                  ))
                )}
              </div>
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between lg:hidden">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-brand-blue" />
                  <p className="text-sm font-semibold text-slate-900">Still need help?</p>
                </div>
                <Link to="/contact?topic=support" className="text-sm font-semibold text-brand-blue">
                  Contact support →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
