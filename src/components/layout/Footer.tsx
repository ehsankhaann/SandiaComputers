import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "@/lib/router";
import { categories } from "@/data/products";
import { company, industries } from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Primitives";
import { useApp } from "@/context/AppContext";

export function Footer() {
  const { toast } = useApp();
  const [email, setEmail] = useState("");

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast("Please enter a valid email address.", { tone: "info" });
      return;
    }
    toast("Subscribed. We'll send occasional system updates—no spam.");
    setEmail("");
  };

  const columns = [
    {
      title: "Systems",
      links: [
        ...categories.map((c) => ({ label: c.shortName, to: `/systems?category=${c.slug}` })),
        { label: "Build your own", to: "/configurator" },
      ],
    },
    {
      title: "Industries",
      links: industries.map((i) => ({ label: i.name, to: `/industries/${i.slug}` })),
    },
    {
      title: "Company",
      links: [
        { label: "About Sandia", to: "/about" },
        { label: "Why build to order", to: "/about#process" },
        { label: "Contact", to: "/contact" },
        { label: "Request a quote", to: "/quote" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Support center", to: "/support" },
        { label: "Warranty", to: "/support#warranty" },
        { label: "FAQs", to: "/support#faq" },
        { label: "Government & education", to: "/industries/government" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-brand-ink pb-24 text-white/60 md:pb-0">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-[0.06]" />
      <Container className="relative py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              Custom-built-to-order PCs, professional workstations, servers and storage. Local to Albuquerque since {company.founded}, trusted by businesses, agencies, schools and studios nationwide.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-lime" />
                <span>{company.address}<br />{company.city}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-lime" />
                <a href={company.phoneHref} className="hover:text-white">{company.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-lime" />
                <a href={`mailto:${company.salesEmail}`} className="hover:text-white">{company.salesEmail}</a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="inline-block py-0.5 text-sm text-white/55 transition-colors hover:text-brand-lime">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h4 className="font-display text-lg font-bold text-white">System updates & procurement tips</h4>
            <p className="mt-1 text-sm text-white/55">New platforms, pricing windows and deployment guides—about once a month.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input
              id="newsletter"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.gov"
              className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/35 focus:border-brand-lime focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-brand-lime px-6 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-lime-dark"
            >
              Subscribe <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sandia Computers. All rights reserved. Albuquerque, New Mexico.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-white/60">
              <ShieldCheck className="h-4 w-4 text-brand-lime" /> NDAA / TAA compliant options
            </span>
            <a href="#/support" className="hover:text-white">Privacy</a>
            <a href="#/support" className="hover:text-white">Terms</a>
            <a href="#/support" className="hover:text-white">Accessibility</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
