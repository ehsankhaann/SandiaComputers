# Sandia Computers Redesign — Project, Sales & Outreach Playbook

This document covers three things:

1. **What was built** — a feature-by-feature walkthrough of the web app and how it answers the client brief, including the Nexora-inspired visual direction and all retained Sandia company details.
2. **How to sell it** — positioning, packaging, pricing, demo script and objection handling.
3. **How to find and message your ICP on LinkedIn** — search strategy, qualification signals, connection/DM/InMail scripts and a follow-up cadence.

---

## Part 1 — What was built

### 1.1 The brief, in one line
Sandia Computers (Albuquerque, est. 1997) wants a **premium, modern, high-end website** that makes them look like an **established nationwide computing supplier** for business, government, education, engineering and creative buyers — with mobile/tablet treated as seriously as desktop, an initial homepage concept in 48–72 hours, and fast iteration.

**Latest direction (this version):** recreate the site with the bold consumer-tech template as inspiration — lavender surfaces, electric violet + lime accents, near-black ink panels, oversized display type, floating product collage, fixed icon rail, product carousel, animated stats, and a dark editorial quote/CTA block — while keeping every Sandia company detail and every working feature.

### 1.2 How the build maps to the brief

| Brief requirement | What the prototype delivers |
|---|---|
| Premium, modern technology aesthetic | Nexora-inspired lavender/violet/lime/ink tokenized palette, Space Grotesk display type + Inter body, lime pill CTAs with rotating arrow circles, glass surfaces, layered shadows, floating product collage on a violet disc |
| Keep the company details | Sandia name and angular logo, Albuquerque address, phone `(505) 555-0147`, hours, "local since 1997", shipping to all 50 states, custom workstations/servers/storage/gaming/business PCs, NDAA/TAA, PO/Net-30, 3-year warranty, lifetime support, all 16 systems, 6 industries, testimonials, team and timeline |
| Look like an established nationwide supplier | "Local since 1997 · shipping to all 50 states" utility bar, trust marquee of buyer segments, count-up stats (28+ yrs, 15,000+ systems, 50 states, 4.9/5), named specialists, documented process, timeline since 1997, procurement language (PO, Net-30, NDAA/TAA, cooperative contracts) |
| Attract serious commercial & institutional customers | Industry pages with compliance chips and recommended systems, quote form with procurement checkboxes and organization type, volume pricing logic, lease estimates, warranty tiers, government/education mega-menu callout |
| Perfectly responsive navigation & mega menus | Desktop hover/click mega menus; tablet/phone slide-in drawer with accordions; sticky bottom CTA bar; verified zero horizontal overflow at 360–1440px |
| Easy-to-use buttons & quote request forms | 44–48px tap targets, 3-step quote form with inline validation, auto-saved draft, success state with reference number |
| Properly sized images & typography | Fluid type scale per breakpoint, `text-wrap: balance`, optimized 1200px JPEGs, aspect-ratio-locked image boxes |
| No overlapping text, broken layouts, horizontal scrolling | Structural fixes (`min-w-0` on grid items, scroll containers for chip strips, fluid clamped headline type) + automated audit across 104 viewport/route combinations |
| Fast loading & smooth performance | Single-file build (~866 KB gzipped incl. nine optimized images), no external JS, CSS-only animations, lazy-loaded images |
| Smooth animations & a cool interface | Staggered line-reveal headline, mouse-parallax floating collage, breathing glows, rotating orbit, pulsing ring, marquee, count-up stats, swipeable autoplay carousel, scroll-spy icon rail, lime reading-progress line, shimmer on dark panels, hover tilts/zooms, route fades, all reduced-motion aware |
| Homepage concept within 48–72 hours | This entire prototype is the "concept", already interactive on real devices |

### 1.3 Site map

```
#/                      Home
#/systems               Catalog (tabs · search · sort · filters · compare)
#/systems?category=…    Category views (workstations, servers, storage, gaming, business)
#/systems/:slug         16 system detail pages
#/configurator          Build-to-order configurator (live pricing, volume discounts)
#/industries            Industry overview
#/industries/:slug      Business · Government · Education · Engineering · Creative · AI & Research
#/about                 Story, values, process, timeline, leadership, partners
#/support               Contact cards, warranty tiers, searchable FAQ
#/quote                 3-step quote request (+ attached quote list)
#/contact               Contact cards, message form, map
```

### 1.4 Interactive features (complete list)

