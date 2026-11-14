import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock, FileText, Loader2, Minus, Phone, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { Link, type Route } from "@/lib/router";
import { cn } from "@/utils/cn";
import { company, team } from "@/data/content";
import { formatPrice } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { ChipToggle, Field, Input, Select, Textarea } from "@/components/ui/Fields";
import { Container } from "@/components/ui/Primitives";
import { useApp } from "@/context/AppContext";

const DRAFT_KEY = "sandia-quote-draft-v1";
const systemTypes = ["Workstations", "Servers", "Storage", "Gaming PCs", "Business desktops", "Not sure yet"];
const states = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

interface FormData {
  types: string[];
  quantity: string;
  budget: string;
  timeline: string;
  orgType: string;
  description: string;
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  phone: string;
  state: string;
  source: string;
  needsPO: boolean;
  needsNDAA: boolean;
  taxExempt: boolean;
  consent: boolean;
}

const empty: FormData = {
  types: [],
  quantity: "1",
  budget: "",
  timeline: "",
  orgType: "",
  description: "",
  firstName: "",
  lastName: "",
  organization: "",
  email: "",
  phone: "",
  state: "",
  source: "",
  needsPO: false,
  needsNDAA: false,
  taxExempt: false,
  consent: false,
};

const industryToOrg: Record<string, string> = {
  government: "Government agency",
  education: "Education",
  business: "Business",
  engineering: "Business",
  creative: "Business",
  "ai-research": "Education",
};

type Errors = Partial<Record<keyof FormData, string>>;

