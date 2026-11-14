import { useState, type FormEvent } from "react";
import { ArrowRight, Clock, Mail, MapPin, Phone, Truck } from "lucide-react";
import type { Route } from "@/lib/router";
import { company } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Fields";
import { Container } from "@/components/ui/Primitives";
import { useApp } from "@/context/AppContext";

export function ContactPage({ route }: { route: Route }) {
  const { toast } = useApp();
  const initialTopic = route.query.get("topic") === "support" ? "Technical support" : "Sales inquiry";
  const [form, setForm] = useState({ name: "", email: "", topic: initialTopic, message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = "Required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) err.message = "Please add a few more details.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setSent(true);
    toast("Message sent. We'll reply within one business day.");
  };

  const cards = [
    { icon: Phone, title: "Sales", body: company.phone, sub: "Quotes, procurement, volume pricing", href: company.phoneHref },
    { icon: Mail, title: "Email", body: company.salesEmail, sub: `Support: ${company.supportEmail}`, href: `mailto:${company.salesEmail}` },
    { icon: MapPin, title: "Visit", body: company.address, sub: company.city },
    { icon: Clock, title: "Hours", body: company.hours, sub: "Emergency server support available" },
  ];

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Contact</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Real people. Same-day answers.</h1>
          <p className="mt-3 max-w-2xl text-slate-600 sm:text-lg">
            Based in Albuquerque, serving all 50 states. Call, email, or stop by the shop.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Comp = c.href ? "a" : "div";
            return (
              <Comp key={c.title} href={c.href} className="rounded-2xl border border-slate-200 p-5 transition-colors hover:border-slate-300">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{c.title}</p>
                <p className="mt-1 font-semibold text-slate-900 break-words">{c.body}</p>
                <p className="mt-0.5 text-sm text-slate-500">{c.sub}</p>
              </Comp>
            );
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 p-5 sm:p-8">
              {sent ? (
                <div className="py-10 text-center animate-scale-in">
                  <h2 className="text-2xl font-bold text-slate-900">Thanks, {form.name.split(" ")[0]}.</h2>
                  <p className="mt-2 text-slate-600">We've received your message and will reply to {form.email} within one business day.</p>
                  <Button to="/systems" variant="outline" className="mt-6">
                    Browse systems <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-5">
                  <h2 className="text-xl font-bold text-slate-900">Send a message</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" htmlFor="c-name" required error={errors.name}>
                      <Input id="c-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} invalid={!!errors.name} />
                    </Field>
                    <Field label="Email" htmlFor="c-email" required error={errors.email}>
                      <Input id="c-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} invalid={!!errors.email} />
                    </Field>
                  </div>
                  <Field label="Topic" htmlFor="c-topic">
                    <Select id="c-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                      <option>Sales inquiry</option>
                      <option>Technical support</option>
                      <option>Government / education procurement</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <Field label="Message" htmlFor="c-message" required error={errors.message}>
                    <Textarea id="c-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} invalid={!!errors.message} placeholder="How can we help?" />
                  </Field>
                  <Button type="submit" size="lg">
                    Send message <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            {/* Stylized map */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <svg viewBox="0 0 400 260" className="h-auto w-full" aria-hidden="true">
                <defs>
                  <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0v20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="400" height="260" fill="url(#g)" />
                <path d="M0 150 Q100 120 200 140 T400 110" stroke="#cbd5e1" strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d="M0 150 Q100 120 200 140 T400 110" stroke="#fff" strokeWidth="4" fill="none" strokeDasharray="12 10" />
                <path d="M230 0 Q240 100 210 260" stroke="#cbd5e1" strokeWidth="8" fill="none" />
                <path d="M60 0 Q90 130 40 260" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                <circle cx="220" cy="138" r="28" fill="#1e4fa3" opacity="0.12" />
                <circle cx="220" cy="138" r="14" fill="#1e4fa3" opacity="0.2" />
                <g transform="translate(220 128)">
                  <path d="M0-22c-8 0-14 6-14 14 0 10 14 26 14 26s14-16 14-26c0-8-6-14-14-14z" fill="#d7282f" />
                  <circle r="5" cy="-8" fill="#fff" />
                </g>
                <text x="238" y="176" fontSize="11" fontWeight="700" fill="#0f172a" fontFamily="Inter, sans-serif">Sandia Computers</text>
                <text x="238" y="190" fontSize="10" fill="#64748b" fontFamily="Inter, sans-serif">Yale Blvd SE · Albuquerque</text>
              </svg>
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3 text-sm">
                <span className="text-slate-600">{company.address}</span>
                <a
                  href="https://maps.google.com/?q=Sandia+Computers+Albuquerque"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-blue hover:underline"
                >
                  Directions
                </a>
              </div>
            </div>
            <div className="flex gap-4 rounded-2xl border border-slate-200 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red-light text-brand-red">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">Shipping nationwide</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Custom foam, double-boxed and insured to all 50 states. Rack systems ship pre-racked in shock-isolated crates; on-site installation available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
