import type { Faq, Industry, Testimonial } from "./types";

export const company = {
  name: "Sandia Computers",
  phone: "(505) 555-0147",
  phoneHref: "tel:+15055550147",
  salesEmail: "sales@sandiacomputer.com",
  supportEmail: "support@sandiacomputer.com",
  address: "2301 Yale Blvd SE, Suite C",
  city: "Albuquerque, NM 87106",
  hours: "Mon–Fri 8:00 AM – 5:30 PM MT",
  founded: 1997,
};

export const stats = [
  { value: "28+", label: "Years building systems" },
  { value: "15,000+", label: "Systems delivered" },
  { value: "50", label: "States shipped to" },
  { value: "4.9/5", label: "Customer rating" },
];

export const outcomes = [
  {
    title: "71% faster 4K exports",
    workload: "Video & Photo",
    body: "Cut render times from 12 to 3.5 minutes per project and reclaim 15+ hours a week across photo, video and live production.",
  },
  {
    title: "3× more daily iterations",
    workload: "3D & Animation",
    body: "Trim 45-minute scene exports by 67%, eliminate viewport stutter and push more design revisions every day.",
  },
  {
    title: "65% faster CAD",
    workload: "Engineering & CAD",
    body: "Slash regeneration lag, stop crashes on complex assemblies and ship projects up to 40% sooner.",
  },
  {
    title: "2× data throughput",
    workload: "AI & Research",
    body: "Process massive datasets 55% faster and run twice the simulations—NDAA-compliant and always on.",
  },
  {
    title: "3× faster model generation",
    workload: "GIS & Photogrammetry",
    body: "Turn 6-hour photogrammetry jobs into under 2 and convert aerial imagery into usable 3D maps 60% quicker.",
  },
  {
    title: "5× faster backups",
    workload: "Servers & Storage",
    body: "Eliminate bottlenecks, run backups 5× faster and keep operations running with 99.9% uptime targets.",
  },
];

export const whySandia = [
  {
    title: "Built to order, not to inventory",
    body: "Every system is specified around your workload, then assembled by hand in Albuquerque using components we would buy ourselves.",
  },
  {
    title: "Tested like it matters",
    body: "72-hour burn-in, thermal validation and application benchmarks—documented and shipped with your system.",
  },
  {
    title: "US-based specialists",
    body: "Talk to the people who built your machine. No scripts, no offshore queues, no runaround.",
  },
  {
    title: "Procurement friendly",
    body: "Purchase orders, Net-30 terms, W-9s, sole-source letters and cooperative contract pricing for public agencies.",
  },
  {
    title: "Nationwide delivery",
    body: "Custom foam, double-boxed, insured and tracked to all 50 states—with white-glove rack installation options.",
  },
  {
    title: "Supported for life",
    body: "3-year parts & labor standard, lifetime technical support, and upgrade paths that protect your investment.",
  },
];

export const process = [
  {
    step: "01",
    title: "Consult",
    body: "A specialist learns your applications, data sizes, deadlines and budget—by phone, video or email.",
  },
  {
    step: "02",
    title: "Specify",
    body: "You receive a written configuration with benchmarks, alternatives and a formal quote within one business day.",
  },
  {
    step: "03",
    title: "Build & test",
    body: "Hand assembly, firmware baselines, OS imaging and a 72-hour burn-in with a signed QA checklist.",
  },
  {
    step: "04",
    title: "Deliver & support",
    body: "Insured nationwide shipping, optional on-site setup, and direct access to the team that built it.",
  },
];

