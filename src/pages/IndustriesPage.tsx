import { useEffect } from "react";
import { ArrowRight, Check, CircleAlert } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/utils/cn";
import { industries, industryMap } from "@/data/content";
import { productMap } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { Container, Reveal, Section, SectionHeading } from "@/components/ui/Primitives";
import { ProductCard } from "@/components/ProductCard";
import { industryIcons } from "@/components/layout/navData";

export function IndustriesPage({ slug }: { slug?: string }) {
  const active = slug && industryMap[slug] ? industryMap[slug] : null;

  useEffect(() => {
    if (active) {
      const el = document.getElementById("industry-detail");
      if (el && window.innerWidth < 1024) {
        window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      }
    }
  }, [active]);

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Industries</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Systems specified for your workload—and your procurement process.
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 sm:text-lg">
            We've spent 28 years learning what engineers, editors, researchers, IT directors and purchasing officers actually need. Choose your field to see how we help.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Industry selector */}
          <div className="min-w-0 lg:col-span-4">
            <div className="-mx-4 overflow-x-auto px-4 scrollbar-none lg:sticky lg:top-28 lg:mx-0 lg:overflow-visible lg:px-0">
              <ul className="flex w-max gap-2 lg:w-auto lg:flex-col lg:gap-1" role="tablist" aria-label="Industries">
                {industries.map((i) => {
                  const Icon = industryIcons[i.slug];
                  const isActive = active?.slug === i.slug;
                  return (
                    <li key={i.slug}>
                      <Link
                        to={`/industries/${i.slug}`}
                        role="tab"
                        aria-selected={isActive}
                        className={cn(
                          "flex min-h-[48px] items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors lg:min-h-[56px] lg:text-[15px]",
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isActive ? "text-blue-200" : "text-brand-blue")} />
                        {i.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Detail / overview */}
          <div className="min-w-0 lg:col-span-8" id="industry-detail">
            {active ? (
              <IndustryDetail key={active.slug} slug={active.slug} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {industries.map((i, idx) => {
                  const Icon = industryIcons[i.slug];
                  return (
                    <Reveal key={i.slug} delay={idx * 50}>
                      <Link
                        to={`/industries/${i.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-slate-200 p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                          <Icon className="h-5 w-5" />
                        </span>
                        <h2 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-brand-blue">{i.name}</h2>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{i.headline}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                          Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>

      <Section tone="blue" className="py-12 sm:py-16">
        <Container className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <SectionHeading title="Don't see your field? We probably still build for it." description="Healthcare, legal, broadcasting, surveying, manufacturing—tell us the application and we'll spec the system." light />
          <Button to="/quote" variant="white" size="lg" className="lg:shrink-0">
            Talk to a specialist <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </Section>
    </>
  );
}

function IndustryDetail({ slug }: { slug: string }) {
  const ind = industryMap[slug];
  const Icon = industryIcons[slug];
  const recommended = ind.recommended.map((s) => productMap[s]).filter(Boolean);

  return (
    <div className="animate-fade-in">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-blue shadow-soft">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{ind.headline}</h2>
        <p className="mt-3 text-slate-600 sm:text-lg">{ind.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {ind.compliance.map((c) => (
            <span key={c} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-6 text-lg font-bold text-slate-900">
          <span className="text-3xl text-brand-red">{ind.stat.value}</span> {ind.stat.label}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="flex items-center gap-2 font-bold text-slate-900">
            <CircleAlert className="h-5 w-5 text-brand-red" /> What slows teams down
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {ind.challenges.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="flex items-center gap-2 font-bold text-slate-900">
            <Check className="h-5 w-5 text-emerald-600" /> How Sandia helps
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {ind.solutions.map((s) => (
              <li key={s} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900">Recommended systems</h3>
          <Link to="/systems" className="text-sm font-semibold text-brand-blue hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {recommended.map((p) => (
            <ProductCard key={p.slug} product={p} compact />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button to={`/quote?industry=${ind.slug}`} size="lg">
          Request a {ind.shortName.toLowerCase()} quote <ArrowRight className="h-4 w-4" />
        </Button>
        <Button to="/configurator" variant="outline" size="lg">
          Build your own
        </Button>
      </div>
    </div>
  );
}
