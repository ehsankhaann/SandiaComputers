import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Quote list                                                          */
/* ------------------------------------------------------------------ */
export interface QuoteItem {
  id: string;
  name: string;
  detail: string;
  price: number;
  qty: number;
  kind: "system" | "build";
  link?: string;
}

interface Toast {
  id: number;
  message: string;
  tone: "success" | "info";
  action?: { label: string; to: string };
}

interface AppState {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "qty">, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  count: number;
  toast: (message: string, opts?: { tone?: Toast["tone"]; action?: Toast["action"] }) => void;
}

const Ctx = createContext<AppState | null>(null);
const STORAGE_KEY = "sandia-quote-list-v1";

function load(): QuoteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuoteItem[]) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const toast = useCallback<AppState["toast"]>((message, opts) => {
    const id = ++counter.current;
    setToasts((t) => [...t, { id, message, tone: opts?.tone ?? "success", action: opts?.action }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const addItem = useCallback<AppState["addItem"]>((item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, Math.min(999, qty)) } : p)));
  }, []);

  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((p) => p.id !== id)), []);
  const clearItems = useCallback(() => setItems([]), []);

  const value = useMemo<AppState>(
    () => ({
      items,
      addItem,
      updateQty,
      removeItem,
      clearItems,
      count: items.reduce((n, i) => n + i.qty, 0),
      toast,
    }),
    [items, addItem, updateQty, removeItem, clearItems, toast],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* Toast viewport */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-brand-ink px-4 py-3 text-white shadow-violet animate-scale-in"
          >
            {t.tone === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-lime" />
            ) : (
              <Info className="h-5 w-5 shrink-0 text-brand-lime" />
            )}
            <p className="flex-1 text-sm font-medium text-white">{t.message}</p>
            {t.action && (
              <a
                href={`#${t.action.to}`}
                className="text-sm font-semibold text-brand-lime hover:underline"
                onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              >
                {t.action.label}
              </a>
            )}
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
