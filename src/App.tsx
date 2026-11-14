import { useEffect, useState, type ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { useRoute, useScrollManager } from "@/lib/router";
import { cn } from "@/utils/cn";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/pages/HomePage";
import { SystemsPage } from "@/pages/SystemsPage";
import { SystemDetailPage } from "@/pages/SystemDetailPage";
import { ConfiguratorPage } from "@/pages/ConfiguratorPage";
import { IndustriesPage } from "@/pages/IndustriesPage";
import { AboutPage } from "@/pages/AboutPage";
import { SupportPage } from "@/pages/SupportPage";
import { QuotePage } from "@/pages/QuotePage";
import { ContactPage } from "@/pages/ContactPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const titles: Record<string, string> = {
  "": "Custom Workstations, PCs, Servers & Storage",
  systems: "Systems",
  configurator: "Build Your Own",
  industries: "Industries",
  about: "About",
  support: "Support",
  quote: "Request a Quote",
  contact: "Contact",
};

export default function App() {
  const route = useRoute();
  useScrollManager(route);
  const [first = "", second] = route.segments;

  useEffect(() => {
    const t = titles[first] ?? "Page not found";
    document.title = `${t} | Sandia Computers`;
  }, [first]);

  let page: ReactNode;
  switch (first) {
    case "":
      page = <HomePage />;
      break;
    case "systems":
      page = second ? <SystemDetailPage key={second} slug={second} /> : <SystemsPage route={route} />;
      break;
    case "configurator":
      page = <ConfiguratorPage route={route} />;
      break;
    case "industries":
      page = <IndustriesPage slug={second} />;
      break;
    case "about":
      page = <AboutPage />;
      break;
    case "support":
      page = <SupportPage />;
      break;
    case "quote":
      page = <QuotePage route={route} />;
      break;
    case "contact":
      page = <ContactPage route={route} />;
      break;
    default:
      page = <NotFoundPage />;
  }

  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col">
        <Header path={route.path} />
        <main id="main" className="flex-1">
          <div key={route.path} className="animate-fade-in">
            {page}
          </div>
        </main>
        <Footer />
      </div>
      <BackToTop />
    </AppProvider>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-24 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lift transition-all duration-300 hover:bg-slate-900 hover:text-white md:bottom-6 md:right-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
