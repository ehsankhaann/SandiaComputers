import { ArrowRight, Award, HeartHandshake, MapPin, Microscope } from "lucide-react";
import aboutImg from "@/assets/about-lab.jpg";
import { company, partners, process, stats, team, timeline } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Container, Reveal, Section, SectionHeading, Stat } from "@/components/ui/Primitives";

export function AboutPage() {
  return (
    <>
      <section className="bg-slate-50">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">About Sandia Computers</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Local since {company.founded}. Trusted nationwide.
            </h1>
            <p className="mt-5 text-slate-600 sm:text-lg">
              Sandia Computers started as a small shop near the University of New Mexico, building machines for engineering students and the labs that hired them. Nearly three decades later, we ship custom workstations, servers and storage to agencies, universities and businesses in all 50 states—still built by hand, still tested by people who care.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/quote" size="lg">
                Work with us <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                Visit our shop
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lift">
              <img src={aboutImg} alt="Sandia technician assembling a workstation" className="aspect-[3/2] w-full object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200">
        <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading eyebrow="What we believe" title="Three principles behind every system we ship." align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Microscope, title: "Specify for the result", body: "We start with your applications, files and deadlines—not a parts list. The right machine is the one that finishes your work sooner." },
              { icon: Award, title: "Test like it's ours", body: "Every build runs a 72-hour burn-in and application benchmarks. If it won't hold up under sustained load, it doesn't ship." },
              { icon: HeartHandshake, title: "Support like neighbors", body: "You'll talk to the people who built your system—for the life of the system. That's how a local shop earns national customers." },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 60} className="rounded-2xl border border-slate-200 p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="gray" id="process">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Our process" title="Built to order, documented at every step." description="A written spec before we build, a QA checklist when we ship, and a configuration record for life." />
            </div>
            <ol className="space-y-4 lg:col-span-8">
              {process.map((p) => (
                <li key={p.step} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6">
                  <span className="text-2xl font-extrabold text-slate-300">{p.step}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="Our story" title="Twenty-eight years, one standard." />
          <ol className="relative mt-12 space-y-10 border-l border-slate-200 pl-8 sm:space-y-12">
            {timeline.map((t, i) => (
              <Reveal key={t.year} as="li" delay={i * 40} className="relative">
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-blue ring-4 ring-brand-blue-light" />
                <p className="text-sm font-bold text-brand-red">{t.year}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{t.title}</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600">{t.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="gray">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Leadership" title="People who still build." />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {team.map((m) => (
                  <li key={m.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-navy text-base font-bold text-white">{m.initials}</span>
                    <div>
                      <p className="font-bold text-slate-900">{m.name}</p>
                      <p className="text-sm text-slate-500">{m.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Partner ecosystem" title="Enterprise components. Direct relationships." />
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {partners.map((p) => (
                  <li key={p} className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold tracking-wide text-slate-500">
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                {company.address}, {company.city}. Visitors welcome—call ahead and we'll give you the tour.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
