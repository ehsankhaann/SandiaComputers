# Sandia Computers — Website Redesign (React + Vite + Tailwind)

A premium, mobile-first redesign concept for **Sandia Computers** (sandiacomputer.com) — a custom-built-to-order PC, workstation, server and storage supplier based in Albuquerque, NM, serving business, government, education, engineering and creative customers nationwide.

The current visual direction is a **bold, animated consumer-tech aesthetic inspired by the Nexora template**: lavender surfaces, electric violet, lime-green action pills, near-black ink panels, oversized Space Grotesk display type, a floating product collage, a fixed section-navigation rail and smooth motion everywhere. **All Sandia company details are preserved** — name, Albuquerque address, phone, hours, "local since 1997", nationwide shipping, custom workstations/servers/storage, NDAA/TAA compliance, government & education procurement, 3-year warranty, lifetime support and the 16-system catalog.

This is a fully interactive front-end prototype using **dummy data and no database**. Every page, menu, form, filter and configurator works end-to-end in the browser; state that should persist (quote list, configurator build, quote draft) is saved to `localStorage`.

> Business/sales documentation (how to sell this build, ICP, LinkedIn playbook, outreach scripts) lives in [`project.md`](./project.md).

---

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/index.html (single self-contained file)
npm run preview   # preview the production build
```

The build uses `vite-plugin-singlefile`, so **all JS, CSS and images are inlined into one `dist/index.html`** (~1.5 MB, ~866 KB gzipped). All nine product images are optimized to ≤1200 px / quality 76 before inlining. You can open or host that single file anywhere — no server, no asset paths to break.

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript | Component model, strict typing for data contracts |
| Build | Vite 7 | Fast builds, single-file output |
| Styling | Tailwind CSS v4 (`@theme` tokens) | Brand palette + keyframes as design tokens, zero runtime CSS |
| Motion | CSS keyframes + IntersectionObserver + rAF | Line reveals, float/parallax, count-ups, marquee, scroll reveals, route fades — all reduced-motion aware |
| Type | Space Grotesk (display) + Inter (body) | Bold geometric uppercase headlines, clean readable copy |
| Icons | `lucide-react` | Consistent, lightweight line icons |
| Routing | Custom hash router (`src/lib/router.tsx`) | No dependency; back/forward, query strings and in-page anchors all work from a single HTML file |
| State | React context + `localStorage` | Quote list, toasts, configurator and quote-draft persistence |

No backend, CMS, or API calls. Images are AI-generated product photography stored in `src/assets` and inlined at build time.

---

## Project structure

```
src/
├── App.tsx                      # Route switch, page titles, back-to-top
├── index.css                    # Tailwind v4 theme (brand colors, shadows, animations, utilities)
├── lib/router.tsx               # useRoute, Link, navigate, scroll/anchor manager
├── context/AppContext.tsx       # Quote list (localStorage) + toast system
├── data/
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── products.ts              # 5 categories, 16 systems with full specs
│   ├── content.ts               # Company info, industries, testimonials, FAQs, timeline, team
│   └── configurator.ts          # 5 base platforms, 9 component groups, ~80 options
├── components/
│   ├── layout/Header.tsx        # Glass header, mega menus, mobile drawer, CTA bar, lime scroll-progress line
│   ├── layout/Footer.tsx        # Dark ink 4-column footer, newsletter, compliance badges
│   ├── layout/navData.ts        # Icon maps + primary links
│   ├── ProductCard.tsx          # Reusable system card (quote + compare actions)
│   └── ui/                      # Button, Logo, Fields, Primitives (Container, Section, Modal, Accordion, Reveal…)
└── pages/
    ├── HomePage.tsx             # Section rail, animated hero + collage, trust marquee, dark feature panel, top-picks carousel, count-up stats, sectors, outcomes, process, story/CTA
    ├── SystemsPage.tsx          # Catalog: tabs, search, sort, filters, compare
    ├── SystemDetailPage.tsx     # Product detail: buy box, tabs, related systems
    ├── ConfiguratorPage.tsx     # Build-to-order configurator with live pricing
    ├── IndustriesPage.tsx       # Industry overview + detail panels
    ├── AboutPage.tsx            # Story, values, process, timeline, team, partners
    ├── SupportPage.tsx          # Contact cards, warranty tiers, searchable FAQ
    ├── QuotePage.tsx            # 3-step quote request with validation + success state
    ├── ContactPage.tsx          # Contact cards, form, stylized map
    └── NotFoundPage.tsx