export const industries: Industry[] = [
  {
    slug: "business",
    name: "Business & Enterprise",
    shortName: "Business",
    headline: "Standardized fleets and reliable infrastructure for growing companies.",
    description:
      "From ten desks to a thousand, we deliver consistent, imaged systems and the servers and storage behind them—with one point of contact.",
    challenges: [
      "Inconsistent hardware makes imaging and support expensive",
      "Consumer-grade PCs fail early and lack manageability",
      "Aging on-prem servers slow line-of-business applications",
    ],
    solutions: [
      "Stable-platform desktops with 12-month configuration locks",
      "Custom OS images, asset tags and BIOS settings applied before shipping",
      "Virtualization hosts and backup appliances sized for your growth",
    ],
    compliance: ["Net-30 terms", "Purchase orders", "Volume pricing", "Lifecycle planning"],
    recommended: ["office-sff-200", "office-mt-300", "ts-500", "archive-bk-8"],
    stat: { value: "40%", label: "lower support tickets with standardized fleets" },
  },
  {
    slug: "government",
    name: "Government & Defense",
    shortName: "Government",
    headline: "Compliant, documented systems for federal, state, local and tribal agencies.",
    description:
      "We understand NDAA Section 889, TAA sourcing, and the paperwork that comes with public procurement. Systems ship with full component traceability.",
    challenges: [
      "Sourcing restrictions limit acceptable components",
      "Procurement requires detailed documentation and sole-source justification",
      "Secure environments need hardened, auditable configurations",
    ],
    solutions: [
      "NDAA/TAA-compliant component selection with certificates of conformance",
      "Sole-source letters, W-9s and cooperative contract pricing",
      "TPM 2.0, secure boot, BitLocker and removable-drive configurations",
    ],
    compliance: ["NDAA 889 compliant", "TAA sourcing", "Cooperative contracts", "SAM registered"],
    recommended: ["compute-ai-x", "rs-2200", "vault-ns-24", "office-sff-200"],
    stat: { value: "100%", label: "component traceability on compliant builds" },
  },
  {
    slug: "education",
    name: "Education",
    shortName: "Education",
    headline: "Labs, classrooms and research computing that stretch every budget dollar.",
    description:
      "K-12 districts, community colleges and universities rely on us for durable lab desktops, esports systems and the research servers behind grant-funded work.",
    challenges: [
      "Budget cycles demand predictable multi-year pricing",
      "Labs need durable systems that survive heavy student use",
      "Researchers need GPU compute without data-center overhead",
    ],
    solutions: [
      "Multi-year quotes locked for budget planning and board approval",
      "Lockable chassis, imaging and asset tagging for every lab seat",
      "Deskside AI workstations and small clusters for research groups",
    ],
    compliance: ["Education pricing", "E-rate friendly", "Purchase orders", "Summer deployment scheduling"],
    recommended: ["office-sff-200", "apex-g5", "compute-ai-x", "vault-ns-12"],
    stat: { value: "1,200+", label: "lab seats deployed in a single summer" },
  },
  {
    slug: "engineering",
    name: "Engineering & CAD",
    shortName: "Engineering",
    headline: "ISV-certified workstations that keep large assemblies responsive.",
    description:
      "Mechanical, civil, structural and architectural teams get systems tuned for SolidWorks, Revit, Civil 3D, Inventor, ANSYS and point-cloud workflows.",
    challenges: [
      "Large assemblies and point clouds overwhelm general-purpose PCs",
      "Driver instability causes crashes and lost work",
      "Simulation jobs tie up workstations for hours",
    ],
    solutions: [
      "High-clock processors with certified professional graphics",
      "ISV-validated driver stacks and firmware baselines",
      "Dedicated simulation nodes so designers keep designing",
    ],
    compliance: ["ISV certified", "Benchmark reports", "Memory & GPU upgrade paths", "Lifetime support"],
    recommended: ["crest-w5", "peak-w7", "vault-ns-12", "rs-1100"],
    stat: { value: "65%", label: "faster regeneration on complex CAD models" },
  },
  {
    slug: "creative",
    name: "Creative & Media",
    shortName: "Creative",
    headline: "Quiet, color-accurate systems for editors, colorists and motion designers.",
    description:
      "Studios, agencies and independent creators choose Sandia for fast exports, smooth timelines and shared storage that keeps teams in sync.",
    challenges: [
      "Long exports and dropped frames slow delivery",
      "Noisy machines don't belong in edit suites",
      "Teams need shared, fast media storage",
    ],
    solutions: [
      "Hardware encode/decode tuned for Premiere, Resolve and After Effects",
      "Studio-quiet acoustics and HDR-ready output",
      "10GbE NAS systems pre-configured for collaborative editing",
    ],
    compliance: ["Thunderbolt 4", "HDR workflows", "10GbE storage", "Benchmark reports"],
    recommended: ["studio-w3", "peak-w7", "vault-ns-12", "apex-g9"],
    stat: { value: "71%", label: "faster 4K exports vs. typical creator PCs" },
  },
  {
    slug: "ai-research",
    name: "AI, Research & Data Science",
    shortName: "AI & Research",
    headline: "Deskside GPU power and compact clusters for labs and ML teams.",
    description:
      "National labs, universities and startups use our multi-GPU workstations and compute nodes to train, fine-tune and analyze without waiting in a queue.",
    challenges: [
      "Shared cluster queues slow experimentation",
      "Datasets outgrow local storage and networks",
      "Compliance requirements restrict cloud usage",
    ],
    solutions: [
      "Multi-GPU workstations with pre-installed ML frameworks",
      "NVMe dataset pools and 25/100GbE networking",
      "On-premises, NDAA-compliant systems that keep data in your building",
    ],
    compliance: ["NDAA compliant", "CUDA / ROCm ready", "IPMI remote management", "Rackable towers"],
    recommended: ["compute-ai-x", "rs-1100", "vault-ns-24", "peak-w7"],
    stat: { value: "3×", label: "faster model generation on local GPUs" },
  },
];

export const industryMap = Object.fromEntries(industries.map((i) => [i.slug, i])) as Record<string, Industry>;

