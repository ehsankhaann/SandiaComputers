import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/lib/router";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-lime text-brand-ink hover:bg-brand-lime-dark shadow-lime active:scale-[0.98]",
  secondary:
    "bg-brand-violet text-white hover:bg-brand-blue-dark shadow-violet active:scale-[0.98]",
  outline:
    "border border-slate-300 bg-white text-brand-ink hover:border-brand-ink hover:bg-brand-lav active:scale-[0.98]",
  ghost: "text-brand-ink hover:bg-brand-lav",
  white: "bg-white text-brand-ink hover:bg-slate-100 shadow-sm active:scale-[0.98]",
  dark: "bg-brand-ink text-white hover:bg-brand-ink-soft active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  full?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };
type LinkButtonProps = BaseProps & { to: string; onClick?: () => void; "aria-label"?: string };

export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", size = "md", className, children, full } = props;
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition-all duration-300 select-none disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    full && "w-full",
    className,
  );
  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classes} onClick={props.onClick} aria-label={props["aria-label"]}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, full: _f, children: _ch, to: _t, ...rest } = props as ButtonProps;
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