**Navigation**
- Glass lavender sticky header with dark utility strip, scroll shadow, pill "Request a Quote" CTA with lime arrow circle, and a lime→violet reading-progress line.
- **Fixed section rail** (desktop): five icons, sliding dark active pill, scroll-spy tracking, tooltips and smooth-scroll jumps.
- Mega menus (Systems, Industries) — hover for mouse, tap for touch, Escape/outside-click/route-change to close, ARIA wired.
- Mobile drawer with accordions, focus trap, scroll lock, phone CTA.
- Dark mobile bottom CTA bar (Call Sales / lime Request a Quote), auto-hidden where pages have their own actions.
- Quote-list badge, back-to-top, skip link, per-route document titles, route-change fade.

**Commerce-style flows (without a database)**
- Quote list: add from cards, detail pages, compare table or configurator; quantity controls; persisted in `localStorage`.
- Product catalog: URL-synced category tabs, live search, 4 sort modes, 3 filter groups, result count, empty state.
- Compare: up to 3 systems, sticky bar, responsive spec table, add-to-quote per column.
- Configurator: 5 platforms × 9 component groups (~80 options), price deltas, recommended defaults, volume discounts (3/5/8%), lead-time estimate, lease estimate, copy summary, reset, deep links (`?base=server&from=rs-2200`), persistence.
- Quote form: stepper, per-step validation, procurement options, draft persistence, industry pre-fill, simulated submit → reference number.
- Contact form and newsletter: validation + success feedback via toasts.

