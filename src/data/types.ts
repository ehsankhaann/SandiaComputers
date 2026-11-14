export type CategorySlug = "workstations" | "servers" | "storage" | "gaming" | "business";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: string;
  startingAt: number;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  tagline: string;
  description: string;
  startingPrice: number;
  image: string;
  badges: string[];
  formFactor: string;
  leadTime: string;
  warranty: string;
  specs: Spec[];
  highlights: string[];
  useCases: string[];
  configuratorBase: BaseSystemId;
}

export interface Industry {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  challenges: string[];
  solutions: string[];
  compliance: string[];
  recommended: string[];
  stat: { value: string; label: string };
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  org: string;
  industry: string;
}

export interface Faq {
  category: string;
  question: string;
  answer: string;
}

export type BaseSystemId = "workstation" | "gaming" | "server" | "storage" | "business";

export interface BaseSystem {
  id: BaseSystemId;
  name: string;
  description: string;
  basePrice: number;
  leadDays: number;
}

export interface ComponentOption {
  id: string;
  name: string;
  note?: string;
  price: number;
  systems: BaseSystemId[];
  recommended?: boolean;
}

export interface ComponentGroup {
  id: string;
  name: string;
  description: string;
  multi?: boolean;
  options: ComponentOption[];
}
