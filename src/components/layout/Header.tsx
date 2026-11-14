import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, ClipboardList, Clock, Menu, Phone, X } from "lucide-react";
import { Link, navigate } from "@/lib/router";
import { cn } from "@/utils/cn";
import { useApp } from "@/context/AppContext";
import { categories, formatPrice, productMap } from "@/data/products";
import { company, industries } from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";
import { categoryIcons, industryIcons, primaryLinks } from "./navData";

type MenuKey = "systems" | "industries";

export function Header({ path }: { path: string }) {
  const { count } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const openedBy = useRef<"hover" | "click">("hover");
  const closeTimer = useRef<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const hoverCapable = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [path]);

  // Escape + outside click
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setDrawer(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const onTriggerEnter = (key: MenuKey) => {
    if (!hoverCapable()) return;
    cancelClose();
    openedBy.current = "hover";
    setOpen(key);
  };
  const onTriggerClick = (key: MenuKey, overview: string) => {
    if (open === key) {
      if (openedBy.current === "hover" && hoverCapable()) {
        navigate(overview);
      }
      setOpen(null);
      return;
    }
    openedBy.current = "click";
    setOpen(key);
  };

  const closeMenu = useCallback(() => setOpen(null), []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lift"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 w-full bg-[#f7f5ff]/85 backdrop-blur-xl transition-shadow duration-300",
          scrolled || open ? "shadow-[0_1px_0_0_rgba(124,77,255,0.12),0_16px_36px_-24px_rgba(60,30,140,0.5)]" : "border-b border-brand-lav-deep/60",
        )}
        onMouseLeave={() => open && openedBy.current === "hover" && scheduleClose()}
        onMouseEnter={cancelClose}
      >
        {/* Utility bar */}
        <div className="hidden bg-brand-ink text-xs text-white/60 lg:block">
          <Container className="flex h-9 items-center justify-between">
            <div className="flex items-center gap-6">
              <a href={company.phoneHref} className="inline-flex items-center gap-1.5 font-medium text-white hover:text-brand-lime">
                <Phone className="h-3.5 w-3.5 text-brand-lime" /> {company.phone}
              </a>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {company.hours}
              </span>
              <span className="hidden xl:inline">Local since {company.founded} · Shipping to all 50 states</span>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/industries/government" className="hover:text-white">
                Government & Education
              </Link>
              <Link to="/support" className="hover:text-white">
                Support
              </Link>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </Container>
        </div>

        {/* Main bar */}
        <Container className="flex h-[72px] items-center justify-between gap-4 lg:h-[84px]">
          <Link to="/" className="shrink-0" aria-label="Sandia Computers home" onClick={closeMenu}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <MenuTrigger
              label="Systems"
              active={open === "systems" || path.startsWith("/systems")}
              expanded={open === "systems"}
              onEnter={() => onTriggerEnter("systems")}
              onClick={() => onTriggerClick("systems", "/systems")}
              controls="mega-systems"
            />
            <MenuTrigger
              label="Industries"
              active={open === "industries" || path.startsWith("/industries")}
              expanded={open === "industries"}
              onEnter={() => onTriggerEnter("industries")}
              onClick={() => onTriggerClick("industries", "/industries")}
              controls="mega-industries"
            />
            {primaryLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onMouseEnter={() => open && scheduleClose()}
                className={cn(
                  "rounded-full px-4 py-2 text-[15px] font-medium text-brand-ink/70 transition-colors hover:bg-brand-lav hover:text-brand-ink",
                  path.startsWith(l.to) && "text-brand-violet",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/quote"
              aria-label={`Quote list, ${count} items`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-lav"
            >
              <ClipboardList className="h-[22px] w-[22px]" />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/quote"
              className="group hidden h-11 items-center gap-3 rounded-full border border-brand-ink/15 bg-white pl-5 pr-1.5 text-sm font-semibold text-brand-ink shadow-soft transition-all hover:border-brand-ink/40 sm:inline-flex"
            >
              Request a Quote
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-lime text-brand-ink transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:bg-brand-lav lg:hidden"
              aria-label="Open menu"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </Container>

        {/* Mega menu panels (desktop) */}
        <div
          className={cn(
            "absolute inset-x-0 top-full hidden border-t border-brand-lav-deep bg-[#faf8ff] shadow-lift transition-all duration-200 lg:block",
            open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none",
          )}
          onMouseEnter={cancelClose}
          onMouseLeave={() => openedBy.current === "hover" && scheduleClose()}
        >
          {open === "systems" && <SystemsMenu onNavigate={closeMenu} />}
          {open === "industries" && <IndustriesMenu onNavigate={closeMenu} />}
        </div>
        {/* Lime reading-progress line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden" aria-hidden="true">
          <div
            className="h-full origin-left bg-gradient-to-r from-brand-lime to-brand-violet transition-transform duration-150"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} path={path} />
      <MobileCtaBar hidden={drawer || path.startsWith("/configurator") || path.startsWith("/quote")} />
    </>
  );
}

/* ------------------------------------------------------------------ */
function MenuTrigger({
  label,
  active,
  expanded,
  onEnter,
  onClick,
  controls,
}: {
  label: string;
  active: boolean;
  expanded: boolean;
  onEnter: () => void;
  onClick: () => void;
  controls: string;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onClick={onClick}
      aria-haspopup="true"
      aria-expanded={expanded}
      aria-controls={controls}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium text-brand-ink/70 transition-colors hover:bg-brand-lav hover:text-brand-ink",
        active && "text-brand-violet",
      )}
    >
      {label}
      <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")} />
    </button>
  );
}

function SystemsMenu({ onNavigate }: { onNavigate: () => void }) {
  const featured = productMap["peak-w7"];
  return (
    <Container id="mega-systems" className="grid grid-cols-12 gap-8 py-8 animate-fade-in">
      <div className="col-span-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Browse by system</p>
        <ul className="grid grid-cols-2 gap-2 xl:grid-cols-3">
          {categories.map((c) => {
            const Icon = categoryIcons[c.slug];
            return (
              <li key={c.slug}>
                <Link
                  to={`/systems?category=${c.slug}`}
                  onClick={onNavigate}
                  className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-900 group-hover:text-brand-blue">
                      {c.shortName}
                    </span>
                    <span className="block text-sm text-slate-500">{c.tagline}</span>
                    <span className="mt-1 block text-xs font-medium text-slate-400">From {formatPrice(c.startingAt)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              to="/configurator"
              onClick={onNavigate}
              className="group flex items-start gap-3 rounded-xl border border-dashed border-slate-300 p-3 transition-colors hover:border-brand-blue hover:bg-brand-blue-light/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red-light text-brand-red">
                <ArrowRight className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-slate-900 group-hover:text-brand-blue">
                  Build your own
                </span>
                <span className="block text-sm text-slate-500">Configure a system with live pricing</span>
              </span>
            </Link>
          </li>
        </ul>
        <div className="mt-6 flex items-center gap-6 border-t border-slate-200 pt-5 text-sm font-medium">
          <Link to="/systems" onClick={onNavigate} className="inline-flex items-center gap-1 text-brand-blue hover:underline">
            View all systems <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/systems?compare=1" onClick={onNavigate} className="text-slate-600 hover:text-slate-900">
            Compare systems
          </Link>
          <Link to="/quote" onClick={onNavigate} className="text-slate-600 hover:text-slate-900">
            Request a quote
          </Link>
        </div>
      </div>
      <div className="col-span-4">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Featured</p>
        <Link
          to={`/systems/${featured.slug}`}
          onClick={onNavigate}
          className="group block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-shadow hover:shadow-soft"
        >
          <div className="aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              src={featured.image}
              alt={featured.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">Best seller</p>
            <p className="mt-1 font-semibold text-slate-900">{featured.name}</p>
            <p className="text-sm text-slate-500">{featured.tagline}</p>
          </div>
        </Link>
      </div>
    </Container>
  );
}

function IndustriesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Container id="mega-industries" className="grid grid-cols-12 gap-8 py-8 animate-fade-in">
      <div className="col-span-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Solutions by industry</p>
        <ul className="grid grid-cols-2 gap-2 xl:grid-cols-3">
          {industries.map((i) => {
            const Icon = industryIcons[i.slug];
            return (
              <li key={i.slug}>
                <Link
                  to={`/industries/${i.slug}`}
                  onClick={onNavigate}
                  className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-brand-blue-light group-hover:text-brand-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-slate-900 group-hover:text-brand-blue">
                      {i.name}
                    </span>
                    <span className="block text-sm text-slate-500 line-clamp-2">{i.headline}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="col-span-4">
        <div className="flex h-full flex-col justify-between rounded-2xl bg-brand-ink p-6 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-lime">Public sector</p>
            <h4 className="mt-2 text-xl font-bold text-white">NDAA-compliant systems with the paperwork done right.</h4>
            <p className="mt-2 text-sm text-slate-300">
              Sole-source letters, W-9s, cooperative contract pricing and full component traceability.
            </p>
          </div>
          <Button to="/industries/government" variant="white" size="sm" className="mt-6 self-start" onClick={onNavigate}>
            Government & Education <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
function MobileDrawer({ open, onClose, path }: { open: boolean; onClose: () => void; path: string }) {
  const [section, setSection] = useState<MenuKey | null>("systems");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus({ preventScroll: true });
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", trap);
    };
  }, [open]);

  return (
    <div className={cn("fixed inset-0 z-[90] overflow-hidden lg:hidden", open ? "" : "pointer-events-none")} aria-hidden={!open}>
      <div
        className={cn("absolute inset-0 bg-slate-900/50 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-white shadow-lift outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-2" aria-label="Mobile">
          <DrawerAccordion
            label="Systems"
            open={section === "systems"}
            onToggle={() => setSection(section === "systems" ? null : "systems")}
          >
            {categories.map((c) => {
              const Icon = categoryIcons[c.slug];
              return (
                <Link
                  key={c.slug}
                  to={`/systems?category=${c.slug}`}
                  className="flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="h-5 w-5 text-brand-blue" />
                  <span className="flex-1">
                    {c.shortName}
                    <span className="block text-xs text-slate-400">From {formatPrice(c.startingAt)}</span>
                  </span>
                </Link>
              );
            })}
            <Link to="/systems" className="flex min-h-[48px] items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-semibold text-brand-blue">
              View all systems <ArrowRight className="h-4 w-4" />
            </Link>
          </DrawerAccordion>

          <DrawerAccordion
            label="Industries"
            open={section === "industries"}
            onToggle={() => setSection(section === "industries" ? null : "industries")}
          >
            {industries.map((i) => {
              const Icon = industryIcons[i.slug];
              return (
                <Link
                  key={i.slug}
                  to={`/industries/${i.slug}`}
                  className="flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="h-5 w-5 text-brand-blue" />
                  {i.name}
                </Link>
              );
            })}
          </DrawerAccordion>

          {[...primaryLinks, { label: "Contact", to: "/contact" }].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex min-h-[52px] items-center rounded-lg px-4 text-[17px] font-semibold text-slate-900 hover:bg-slate-50",
                path.startsWith(l.to) && "text-brand-blue",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-slate-200 p-4 safe-bottom">
          <Button to="/quote" full size="lg">
            Request a Quote
          </Button>
          <a
            href={company.phoneHref}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 text-base font-semibold text-slate-800"
          >
            <Phone className="h-4 w-4" /> {company.phone}
          </a>
          <p className="text-center text-xs text-slate-500">{company.hours}</p>
        </div>
      </div>
    </div>
  );
}

function DrawerAccordion({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex min-h-[52px] w-full items-center justify-between rounded-lg px-4 text-[17px] font-semibold text-slate-900 hover:bg-slate-50",
          open && "text-brand-blue",
        )}
      >
        {label}
        <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", open && "rotate-180")} />
      </button>
      <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="space-y-0.5 px-2 pb-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function MobileCtaBar({ hidden }: { hidden: boolean }) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-white/10 bg-brand-ink/95 p-2 backdrop-blur-xl safe-bottom transition-transform duration-300 md:hidden",
        hidden && "translate-y-full",
      )}
    >
      <a
        href={company.phoneHref}
        className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 text-sm font-semibold text-white"
      >
        <Phone className="h-4 w-4" /> Call Sales
      </a>
      <Button to="/quote" size="lg" className="h-12 text-sm">
        Request a Quote
      </Button>
    </div>
  );
}