**Content & trust**
- Animated three-line hero headline with gradient word, floating workstation/laptop/server/mini-PC collage, NDAA and 72-hour burn-in chips.
- Trust marquee, dark four-feature panel, "top picks" swipeable carousel with one-tap add-to-quote, count-up stats band.
- Outcome-led messaging (mirrors Sandia's real "71% faster 4K exports / 65% faster CAD" copy).
- Six industry pages with challenges → solutions → compliance → recommended systems.
- Rotating testimonial block with purple-lit VR editorial photo and "Join the Sandia family" CTA.
- Searchable FAQ with category chips; warranty tiers; timeline; team; partner wall.

**Quality**
- TypeScript strict mode, zero type errors.
- Headless-Chrome audits: 104 viewport/route checks with no overflow and no JS errors; 12 homepage interaction checks (headline fit, hero CTA, carousel, add-to-quote, count-up, rail, testimonial dots, story CTA, drawer) plus a 16-step end-to-end full-site regression test (search, sort, quote list, compare, configurator pricing & discounts, form validation & submission, FAQ, mega menu, anchors, mobile drawer).

### 1.5 Design direction notes (Nexora template → Sandia)
- **Kept from the template:** floating left icon rail, light lavender canvas with a violet disc, oversized three-line uppercase headline with one colored line, lime pill CTA with a dark circular arrow, light "next-gen" eyebrow chip, dark rounded "built for the future" feature panel with lime icons and dividers, "explore our top picks" carousel with lime `+` buttons, violet stats band, and the dark editorial photo + quote + CTA-card block.
- **Adapted to Sandia:** the collage shows a workstation tower, laptop, rack server and mini PC instead of consumer gadgets; carousel items are real Sandia systems with real starting prices; NDAA/TAA, 1997 heritage, 50-state shipping and procurement language replace generic gadget copy; the dark panel covers precision design, benchmarked performance, fleet integration and compliance; the CTA says "Join the Sandia family" and routes to the quote form.
- **Company details preserved everywhere:** `src/data/content.ts` (phone, address, hours, emails, founded year, stats) and `src/data/products.ts` (16 systems with full specs) feed both the homepage and all interior pages, so nothing was lost in the visual refresh.
- The lime/violet/ink tokens are aliases over the original `brand-blue` / `brand-red` / `brand-navy` names, which is why all ten page templates restyled consistently without rewriting each page.

### 1.6 What's intentionally *not* in scope (and how to add it)
- Real checkout/payments (Sandia sells by quote — the quote list replaces a cart on purpose).
- CMS editing — in a WordPress delivery, every section maps to a block/ACF group; this prototype is the approved design + behavior spec.
- Backend for forms — swap the simulated `submit()` for a webhook/CRM endpoint.

---

## Part 2 — How to sell this web app

### 2.1 Positioning
Don't sell "a website". Sell **"a quote-generating sales system for a custom-hardware supplier"**. Sandia's revenue comes from quotes, not page views. Every feature in the prototype pushes toward a quote: configurator → quote, compare → quote, industry page → industry-specific quote, mobile bottom bar → quote.

One-sentence pitch:
> "I turn custom-PC and system-integrator websites into quote machines — premium design, mobile-first, with a live configurator that pre-qualifies buyers before your sales team ever picks up the phone."

### 2.2 Who you're selling to (inside the account)
- **Owner / GM** (cares about: looking as big as national competitors, more and better-qualified quotes).
- **Sales lead** (cares about: fewer tire-kickers, build details captured up front, procurement fields already filled).
- **Whoever runs WordPress today** (cares about: can I edit it, will it break, is it fast).

### 2.3 Packaging & pricing (suggested)

| Package | Scope | Suggested price (US) |
|---|---|---|
| **Concept Sprint** (what this prototype is) | Homepage + 1 category + quote form concept delivered in 72 hours, on real devices | $1,500–$3,000 fixed, credited toward the build |
| **Full Redesign** | All pages in this prototype, implemented in WordPress (custom theme or Elementor/Gutenberg), forms wired to CRM/email, SEO migration, performance pass | $8,000–$18,000 fixed |
| **Configurator Add-on** | Live-pricing configurator with admin-editable options, build → quote handoff | $4,000–$9,000 |
| **Care & Conversion Retainer** | Updates, monitoring, monthly CRO experiments, new product pages | $500–$1,500 / month |

Anchor on business outcomes: a custom workstation averages $3–7k and a server/storage project $8–25k. If the site produces **two** extra qualified quotes per month that close, the redesign pays for itself in the first quarter.

### 2.4 Demo script (10 minutes, on the prospect's phone first)
1. **Open it on their phone** — "Notice: no pinching, no horizontal scroll, call and quote are always under your thumb." Then show the desktop hero: the line-reveal headline, mouse-parallax floating systems and the scroll-spy rail ("this is the high-end first impression your brand should make in 3 seconds").
2. **Mega menu / drawer** — "Every system family and every industry is two taps away."
3. **Configurator** — build a workstation, bump quantity to 10, show the volume discount and lead-time estimate updating live. "Buyers self-qualify. Your team receives a spec, not a vague 'how much for a computer?'"
4. **Compare** — pick three servers, open the comparison. "This is the conversation your sales reps have on the phone — now it happens at 10 pm when the IT director is browsing."
5. **Government page** — point at NDAA 889 / TAA / cooperative contract chips and the pre-filled quote. "Procurement officers look for these words in the first ten seconds."
6. **Quote form** — submit, show the reference number. "This posts to your CRM or inbox with every field your sales team needs."
7. Close with the **timeline**: concept (done) → full build 3–4 weeks → launch checklist.

### 2.5 Objection handling

| Objection | Response |
|---|---|
| "We need WordPress, this is React." | "Correct — this is the approved design and behavior spec, built fast so you could test it on real devices. The production build is a WordPress theme with the same layouts; the configurator can be a custom block or a lightweight embedded app." |
| "Can we edit it ourselves?" | "Yes — products, industries, FAQs and testimonials become editable post types/ACF fields. The content model is already defined (see `src/data/types.ts`)." |
| "What about SEO?" | "Server-rendered WordPress pages, migrated URLs with 301s, schema for Products/Organization/FAQ, Core Web Vitals pass. The design is already lightweight." |
| "Timeline?" | "Homepage concept is in your hands now. Full build 3–4 weeks with twice-weekly updates and a shared checklist." |
| "Price is high." | "Compare it to one lost server quote. And we can phase: redesign first, configurator second." |

### 2.6 Upsell paths
- Configurator with admin-managed pricing → ties into their actual component costs.
- Industry landing pages + Google Ads for "NDAA compliant workstation", "CAD workstation builder", "custom server builder".
- Quote-to-CRM automation (HubSpot/Zoho/Pipedrive), Net-30 credit application flow, customer portal for order status.
- Case-study production (video + page) for each vertical.

---

## Part 3 — Finding and reaching your ICP on LinkedIn

### 3.1 Ideal Customer Profile

**Primary ICP — regional custom-hardware builders & system integrators**
- Custom PC / workstation builders, server & storage integrators, VARs, IT hardware resellers, MSPs that also sell hardware.
- 5–60 employees, $2M–$30M revenue, founded 10+ years ago (brand equity but dated web presence).
- Sell to B2B / public sector (government, education, engineering, media). Mention PO, Net-30, NDAA/TAA, GSA, E-rate, cooperative contracts on their site.
- Website symptoms: WordPress theme from 2015–2019, no configurator or a clunky one, no mobile CTA, slow pages, stock photos, "Request quote" buried in a contact form.

**Secondary ICPs (same build, light re-skin)**
- Industrial / rugged computer manufacturers, AV & broadcast integrators, lab-equipment resellers, 3D-printer resellers, CNC/machine tool dealers — anyone who sells configurable, quote-based technical products.

**Buyer personas**
- Owner / Founder / President / General Manager (final say).
- VP or Director of Sales / Business Development (feels the lead-quality pain).
- Marketing Manager (often a one-person team; wants a win).
- IT / Web Manager (gatekeeper; speak their language about WordPress, speed, editability).

### 3.2 Where they are on LinkedIn — search recipes

**Boolean people search (free LinkedIn)**
```
("custom PC" OR "custom computers" OR "workstations" OR "system integrator" OR "server solutions" OR "IT hardware" OR "computer systems") AND (owner OR founder OR president OR "general manager" OR "VP sales" OR "director of sales" OR marketing)
```
Add location filters per region (start with the US Southwest to make the Sandia case study hyper-relevant, then expand nationally).

**Company search**
- Industry filter: *Computer Hardware Manufacturing*, *IT Services and IT Consulting*, *Computers and Electronics Manufacturing*, *Retail Office Equipment*.
- Headcount: 11–50 and 51–200.
- Keywords in company search: `custom workstations`, `built to order`, `custom servers`, `NDAA compliant`, `rugged computers`, `system builder`, `gaming PC builder`.

**Sales Navigator filters (if you have it)**
- Company headcount 11–200 · Industry as above · Seniority: Owner, CXO, VP, Director · Function: Sales, Marketing, Business Development · Geography: United States · "Posted on LinkedIn in past 30 days" (active = replies).
- Spotlight: *Changed jobs in last 90 days* (new sales/marketing leaders want quick wins).

**Signal-based prospecting (highest reply rates)**
- Companies posting about **new product lines, new GPU generations, trade shows (NAB, SC, AUSA, ISTE, SOLIDWORKS World), hiring sales reps, GSA/contract awards**. A new product line with an old website is the perfect trigger.
- Job posts for "WordPress designer", "web designer", "marketing coordinator" at hardware companies (exactly how the Sandia brief surfaced).
- Followers/commenters on **Puget Systems, Velocity Micro, Origin PC, BOXX, Exxact, Thinkmate, Silicon Mechanics, Falcon Northwest** posts — their regional competitors watch them.
- Members of groups: *Custom PC Builders*, *System Integrators Network*, *IT Resellers & VARs*, *WordPress Developers & Designers* (for partner referrals).
- Hashtags: `#workstation #customPC #systemintegrator #ITreseller #VAR #NDAA #TAA #MSP #hardware`.

**Outside LinkedIn (same ICP)**
- Upwork/Freelancer briefs mentioning "custom PC", "workstations", "configurator", "WooCommerce product builder".
- Reddit: r/sysadmin and r/buildapc vendor mentions; r/smallbusiness.
- Directories: Intel Technology Provider / AMD partner locators, NVIDIA partner network, Supermicro reseller lists, GSA Advantage vendor lists, state cooperative-contract vendor lists (search "custom computers" within them).

### 3.3 Qualification checklist (30 seconds per account)
- [ ] Sells configurable, quote-based hardware (not just retail boxes)?
- [ ] Website on WordPress and visibly dated or weak on mobile? (Check with your phone + PageSpeed.)
- [ ] B2B / public-sector language present (PO, Net-30, NDAA, GSA, education)?
- [ ] 10+ years in business (brand worth investing in)?
- [ ] Decision maker reachable (owner/VP active on LinkedIn)?
Four of five = reach out today.

### 3.4 Profile prep before outreach
- Headline: *"Websites that turn custom-hardware browsers into qualified quotes — mobile-first WordPress + live configurators for PC builders, integrators & VARs."*
- Featured section: this prototype (hosted single HTML file), a 60-second phone-screen video of the configurator → quote flow, and a before/after mobile comparison image.
- Pin a post: "Teardown: 5 things custom PC builders' websites get wrong on mobile (with fixes)."

### 3.5 Outreach messages

**Rule of thumb:** no attachments or links in the first message, one specific observation about *their* site, one clear ask. Personalize the `[brackets]`.

**A. Connection request (≤300 characters)**
> Hi [First name] — I design quote-focused websites for custom PC/workstation builders. Checked [Company] on my phone and noticed the quote button hides below the fold. I just rebuilt a 1997-founded builder's site around a live configurator. Happy to share what moved the needle?

**B. First message after connecting (value first, soft ask)**
> Thanks for connecting, [First name].
>
> Quick context: I just finished a mobile-first redesign concept for Sandia Computers — a custom workstation/server builder (est. 1997) that serves government, education and engineering buyers nationwide. The core of it is a **live-pricing configurator that hands a fully specified build to the sales team**, plus an NDAA/TAA-focused government page.
>
> Looking at [Company]'s site, two things jumped out:
> 1. [Specific observation — e.g., "Request a Quote" is a generic contact form with no system/quantity fields.]
> 2. [Specific mobile observation — e.g., the product table overflows the screen on a phone.]
>
> If it's useful, I can send a 60-second screen recording of the configurator → quote flow on a phone. Worth a look?

**C. Follow-up #1 (3–4 days later, lead with insight)**
> [First name], one stat from the project in case it's helpful: when we moved the quote CTA into a sticky bottom bar on mobile and pre-filled procurement fields (PO/Net-30, NDAA docs, org type), the form went from 9 fields of friction to a 3-step flow buyers actually finish. Happy to sketch what that would look like on [Company]'s product pages — no charge, 20 minutes.

**D. Follow-up #2 (one week later, direct)**
> Would it be helpful if I put together a free homepage concept for [Company] — on your brand colors, viewable on your phone — within 72 hours? If it's not clearly better than what you have, no hard feelings and you keep the mock-ups.

**E. Break-up (two weeks later)**
> Closing the loop, [First name]. If a mobile-first redesign or configurator comes up later this year, I'm easy to find. In the meantime, here's the teardown post on what custom-hardware sites get wrong on mobile — might be useful for whoever handles the site: [link]. All the best with [recent company news/product line].

**F. InMail / cold email version (subject lines)**
- `Your quote button on a phone`
- `[Company] vs. Puget Systems on mobile (screenshots)`
- `Configurator → quote in 60 seconds`
- `A 1997-founded builder's new site (built in 72 hours)`

Body = message B, trimmed to 120 words, with one screenshot of their site on a phone next to the prototype.

**G. Comment-first approach (for active posters)**
Leave a substantive comment on two of their posts in the same week (e.g., on a new-product post: "Nice spec. Are you seeing buyers configure this themselves on your site or mostly by phone?"). Then send request A referencing the post.

**H. Upwork / job-post proposal (for briefs like Sandia's)**
> Subject: Homepage concept in 72 hours — see it on your phone first
>
> Hi [Name], your brief reads like the Sandia Computers project I just completed: premium look, red/blue/white/gray brand, mobile and tablet treated as first-class, quote forms that convert, fast turnaround.
>
> Here is the live prototype: [link]. Open it on your phone — check the mega menu, the configurator and the 3-step quote form.
>
> Proposed plan:
> • Day 1–3: Homepage + one category page concept on your brand assets, reviewed on real devices.
> • Week 1–3: Full build in WordPress (theme/Elementor/Gutenberg — your call), forms to your CRM/email, SEO migration, performance pass.
> • Week 4: QA on 8 viewports, launch checklist, handover video.
>
> Daily progress notes, 24-hour revision turnaround, fixed price. Available to start today. Fifteen-minute call to confirm scope?

### 3.6 Cadence & targets
- Daily: 15 new connection requests (A), 10 follow-ups (C/D), 5 meaningful comments (G), 1 piece of content every 2–3 days.
- Weekly: review acceptance rate (target >35%), reply rate (>15%), calls booked (2–4).
- Track in a simple sheet/CRM: company, persona, website score (1–5), trigger event, last touch, next step.

### 3.7 Content that attracts the ICP (inbound)
- "Mobile teardown" carousels of hardware-builder sites (anonymized unless they're your client).
- Short screen-recordings: configurator → quote flow; compare table on a phone.
- Posts translating conversion ideas into their language: lead quality, quote volume, NDAA page as a procurement magnet, Net-30 friction.
- Case-study format: *Before (2016 theme, 11 taps to a quote) → After (3 taps, configurator, 72-hour concept)*.

---

## Appendix — Handy facts about this prototype for proposals

- Pages: 10 templates, 16 system detail pages, 6 industry pages.
- Configurator: 5 platforms, 9 component groups, ~80 options, volume pricing tiers at 5/10/25 units.
- Visual direction: Nexora-inspired lavender / violet / lime / ink system with Space Grotesk + Inter, nine optimized inlined product images and 12+ CSS/observer-driven motion patterns.
- Verified: 104 viewport/route layout checks (360–1440px), 12 homepage + 16 full-site interaction checks, zero console errors.
- Output: a single `dist/index.html` (~1.5 MB, ~866 KB gzipped) with all images inlined — can be emailed, hosted anywhere, or opened offline on a tablet in a sales meeting.
