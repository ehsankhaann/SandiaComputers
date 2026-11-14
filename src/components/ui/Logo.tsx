import { cn } from "@/utils/cn";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light";
  compact?: boolean;
}

export function Logo({ className, variant = "dark", compact = false }: LogoProps) {
  const text = variant === "dark" ? "text-brand-ink" : "text-white";
  const sub = variant === "dark" ? "text-slate-500" : "text-white/60";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} aria-label="Sandia Computers">
      {/* Angular "S / mountain" mark — a nod to the Sandia mountains */}
      <svg viewBox="0 0 36 36" className="h-8 w-8 shrink-0" aria-hidden="true">
        <path d="M5 5h6.4L27 31h-6.4z" fill={variant === "dark" ? "#141026" : "#ffffff"} />
        <path d="M24.6 5H31L15.6 31H9.2z" fill="#a78bfa" />
        <circle cx="29.5" cy="6.5" r="2.4" fill="#c9f64b" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-[19px] font-bold tracking-[-0.04em]", text)}>
            SANDIA<span className="ml-0.5 align-super text-[9px] font-semibold tracking-normal">®</span>
          </span>
          <span className={cn("mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.33em]", sub)}>Computers</span>
        </span>
      )}
    </span>
  );
}