export function QuotePage({ route }: { route: Route }) {
  const { items, updateQty, removeItem, clearItems, toast } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (saved) return { ...empty, ...saved, consent: false };
    } catch {
      /* noop */
    }
    const industry = route.query.get("industry");
    return { ...empty, orgType: industry ? industryToOrg[industry] ?? "" : "" };
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  }, [data, reference]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const listTotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);

  const validate = (s: number): boolean => {
    const e: Errors = {};
    if (s === 0) {
      if (data.types.length === 0) e.types = "Select at least one system type.";
      if (!data.timeline) e.timeline = "Let us know your timeline.";
      if (!data.orgType) e.orgType = "Select your organization type.";
      if (data.description.trim().length < 20) e.description = "Please describe the project in at least 20 characters.";
      if (!data.quantity || Number(data.quantity) < 1) e.quantity = "Enter a quantity of 1 or more.";
    }
    if (s === 1) {
      if (!data.firstName.trim()) e.firstName = "Required.";
      if (!data.lastName.trim()) e.lastName = "Required.";
      if (!data.organization.trim()) e.organization = "Required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email address.";
      if (data.phone && !/^[\d\s().+-]{7,}$/.test(data.phone)) e.phone = "Enter a valid phone number.";
      if (!data.state) e.state = "Select your state.";
    }
    if (s === 2) {
      if (!data.consent) e.consent = "Please confirm so we can reply to your request.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast("Please complete the highlighted fields.", { tone: "info" });
    }
  };
  const back = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validate(2)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const ref = `SQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReference(ref);
    setSubmitting(false);
    localStorage.removeItem(DRAFT_KEY);
    clearItems();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (reference) {
    return (
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center animate-scale-in">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Request received. Thank you, {data.firstName}.</h1>
          <p className="mt-4 text-slate-600 sm:text-lg">
            Your reference number is <span className="font-bold text-slate-900">{reference}</span>. A specialist will review your project and send a written configuration and quote to{" "}
            <span className="font-semibold text-slate-900">{data.email}</span> within one business day.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left text-sm">
            <p className="font-bold text-slate-900">What happens next</p>
            <ol className="mt-3 space-y-2 text-slate-600">
              <li>1. We confirm receipt by email within the hour.</li>
              <li>2. A specialist may call to clarify applications or deadlines.</li>
              <li>3. You receive a formal quote with alternatives and lead times.</li>
            </ol>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button to="/" variant="outline">
              Back to home
            </Button>
            <Button to="/systems">
              Browse systems <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  const steps = ["Project", "Contact", "Review"];

  return (
    <>
      <section className="border-b border-slate-200 bg-slate-50">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">Request a quote</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Tell us about the project. We'll handle the spec.</h1>
          <p className="mt-3 max-w-2xl text-slate-600 sm:text-lg">
            Three short steps. A written configuration and formal quote within one business day—no obligation.
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Stepper */}
            <ol className="grid grid-cols-3 gap-2" aria-label="Progress">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      i < step ? "bg-emerald-600 text-white" : i === step ? "bg-brand-blue text-white" : "bg-slate-200 text-slate-500",
                    )}
                    aria-current={i === step ? "step" : undefined}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={cn("text-sm font-semibold", i === step ? "text-slate-900" : "text-slate-500")}>{s}</span>
                  <span className={cn("ml-auto hidden h-0.5 flex-1 sm:block", i < step ? "bg-emerald-600" : "bg-slate-200")} />
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-2xl border border-slate-200 p-5 sm:p-8" key={step}>
              {step === 0 && (
                <div className="space-y-7 animate-fade-in">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-800">
                      What are you looking for? <span className="text-brand-red">*</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {systemTypes.map((t) => (
                        <ChipToggle
                          key={t}
                          active={data.types.includes(t)}
                          onClick={() => set("types", data.types.includes(t) ? data.types.filter((x) => x !== t) : [...data.types, t])}
                        >
                          {data.types.includes(t) && <Check className="mr-1.5 h-4 w-4" />}
                          {t}
                        </ChipToggle>
                      ))}
                    </div>
                    {errors.types && <p className="mt-2 text-xs font-medium text-brand-red">{errors.types}</p>}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Approximate quantity" htmlFor="quantity" required error={errors.quantity}>
                      <Input id="quantity" type="number" min={1} value={data.quantity} onChange={(e) => set("quantity", e.target.value)} invalid={!!errors.quantity} />
                    </Field>
                    <Field label="Budget range" htmlFor="budget" hint="Optional—helps us recommend the right tier.">
                      <Select id="budget" value={data.budget} onChange={(e) => set("budget", e.target.value)}>
                        <option value="">Select…</option>
                        <option>Under $5,000</option>
                        <option>$5,000 – $25,000</option>
                        <option>$25,000 – $100,000</option>
                        <option>$100,000+</option>
                        <option>Not sure yet</option>
                      </Select>
                    </Field>
                    <Field label="Timeline" htmlFor="timeline" required error={errors.timeline}>
                      <Select id="timeline" value={data.timeline} onChange={(e) => set("timeline", e.target.value)} invalid={!!errors.timeline}>
                        <option value="">Select…</option>
                        <option>As soon as possible (1–2 weeks)</option>
                        <option>This month</option>
                        <option>This quarter</option>
                        <option>Planning / budgeting</option>
                      </Select>
                    </Field>
                    <Field label="Organization type" htmlFor="orgType" required error={errors.orgType}>
                      <Select id="orgType" value={data.orgType} onChange={(e) => set("orgType", e.target.value)} invalid={!!errors.orgType}>
                        <option value="">Select…</option>
                        <option>Business</option>
                        <option>Government agency</option>
                        <option>Education</option>
                        <option>Non-profit</option>
                        <option>Individual</option>
                      </Select>
                    </Field>
                  </div>

                  <Field label="Describe the project" htmlFor="description" required error={errors.description} hint="Applications, file sizes, deployment details, compliance needs—anything that helps.">
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => set("description", e.target.value)}
                      invalid={!!errors.description}
                      placeholder="e.g., 12 CAD workstations for Revit and Civil 3D, large point-cloud files, need imaging and asset tags, delivery before fiscal year end…"
                    />
                  </Field>

                  {/* Attached quote list */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Systems in your quote list</p>
                      <Link to="/systems" className="text-sm font-semibold text-brand-blue hover:underline">
                        + Add systems
                      </Link>
                    </div>
                    {items.length === 0 ? (
                      <p className="mt-2 rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        No systems attached yet. That's fine—describe what you need above, or{" "}
                        <Link to="/configurator" className="font-semibold text-brand-blue hover:underline">
                          build one in the configurator
                        </Link>
                        .
                      </p>
                    ) : (
                      <ul className="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200">
                        {items.map((i) => (
                          <li key={i.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900">{i.name}</p>
                              <p className="truncate text-xs text-slate-500">{i.detail}</p>
                            </div>
                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <div className="inline-flex h-10 items-center rounded-lg border border-slate-300">
                                <button type="button" aria-label="Decrease" onClick={() => updateQty(i.id, i.qty - 1)} className="flex h-full w-10 items-center justify-center text-slate-600 hover:bg-slate-50">
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center text-sm font-semibold">{i.qty}</span>
                                <button type="button" aria-label="Increase" onClick={() => updateQty(i.id, i.qty + 1)} className="flex h-full w-10 items-center justify-center text-slate-600 hover:bg-slate-50">
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <span className="w-24 text-right text-sm font-bold text-slate-900">{formatPrice(i.price * i.qty)}</span>
                              <button type="button" aria-label={`Remove ${i.name}`} onClick={() => removeItem(i.id)} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-brand-red">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </li>
                        ))}
                        <li className="flex items-center justify-between bg-slate-50 p-4 text-sm">
                          <span className="text-slate-600">Estimated subtotal (before volume pricing)</span>
                          <span className="font-bold text-slate-900">{formatPrice(listTotal)}</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2 animate-fade-in">
                  <Field label="First name" htmlFor="firstName" required error={errors.firstName}>
                    <Input id="firstName" autoComplete="given-name" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} invalid={!!errors.firstName} />
                  </Field>
                  <Field label="Last name" htmlFor="lastName" required error={errors.lastName}>
                    <Input id="lastName" autoComplete="family-name" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} invalid={!!errors.lastName} />
                  </Field>
                  <Field label="Organization" htmlFor="organization" required error={errors.organization} className="sm:col-span-2">
                    <Input id="organization" autoComplete="organization" value={data.organization} onChange={(e) => set("organization", e.target.value)} invalid={!!errors.organization} />
                  </Field>
                  <Field label="Work email" htmlFor="email" required error={errors.email}>
                    <Input id="email" type="email" inputMode="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} invalid={!!errors.email} />
                  </Field>
                  <Field label="Phone" htmlFor="phone" error={errors.phone} hint="Optional. Helpful for quick clarifications.">
                    <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} invalid={!!errors.phone} />
                  </Field>
                  <Field label="State" htmlFor="state" required error={errors.state}>
                    <Select id="state" value={data.state} onChange={(e) => set("state", e.target.value)} invalid={!!errors.state}>
                      <option value="">Select…</option>
                      {states.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="How did you hear about us?" htmlFor="source">
                    <Select id="source" value={data.source} onChange={(e) => set("source", e.target.value)}>
                      <option value="">Select…</option>
                      <option>Search engine</option>
                      <option>Referral / colleague</option>
                      <option>LinkedIn</option>
                      <option>Existing customer</option>
                      <option>Trade show / conference</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <fieldset className="sm:col-span-2">
                    <legend className="mb-2 text-sm font-semibold text-slate-800">Procurement needs</legend>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        ["needsPO", "Purchase order / Net-30"],
                        ["needsNDAA", "NDAA / TAA documentation"],
                        ["taxExempt", "Tax-exempt organization"],
                      ].map(([key, label]) => (
                        <label key={key} className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={data[key as "needsPO" | "needsNDAA" | "taxExempt"]}
                            onChange={(e) => set(key as "needsPO", e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 accent-brand-blue"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <ReviewBlock title="Project" onEdit={() => setStep(0)}>
                    <Row k="Systems" v={data.types.join(", ")} />
                    <Row k="Quantity" v={data.quantity} />
                    {data.budget && <Row k="Budget" v={data.budget} />}
                    <Row k="Timeline" v={data.timeline} />
                    <Row k="Organization type" v={data.orgType} />
                    <Row k="Description" v={data.description} />
                    {items.length > 0 && <Row k="Attached systems" v={items.map((i) => `${i.qty} × ${i.name}`).join("; ")} />}
                  </ReviewBlock>
                  <ReviewBlock title="Contact" onEdit={() => setStep(1)}>
                    <Row k="Name" v={`${data.firstName} ${data.lastName}`} />
                    <Row k="Organization" v={data.organization} />
                    <Row k="Email" v={data.email} />
                    {data.phone && <Row k="Phone" v={data.phone} />}
                    <Row k="State" v={data.state} />
                    {(data.needsPO || data.needsNDAA || data.taxExempt) && (
                      <Row k="Procurement" v={[data.needsPO && "PO / Net-30", data.needsNDAA && "NDAA / TAA docs", data.taxExempt && "Tax-exempt"].filter(Boolean).join(", ")} />
                    )}
                  </ReviewBlock>
                  <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm text-slate-700", errors.consent ? "border-brand-red bg-brand-red-light/40" : "border-slate-200")}>
                    <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-blue" />
                    <span>
                      I'd like Sandia Computers to contact me about this request. We never share your information and you can opt out any time.
                      {errors.consent && <span className="mt-1 block text-xs font-medium text-brand-red">{errors.consent}</span>}
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
                {step > 0 ? (
                  <Button variant="ghost" onClick={back}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < 2 ? (
                  <Button onClick={next} size="lg">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={submit} size="lg" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        Submit request <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-900">What happens next</h2>
              <ul className="mt-4 space-y-4 text-sm text-slate-600">
                {[
                  { icon: Clock, t: "Within 1 hour", b: "Confirmation email with your reference number." },
                  { icon: Phone, t: "Within 1 business day", b: "A specialist reviews your workload and may call to clarify." },
                  { icon: FileText, t: "Written quote", b: "Formal configuration, alternatives, lead times and pricing." },
                ].map((s) => (
                  <li key={s.t} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                      <s.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-semibold text-slate-900">{s.t}</span>
                      {s.b}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-brand-navy p-6 text-white">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-bold">{team[1].initials}</span>
                <div>
                  <p className="font-bold">{team[1].name}</p>
                  <p className="text-xs text-slate-300">{team[1].title}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">Prefer to talk it through? Call during business hours and we'll spec it live.</p>
              <a href={company.phoneHref} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-slate-900 hover:bg-slate-100">
                <Phone className="h-4 w-4" /> {company.phone}
              </a>
              <p className="mt-2 text-center text-xs text-slate-400">{company.hours}</p>
            </div>
            <ul className="space-y-2 rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
              {["Purchase orders & Net-30 accepted", "NDAA / TAA compliant options", "Education & government pricing", "3-year warranty, lifetime support"].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>
    </>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-brand-blue hover:underline">
          Edit
        </button>
      </div>
      <dl className="divide-y divide-slate-100">{children}</dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-3">
      <dt className="text-slate-500">{k}</dt>
      <dd className="text-slate-900 sm:col-span-2">{v || "—"}</dd>
    </div>
  );
}