```

---

## Feature overview

### Navigation & layout
- **Sticky header** with utility bar (phone, hours, public-sector link) on desktop; compact bar on mobile/tablet.
- **Desktop mega menus** for *Systems* (category grid with starting prices + featured system) and *Industries* (six verticals + public-sector callout). Opens on hover for mouse users, on tap for touch devices; closes on Escape, outside click, or navigation. Keyboard accessible (`aria-haspopup`, `aria-expanded`, `aria-controls`).
- **Mobile drawer** (slide-in, focus-trapped, body-scroll-locked) with accordion sections for Systems and Industries, 48px+ tap targets, phone CTA, hours.
- **Mobile sticky CTA bar** — "Call Sales" + "Request a Quote" always within thumb reach (hidden on pages with their own bottom actions).
- **Quote-list badge** in the header updates live as systems are added.
- Skip-to-content link, back-to-top button, `prefers-reduced-motion` support.

### Home (Nexora-inspired composition)
- **Floating section rail** (desktop): five icons with a sliding dark active pill, hover tooltips, scroll-spy tracking and smooth-scroll navigation.
- **Hero**: lavender grid background, breathing glows, rotating dashed ring, three-line staggered headline reveal with an animated violet gradient word, mouse-parallax floating product collage (workstation + laptop + rack server + mini PC), lime "Explore Systems" pill with rotating dark arrow circle, "Build your own" pill, proof stats and floating "NDAA compliant" / "72-hour burn-in" chips.
- **Trust marquee** of buyer segments, pause-on-hover.
- **Dark "Built for the work ahead" panel**: four lime-outline features with dividers, hover lift, subtle shimmer and dot pattern.
- **"Explore our top picks" carousel**: 8 real Sandia systems, prev/next arrows, swipe, snap, autoplay with pause, progress dots and a lime `+` that adds straight to the quote list.
- **Violet stats band** with requestAnimationFrame count-up (28+ years, 15,000+ systems, 50 states, 4.9/5 rating).
- **Industries grid** (all six verticals), **outcomes grid** (71% faster 4K exports, 65% faster CAD…), 4-step **process** with dark hover inversion.
- **Story / CTA block**: purple-lit VR portrait, rotating customer quote with lime quotation mark and dots, and a bordered "Ready to upgrade your infrastructure?" card with the lime "Join the Sandia family" CTA.

### Systems catalog (`#/systems`)
- Category tabs synced to the URL (`?category=servers`), horizontally scrollable on mobile.
- Instant **search** across name, tagline, specs and use cases.
- **Sort** (featured, price asc/desc, name).
- **Filters** — price band, form factor, certifications; sidebar on desktop, bottom sheet on mobile with live result count.
- **Compare mode** — select up to 3 systems → sticky compare bar → responsive comparison table in a modal (horizontally scrollable on small screens) with *Add to quote* per column.
- Empty state with reset + custom-quote CTA.

### System detail (`#/systems/:slug`)
- Breadcrumbs, gallery, badges, starting price, monthly-lease estimate.
- Quantity stepper, **Add to quote list**, **Customize this system** (deep-links into the configurator with the right base platform).
- Tabs: Overview (highlights, ideal-for chips, specialist CTA), Specifications (zebra table), Warranty & Support.
- Related systems from the same category.

### Configurator (`#/configurator`)
- Choose one of **5 base platforms**; each unlocks only the relevant components (processor, graphics, memory, primary/data storage, chassis & cooling, networking, OS, warranty, deployment services).
- Radio/checkbox cards with price deltas ("Included", "+$1,150", "−$40"), *Recommended* badges.
- **Live pricing**: unit price, quantity, **automatic volume discounts** (5/10/25 units), estimated lead time and monthly lease estimate.
- Sticky summary panel on desktop; **collapsible bottom sheet** on mobile/tablet.
- Actions: Request a quote for this build (adds the build to the quote list and jumps to the form), Add to quote list, Copy build summary (clipboard), Reset.
- Build persists in `localStorage`; `?base=server&from=rs-2200` deep-link support.

### Industries (`#/industries/:slug`)
- Six verticals: Business, Government & Defense, Education, Engineering & CAD, Creative & Media, AI & Research.
- Sticky vertical selector on desktop; horizontal chip strip on mobile.
- Each detail: headline, compliance chips (NDAA 889, TAA, cooperative contracts…), key stat, "what slows teams down" vs "how Sandia helps", recommended systems, industry-specific quote CTA.

### Request a quote (`#/quote`)
- **3-step form**: Project → Contact → Review, with a visual stepper.
- Per-step **inline validation** (required fields, email/phone formats, minimum description length, consent).
- Attached **quote list** with quantity controls, removal and subtotal.
- Procurement checkboxes (PO/Net-30, NDAA docs, tax-exempt), US state select, lead source.
- Draft auto-saved to `localStorage`; industry pre-fill via `?industry=government`.
- Simulated submission → **success screen with reference number** (e.g. `SQ-2025-4821`), clears list/draft.
- Sidebar: what happens next, named specialist card with click-to-call, trust bullets.