export const testimonials: Testimonial[] = [
  {
    quote:
      "Sandia specified a fleet of forty workstations for our civil group, delivered them imaged and tagged, and our regen times on large corridor models dropped by more than half. It's the easiest hardware rollout we've ever done.",
    name: "Marisol Ortega, PE",
    title: "Director of Engineering Technology",
    org: "Rio Grande Civil Partners",
    industry: "Engineering",
  },
  {
    quote:
      "The NDAA documentation was complete the first time, the servers arrived racked and labeled, and support actually answers the phone. That is rare.",
    name: "David Chen",
    title: "IT Program Manager",
    org: "County Technology Services",
    industry: "Government",
  },
  {
    quote:
      "We replaced a rendering farm with two Peak W7 workstations and a Vault NAS. Exports that took all afternoon now finish before lunch—and the edit suite is finally quiet.",
    name: "Priya Raman",
    title: "Post-Production Supervisor",
    org: "Northline Studios",
    industry: "Creative",
  },
  {
    quote:
      "Our research group needed GPU capacity without a data-center project. Sandia delivered an AI-X system with the full software stack ready to go. Students were training models the same day it arrived.",
    name: "Dr. Alan Whitfield",
    title: "Associate Professor, Computer Science",
    org: "Southwest State University",
    industry: "Education",
  },
  {
    quote:
      "Twelve hundred lab desktops over one summer, all identical, all on time. The multi-year pricing made board approval simple.",
    name: "Teresa Gallegos",
    title: "Director of Technology",
    org: "Mesa Valley Public Schools",
    industry: "Education",
  },
];

export const faqs: Faq[] = [
  {
    category: "Ordering",
    question: "How does the build-to-order process work?",
    answer:
      "Start with a quote request or the online configurator. A specialist reviews your workload and returns a written configuration with pricing within one business day. Once approved, we build, test and ship—typically within 3–10 business days depending on the system.",
  },
  {
    category: "Ordering",
    question: "Do you accept purchase orders and offer Net-30 terms?",
    answer:
      "Yes. We accept purchase orders from businesses, government agencies and educational institutions, and offer Net-30 terms upon credit approval. We can also provide W-9s, sole-source letters and cooperative contract pricing.",
  },
  {
    category: "Ordering",
    question: "Can I provide my own parts or specifications?",
    answer:
      "Absolutely. Many customers arrive with a bill of materials from an ISV or IT department. We'll validate compatibility, suggest improvements where helpful, and build exactly what you need.",
  },
  {
    category: "Shipping",
    question: "Do you ship nationwide?",
    answer:
      "We ship to all 50 states. Systems are packed in custom foam, double-boxed, insured and tracked. Rack servers can ship pre-racked in shock-isolated crates, and white-glove on-site installation is available.",
  },
  {
    category: "Shipping",
    question: "What are typical lead times?",
    answer:
      "Business desktops ship in 2–4 business days, workstations and gaming systems in 3–7, and servers or storage in 5–10. Rush builds are available—tell us your deadline and we'll confirm what's possible.",
  },
  {
    category: "Warranty & Support",
    question: "What warranty is included?",
    answer:
      "Every system includes a 3-year parts and labor warranty and lifetime technical support from our US-based team. Next-business-day on-site service and advance replacement options are available for servers and storage.",
  },
  {
    category: "Warranty & Support",
    question: "What happens if a component fails?",
    answer:
      "Call or email support and a technician will troubleshoot with you directly. If a part needs replacement we ship it immediately—often before the failed part is returned—so your downtime is minimal.",
  },
  {
    category: "Warranty & Support",
    question: "Can you upgrade a system you built years ago?",
    answer:
      "Yes. We keep a configuration record for every system we ship, so we can recommend compatible memory, storage and GPU upgrades—and install them if you prefer.",
  },
  {
    category: "Government & Education",
    question: "Are your systems NDAA and TAA compliant?",
    answer:
      "We offer NDAA Section 889 and TAA-compliant configurations across workstations, servers and storage, with certificates of conformance and complete component traceability.",
  },
  {
    category: "Government & Education",
    question: "Do you offer education pricing and multi-year quotes?",
    answer:
      "Yes. K-12 districts, colleges and universities receive education pricing, and we can lock quotes for multi-year budget cycles and schedule summer deployments.",
  },
];

export const timeline = [
  { year: "1997", title: "Founded in Albuquerque", body: "Opened as a local custom PC shop serving engineers and students near the university." },
  { year: "2003", title: "First agency contracts", body: "Began supplying imaged desktop fleets to state and county agencies across New Mexico." },
  { year: "2010", title: "Servers & storage division", body: "Added rack servers and NAS systems for labs, studios and small businesses." },
  { year: "2016", title: "Nationwide shipping", body: "Custom packaging and insured freight programs extended delivery to all 50 states." },
  { year: "2021", title: "NDAA-compliant line", body: "Launched fully documented compliant configurations for defense and federal customers." },
  { year: "2024", title: "AI & HPC systems", body: "Introduced multi-GPU workstations and compute nodes for research and machine learning teams." },
];

export const team = [
  { name: "Ray Montoya", title: "Founder & Principal Engineer", initials: "RM" },
  { name: "Elena Baca", title: "Director of Sales & Procurement", initials: "EB" },
  { name: "Jordan Pike", title: "Lead Systems Architect", initials: "JP" },
  { name: "Nina Tsosie", title: "Support & Logistics Manager", initials: "NT" },
];

export const partners = ["Intel", "AMD", "NVIDIA", "Microsoft", "Supermicro", "Samsung", "Seagate", "TrueNAS"];
