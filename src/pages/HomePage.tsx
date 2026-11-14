import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  ChevronLeft,
  ChevronRight,
  Headset,
  Home,
  LayoutGrid,
  Plus,
  Quote,
  Radio,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import heroCollage from "@/assets/hero-collage.jpg";
import storyVr from "@/assets/story-vr.jpg";
import { Link, navigate } from "@/lib/router";
import { cn } from "@/utils/cn";
import { categories, formatPrice, productMap, products } from "@/data/products";
import { company, industries, outcomes, process, stats, testimonials } from "@/data/content";
import { useApp } from "@/context/AppContext";
import { Container, Reveal } from "@/components/ui/Primitives";
import { industryIcons } from "@/components/layout/navData";

/* ------------------------------------------------------------------ */
/* Section rail                                                        */
/* ------------------------------------------------------------------ */
const railItems: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "hero", label: "Home", icon: Home },
  { id: "built", label: "Why Sandia", icon: LayoutGrid },
  { id: "picks", label: "Top picks", icon: Box },
  { id: "sectors", label: "Industries", icon: UserRound },
  { id: "story", label: "Stories & quotes", icon: Headset },
];

function SectionRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mid = window.innerHeight * 0.45;
        let best = 0;
        let bestDist = Infinity;
        railItems.forEach((item, i) => {
          const el = document.getElementById(item.id);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const d = Math.abs(rect.top + rect.height / 2 - mid);
          if (rect.bottom > 0 && rect.top < window.innerHeight && d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  };

  return (
    <aside className="pointer-events-none fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block" aria-label="Section navigation">
      <div className="pointer-events-auto relative flex flex-col items-center gap-1 rounded-full border border-white/80 bg-white/80 p-2 shadow-[0_16px_40px_-20px_rgba(70,40,150,0.5)] backdrop-blur-xl">
        {/* sliding active pill */}
        <span
          className="absolute left-2 top-2 h-10 w-10 rounded-full bg-brand-ink shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateY(${active * 44}px)` }}
          aria-hidden="true"
        />
        {railItems.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => go(item.id)}
            aria-label={`Go to ${item.label}`}
            aria-current={active === i ? "true" : undefined}
            className="group relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          >
            <item.icon className={cn("h-[18px] w-[18px] transition-colors", active === i ? "text-brand-lime" : "text-slate-400 group-hover:text-brand-violet")} />
            <span className="pointer-events-none absolute left-12 whitespace-nowrap rounded-lg bg-brand-ink px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
              {item.label}
            </span>
          </button>
        ))}
        <span className="mt-1 h-1 w-1 rounded-full bg-brand-violet" />
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
export function HomePage() {
  return (
    <>
      <SectionRail />
      <Hero />
      <TrustMarquee />
      <BuiltPanel />
      <TopPicks />
      <StatsBand />
      <Sectors />
      <Outcomes />
      <Process />
      <StoryCta />
    </>
  );
}