### Support (`#/support`)
- Click-to-call / email / hours cards.
- Three warranty tiers (standard, advance replacement, on-site NBD).
- **Searchable FAQ** with category chips and animated accordion.

### About & Contact
- About: story, stats, values, documented process, **timeline**, leadership, partner ecosystem.
- Contact: contact cards, validated message form with success state, stylized SVG map, shipping note.

### Motion & interface details
- **Entrance**: staggered line-reveal headline, fade-up chips/CTAs, scale-in collage, route-change fade on every page.
- **Continuous**: slow float on the hero collage, breathing ambient glows, rotating dashed orbit, pulsing ring, marquee, dark-panel shimmer.
- **Scroll-driven**: IntersectionObserver reveals with stagger, count-up statistics, sliding rail indicator, lime→violet reading-progress line under the header.
- **Pointer-driven**: hero parallax on mouse move, card lift/tilt and image zoom, rotating arrow circles, icon color inversions, glowing hover orbs.
- All motion is disabled or effectively instant under `prefers-reduced-motion: reduce`.
- Dark glass toasts with action links; document title per route; consistent 44–48px tap targets.

---

## Design system

The Nexora-inspired palette is defined as Tailwind v4 tokens in `src/index.css`. Sandia's original red/blue heritage is retained as a secondary accent and in the legacy token aliases so every existing page inherits the new look automatically:

| Token | Value | Use |
|---|---|---|
| `brand-lime` / `-dark` / `-soft` | `#c9f64b` / `#b3e52f` / `#f1ffd2` | Primary CTAs, action circles, accent icons, progress line |
| `brand-violet` / `-light` | `#7c4dff` / `#a78bfa` | Gradient headline, secondary actions, eyebrows, links |
| `brand-lav` / `-deep` | `#f2eeff` / `#e5dcff` | Hero background, card surfaces, borders |
| `brand-ink` / `-soft` | `#141026` / `#1e1938` | Dark panels, text, header strip, footer, buttons |
| `brand-blue*` (alias) | violet scale | Remapped so older pages restyle automatically |
| `brand-red*` (alias) | coral scale | Badges and small accent notes |

Typography: **Space Grotesk** for display headlines (bold, uppercase, negative tracking) and **Inter** for body copy. Custom utilities: `text-gradient`, `mask-edges`, `dot-pattern`, `card-tilt`, `glass-dark`, `shimmer-surface`, `glow-lime`, `reveal`. Radii 12–28px; layered `shadow-soft` / `shadow-lift` / `shadow-lime` / `shadow-violet`.

---

## Responsive strategy (mobile & tablet are first-class)

- Layouts are designed per breakpoint, not scaled: single-column with bottom sheets on phones, 2-column grids and visible CTAs on tablets, sidebars/mega menus from `lg` (1024px).
- Horizontal overflow is structurally prevented (`min-w-0` on grid items that contain scrollable strips, `overflow-x: clip` safety net on `html`/`body`).
- Verified with headless Chrome across **8 viewport widths (360–1440px) × 13 routes = 104 checks**: no element exceeds the viewport, no console errors. Plus 12 automated homepage interaction checks (headline fit, hero CTA, carousel, add-to-quote, count-up, rail scroll-spy, testimonial dots, story CTA, mobile drawer) and a 16-step full-site flow regression test.
- Tables become scrollable cards/sheets; filters and build summaries become bottom sheets; mega menus become accordions.

---

## Connecting a real backend later

The prototype is intentionally decoupled:

- Replace `src/data/*.ts` with API calls (or a WordPress/WooCommerce REST or headless CMS source) — components only consume the typed shapes in `src/data/types.ts`.
- Quote/contact forms call a single `submit()` function; swap the simulated delay for a `fetch` to your CRM/webhook (HubSpot, Zoho, Gravity Forms endpoint, etc.).
- The hash router can be replaced with React Router if you deploy to a host with history-API rewrites; the `Link`/`navigate` API was kept deliberately similar.
- For a WordPress delivery (as in the original brief), this prototype serves as the approved design + interaction spec; sections map cleanly to Gutenberg/Elementor blocks or a custom theme.

---

## Accessibility notes

Semantic landmarks, labelled form controls with `aria-invalid` and `role="alert"`, dialog semantics with focus trapping and Escape handling, `aria-expanded`/`aria-pressed` on toggles, visible focus rings, color-contrast-safe palette, reduced-motion support.

---

## License

Prototype created for proposal/demo purposes. Product names, people, testimonials, prices and statistics are **fictional placeholder data** unless otherwise sourced from Sandia Computers' public website.
