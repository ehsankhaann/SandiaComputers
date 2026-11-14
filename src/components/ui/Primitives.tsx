import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/utils/cn";

/* ---------- Container ---------- */
export function Container({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...rest}>
      {children}
    </div>
  );
}

/* ---------- Section ---------- */
export function Section({
  className,
  children,
  tone = "white",
  id,
}: {
  className?: string;
  children: ReactNode;
  tone?: "white" | "gray" | "navy" | "blue";
  id?: string;
}) {
  const tones = {
    white: "bg-white",
    gray: "bg-brand-lav/40",
    navy: "bg-brand-ink text-slate-300",
    blue: "bg-gradient-to-r from-[#5b32e8] to-[#8b5cf6] text-white",
  };
  return (
    <section id={id} className={cn("py-14 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-bold uppercase tracking-[0.18em]",
            light ? "text-brand-lime" : "text-brand-violet",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-slate-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-slate-300" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  tone = "gray",
  className,
}: {
  children: ReactNode;
  tone?: "gray" | "blue" | "red" | "green" | "navy";
  className?: string;
}) {
  const tones = {
    gray: "bg-slate-100 text-slate-700",
    blue: "bg-brand-lav text-brand-violet",
    red: "bg-brand-red-light text-brand-red-dark",
    green: "bg-brand-lime/30 text-brand-ink",
    navy: "bg-brand-ink text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref as never}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

/* ---------- Accordion item ---------- */
export function AccordionItem({
  title,
  children,
  open,
  onToggle,
  meta,
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  meta?: string;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span>
          {meta && <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-blue">{meta}</span>}
          <span className="text-base font-semibold text-slate-900 sm:text-lg">{title}</span>
        </span>
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform duration-300",
            open && "rotate-180 border-brand-blue bg-brand-blue text-white",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pr-12 text-sm leading-relaxed text-slate-600 sm:text-base">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { md: "sm:max-w-lg", lg: "sm:max-w-3xl", xl: "sm:max-w-5xl" };
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-lift animate-scale-in sm:rounded-2xl",
          sizes[size],
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Stat ---------- */
export function Stat({ value, label, light = false }: { value: string; label: string; light?: boolean }) {
  return (
    <div>
      <div className={cn("font-display text-3xl font-bold tracking-tight sm:text-4xl", light ? "text-white" : "text-brand-ink")}>
        {value}
      </div>
      <div className={cn("mt-1 text-sm", light ? "text-slate-300" : "text-slate-500")}>{label}</div>
    </div>
  );
}