/* ------------------------------------------------------------------ */
function Hero() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  const onPointer = (e: ReactPointerEvent<HTMLElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 14,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 14,
    });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onPointerMove={onPointer}
      className="relative overflow-hidden bg-[#f2eeff]"
    >
      {/* ambient layers */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_60%_35%,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-brand-lav-deep/60 blur-3xl animate-breathe" />
      <div className="pointer-events-none absolute -bottom-52 right-[8%] h-[420px] w-[420px] rounded-full bg-brand-violet/15 blur-3xl animate-breathe" style={{ animationDelay: "2s" }} />

      <Container className="relative grid items-center gap-8 pb-12 pt-10 sm:pb-16 sm:pt-14 lg:min-h-[660px] lg:grid-cols-12 lg:gap-6 lg:py-20">
        {/* Copy */}
        <div className="relative z-10 lg:col-span-6 xl:col-span-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-violet/20 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-violet shadow-soft animate-fade-up">
            <Zap className="h-3.5 w-3.5 fill-brand-violet" />
            Custom-built since {company.founded}
            <span className="h-1 w-1 rounded-full bg-brand-lime-dark" />
            Nationwide
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,3.7rem)] font-bold uppercase leading-[0.95] tracking-[-0.055em] text-brand-ink lg:text-[clamp(2.9rem,4.7vw,4.6rem)]">
            {["Tech that", "Outperforms", "Every day."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span
                  className={cn("block animate-line-up", i === 1 && "text-gradient")}
                  style={{ animationDelay: `${140 + i * 130}ms` }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-600 animate-fade-up sm:text-base" style={{ animationDelay: "560ms" }}>
            Smart. Scalable. Built to order. Custom workstations, servers and storage engineered for the work you actually do — by a team that's been doing it since {company.founded}.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up" style={{ animationDelay: "680ms" }}>
            <button
              type="button"
              onClick={() => navigate("/systems")}
              className="group inline-flex h-14 items-center gap-5 rounded-full bg-brand-lime pl-7 pr-2 font-display text-sm font-bold uppercase tracking-wide text-brand-ink shadow-lime transition-all duration-300 hover:gap-7 hover:brightness-95 active:scale-[0.98]"
            >
              Explore systems
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <Link
              to="/configurator"
              className="group inline-flex h-14 items-center gap-2 rounded-full border border-brand-ink/15 bg-white/70 px-6 text-sm font-semibold text-brand-ink transition-all hover:border-brand-ink/40 hover:bg-white"
            >
              <Sparkles className="h-4 w-4 text-brand-violet" /> Build your own
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-brand-ink/10 pt-6 animate-fade-up" style={{ animationDelay: "800ms" }}>
            {[
              ["28+", "years building"],
              ["50", "states shipped"],
              ["72 hr", "burn-in testing"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-xl font-bold text-brand-ink">{v}</dt>
                <dd className="text-xs text-slate-500">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Floating product collage */}
        <div className="relative lg:col-span-6 xl:col-span-7">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[112%] w-[100%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand-violet/25 animate-spin-slow"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute right-[6%] top-[8%] h-24 w-24 rounded-full border-[14px] border-brand-lime/40 blur-[1px] animate-pulse-ring" aria-hidden="true" />
          <div
            className="relative transition-transform duration-500 ease-out"
            style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
          >
            <div className="animate-float-slow">
              <img
                src={heroCollage}
                alt="Sandia custom workstation, laptop, rack server and mini PC floating together"
                className="mask-edges w-full select-none object-contain animate-scale-in"
                style={{ animationDelay: "180ms" }}
                fetchPriority="high"
                draggable={false}
              />
            </div>
          </div>

          {/* floating info chips */}
          <div className="absolute bottom-[14%] left-[2%] hidden animate-fade-up rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-lift backdrop-blur-md sm:block" style={{ animationDelay: "900ms" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-violet">Built to order</p>
            <p className="mt-0.5 font-display text-sm font-bold text-brand-ink">Tested for 72 hours</p>
          </div>
          <div className="absolute right-[1%] top-[16%] hidden items-center gap-2.5 rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-lift backdrop-blur-md sm:flex animate-fade-up" style={{ animationDelay: "1050ms" }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-lime/40 text-brand-ink">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>
              <span className="block font-display text-xs font-bold text-brand-ink">NDAA compliant</span>
              <span className="block text-[10px] text-slate-500">options available</span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function TrustMarquee() {
  const segments = [
    "Federal & State Agencies",
    "Universities & K-12",
    "Engineering Firms",
    "Post-Production Studios",
    "Research Labs",
    "Architecture & BIM",
    "Managed Service Providers",
    "AI & Data Science Teams",
  ];
  return (
    <div className="border-y border-brand-lav-deep/60 bg-white py-4">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 pr-10 hover:[animation-play-state:paused]">
          {[...segments, ...segments].map((s, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-brand-lime-dark" /> {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
const builtFeatures: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Box, title: "Innovative\ndesign", body: "Every build specified around your applications, with a focus on the years ahead." },
  { icon: Zap, title: "Powerful\nperformance", body: "High-speed, high-efficiency systems benchmarked in the work you actually do." },
  { icon: Radio, title: "Seamless\nintegration", body: "Imaged, tagged and network-ready. Connected to your fleet from day one." },
  { icon: ShieldCheck, title: "Secure by\ndefault", body: "NDAA/TAA-compliant options, TPM 2.0 and documented component traceability." },
];

function BuiltPanel() {
  return (
    <section id="built" className="bg-white py-8 sm:py-12 lg:py-16">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-brand-ink px-6 py-9 shadow-violet sm:px-10 sm:py-12 lg:px-12">
            <div className="pointer-events-none absolute inset-0 dot-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-violet/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 shimmer-surface" />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-lime">Built for the work ahead</p>
              <div className="mt-8 grid gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
                {builtFeatures.map((f, i) => (
                  <div
                    key={f.title}
                    className={cn(
                      "group px-0 transition-transform duration-300 hover:-translate-y-1 lg:px-7",
                      i > 0 && "lg:border-l lg:border-white/10",
                      i === 0 && "lg:pl-0",
                      i === 2 && "sm:border-l-0",
                    )}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-lime/25 bg-brand-lime/5 text-brand-lime transition-all duration-300 group-hover:bg-brand-lime group-hover:text-brand-ink">
                      <f.icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <h3 className="mt-5 whitespace-pre-line font-display text-[15px] font-bold uppercase leading-tight tracking-[0.05em] text-white">
                      {f.title}
                    </h3>
                    <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-white/55">{f.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
const pickSlugs = ["peak-w7", "rs-2200", "vault-ns-12", "apex-g9", "office-sff-200", "compute-ai-x", "studio-w3", "apex-g7"];

function TopPicks() {
  const { addItem, toast } = useApp();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const picks = pickSlugs.map((s) => productMap[s]);

  const perView = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    if (window.innerWidth < 1280) return 3;
    return 4;
  };
  const maxIndex = () => Math.max(0, picks.length - perView());
  const max = maxIndex();

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(maxIndex(), n));
      setIndex(clamped);
      const track = trackRef.current;
      const card = track?.querySelector<HTMLElement>("[data-pick]");
      if (track && card) {
        const gap = 16;
        track.scrollTo({ left: clamped * (card.offsetWidth + gap), behavior: "smooth" });
      }
    },
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => {
      const next = i >= maxIndex() ? 0 : i + 1;
      const track = trackRef.current;
      const card = track?.querySelector<HTMLElement>("[data-pick]");
      if (track && card) track.scrollTo({ left: next * (card.offsetWidth + 16), behavior: "smooth" });
      return next;
    }), 5200);
    return () => window.clearInterval(id);
  }, [paused]);

  const onScroll = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-pick]");
    if (!track || !card) return;
    const i = Math.round(track.scrollLeft / (card.offsetWidth + 16));
    setIndex(Math.max(0, Math.min(max, i)));
  };

  const add = (slug: string) => {
    const p = productMap[slug];
    addItem({ id: p.slug, name: p.name, detail: p.tagline, price: p.startingPrice, kind: "system", link: `/systems/${p.slug}` });
    toast(`${p.name} added to your quote list.`, { action: { label: "View", to: "/quote" } });
  };

  return (
    <section id="picks" className="overflow-hidden bg-white pb-16 pt-6 sm:pb-24">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold uppercase leading-[1.02] tracking-[-0.045em] text-brand-ink">
              Explore our<br />top picks
            </h2>
            <span className="mt-4 block h-1 w-10 rounded-full bg-brand-lime-dark" />
          </Reveal>
          <div className="flex items-center gap-3">
            <Link to="/systems" className="mr-2 hidden text-sm font-semibold text-brand-violet hover:underline sm:inline">
              View all {products.length} systems →
            </Link>
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => goTo(index - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-ink transition-all hover:border-brand-ink hover:bg-brand-ink hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => goTo(index + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-ink text-white transition-all hover:bg-brand-violet"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-none"
          >
            {picks.map((p, i) => (
              <article
                key={p.slug}
                data-pick
                className="card-tilt group relative flex min-w-[82%] snap-start flex-col rounded-[24px] bg-brand-lav/70 p-3 sm:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-11px)] xl:min-w-[calc(25%-12px)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-white">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading={i < 4 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-violet backdrop-blur">
                    {categories.find((c) => c.slug === p.category)?.shortName}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2 px-2 pb-1 pt-4">
                  <div className="min-w-0">
                    <Link to={`/systems/${p.slug}`} className="block truncate font-display text-[15px] font-bold text-brand-ink hover:text-brand-violet">
                      {p.name}
                    </Link>
                    <p className="mt-0.5 font-display text-sm font-semibold text-brand-ink">{formatPrice(p.startingPrice)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => add(p.slug)}
                    aria-label={`Add ${p.name} to quote list`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-lime text-brand-ink transition-all duration-300 hover:rotate-90 hover:bg-brand-ink hover:text-brand-lime"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: max + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-7 bg-brand-ink" : "w-2 bg-brand-ink/20 hover:bg-brand-ink/40")}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function useCountUp(target: string, run: boolean) {
  const [value, setValue] = useState("0");
  useEffect(() => {
    if (!run) return;
    const match = target.match(/^([\d.,]*)(.*)$/);
    if (!match) return;
    const num = Number(match[1].replace(/,/g, ""));
    const suffix = match[2];
    if (Number.isNaN(num)) {
      setValue(target);
      return;
    }
    const decimals = (match[1].split(".")[1] || "").length;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = num * eased;
      const formatted = decimals
        ? current.toFixed(decimals)
        : Math.round(current).toLocaleString("en-US");
      setValue(formatted + suffix);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return value;
}

function StatCell({ value, label, icon: Icon, run, delay }: { value: string; label: string; icon: LucideIcon; run: boolean; delay: number }) {
  const display = useCountUp(value, run);
  return (
    <div className="flex items-center gap-4 px-6 py-5 sm:px-8" style={{ transitionDelay: `${delay}ms` }}>
      <Icon className="h-9 w-9 shrink-0 text-brand-lime/90" strokeWidth={1.5} />
      <div>
        <p className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{display}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.1em] text-white/70">{label}</p>
      </div>
    </div>
  );
}

function StatsBand() {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), obs.disconnect()), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const icons = [Box, UserRound, Sparkles, Headset];
  return (
    <Container>
      <div ref={ref} className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5b32e8] via-[#7447f5] to-[#8b5cf6] shadow-violet">
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-25" />
        <div className="pointer-events-none absolute -left-20 top-0 h-full w-64 bg-white/5 blur-2xl animate-breathe" />
        <div className="relative grid divide-y divide-white/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {stats.map((s, i) => (
            <StatCell key={s.label} value={s.value} label={s.label} icon={icons[i]} run={run} delay={i * 100} />
          ))}
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
function Sectors() {
  return (
    <section id="sectors" className="py-16 sm:py-24">
      <Container>
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-violet">Solutions</p>
            <h2 className="mt-2 max-w-xl font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold uppercase leading-[1.04] tracking-[-0.045em] text-brand-ink">
              Built for every kind of serious work
            </h2>
          </div>
          <Link to="/industries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-violet hover:underline">
            Explore all industries <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="-mx-4 mt-9 flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {industries.map((ind, i) => {
            const Icon = industryIcons[ind.slug];
            return (
              <Reveal key={ind.slug} delay={i * 60} className="min-w-[78%] sm:min-w-0">
                <Link
                  to={`/industries/${ind.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-brand-lav-deep/70 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-violet/40 hover:shadow-lift"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-lav text-brand-violet transition-all group-hover:bg-brand-lime group-hover:text-brand-ink">
                    <Icon className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold uppercase tracking-tight text-brand-ink group-hover:text-brand-violet">
                    {ind.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-500">{ind.headline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-ink">
                    {ind.stat.value} <span className="font-medium normal-case tracking-normal text-slate-500">{ind.stat.label}</span>
                    <ArrowUpRight className="ml-auto h-4 w-4 text-brand-violet transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Outcomes() {
  return (
    <section className="bg-brand-lav/60 py-16 sm:py-24">
      <Container>
        <Reveal>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-violet">Results, not parts lists</p>
          <h2 className="mt-2 max-w-3xl font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold uppercase leading-[1.04] tracking-[-0.045em] text-brand-ink">
            We don't sell specs. We sell time back.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 55}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-lime/0 transition-all duration-500 group-hover:bg-brand-lime/25" />
                <p className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-brand-violet">{o.workload}</p>
                <h3 className="relative mt-3 font-display text-xl font-bold tracking-tight text-brand-ink">{o.title}</h3>
                <p className="relative mt-2 text-[13px] leading-relaxed text-slate-500">{o.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Process() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-violet">How it works</p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold uppercase leading-[1.04] tracking-[-0.045em] text-brand-ink">
            From first call to first boot in days
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.step} as="li" delay={i * 80}>
              <div className="group relative h-full rounded-2xl border border-brand-lav-deep/70 bg-brand-lav/40 p-6 transition-all duration-300 hover:bg-brand-ink">
                <span className="font-display text-4xl font-bold tracking-tight text-brand-violet/30 transition-colors group-hover:text-brand-lime/50">{p.step}</span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-brand-ink transition-colors group-hover:text-white">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-500 transition-colors group-hover:text-white/60">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function StoryCta() {
  const [quote, setQuote] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setQuote((q) => (q + 1) % testimonials.length), 6500);
    return () => window.clearInterval(id);
  }, []);
  const t = testimonials[quote];
  // Lead with the first sentence for a punchier editorial quote block.
  const excerpt = t.quote.includes(". ") ? `${t.quote.split(". ")[0]}.` : t.quote;

  return (
    <section id="story" className="pb-16 sm:pb-24">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden rounded-[28px] bg-brand-ink lg:grid-cols-12">
            {/* photo */}
            <div className="relative h-64 sm:h-80 lg:col-span-4 lg:h-full">
              <img src={storyVr} alt="Engineer exploring a virtual workspace" className="h-full w-full object-cover object-[50%_30%]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brand-ink" />
              <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                Built for what's next
              </span>
            </div>

            {/* quote */}
            <div className="relative flex flex-col justify-center px-7 py-10 sm:px-10 lg:col-span-4 lg:py-14">
              <Quote className="h-10 w-10 rotate-180 fill-brand-lime text-brand-lime" />
              <blockquote key={quote} className="mt-4 font-display text-xl font-medium leading-snug tracking-tight text-white animate-fade-up sm:text-2xl">
                “{excerpt}”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-lime/40 text-xs font-bold text-brand-lime">
                  {t.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">— {t.name}</p>
                  <p className="text-xs text-white/50">{t.title}, {t.org}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => setQuote(i)}
                    className={cn("h-1.5 rounded-full transition-all", i === quote ? "w-6 bg-brand-lime" : "w-2 bg-white/25")}
                  />
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="flex items-center px-7 pb-10 sm:px-10 lg:col-span-4 lg:py-14 lg:pl-0 lg:pr-10">
              <div className="relative w-full overflow-hidden rounded-2xl border border-brand-violet/40 bg-brand-ink-soft p-7">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-violet/30 blur-2xl animate-breathe" />
                <p className="relative font-display text-xl font-bold uppercase leading-tight tracking-tight text-white sm:text-2xl">
                  Ready to upgrade<br />your infrastructure?
                </p>
                <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                  Join the businesses, agencies and studios that trust Sandia for quality, innovation and speed.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/quote")}
                  className="group relative mt-7 inline-flex h-12 items-center gap-4 rounded-full bg-brand-lime pl-5 pr-1.5 font-display text-xs font-bold uppercase tracking-wide text-brand-ink transition-all hover:gap-6 hover:brightness-95"
                >
                  Join the Sandia family
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-ink text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
                <ul className="relative mt-6 space-y-1.5 border-t border-white/10 pt-5 text-xs text-white/50">
                  {["Written quote within 1 business day", "PO & Net-30 accepted", "3-year warranty · lifetime support"].map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-brand-lime" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
