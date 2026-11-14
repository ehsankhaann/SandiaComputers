import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";

export interface Route {
  path: string;
  segments: string[];
  query: URLSearchParams;
  anchor: string;
  hash: string;
}

function parseHash(raw: string): Route {
  const stripped = raw.replace(/^#/, "") || "/";
  const [beforeAnchor, anchor = ""] = stripped.split("#");
  const [pathPart, queryPart = ""] = beforeAnchor.split("?");
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
  return {
    path: normalized,
    segments: normalized.split("/").filter(Boolean),
    query: new URLSearchParams(queryPart),
    anchor,
    hash: raw,
  };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(to: string) {
  const target = to.startsWith("#") ? to : `#${to}`;
  if (window.location.hash === target) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.location.hash = target;
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const href = to.startsWith("#") ? to : `#${to}`;
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (window.location.hash === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/** Scrolls to top on path change, or to an in-page anchor when one is present. */
export function useScrollManager(route: Route) {
  const { path, anchor, hash } = route;
  useEffect(() => {
    if (anchor) {
      const id = window.setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 96;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 60);
      return () => window.clearTimeout(id);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    // Only re-run when the path or anchor changes (not on query changes).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, anchor, anchor ? hash : ""]);
}
