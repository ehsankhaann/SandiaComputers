import {
  BrainCircuit,
  Briefcase,
  Building2,
  Clapperboard,
  Database,
  DraftingCompass,
  Gamepad2,
  GraduationCap,
  Landmark,
  MonitorCog,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { CategorySlug } from "@/data/types";

export const categoryIcons: Record<CategorySlug, LucideIcon> = {
  workstations: MonitorCog,
  servers: Server,
  storage: Database,
  gaming: Gamepad2,
  business: Briefcase,
};

export const industryIcons: Record<string, LucideIcon> = {
  business: Building2,
  government: Landmark,
  education: GraduationCap,
  engineering: DraftingCompass,
  creative: Clapperboard,
  "ai-research": BrainCircuit,
};

export const primaryLinks = [
  { label: "Configurator", to: "/configurator" },
  { label: "About", to: "/about" },
  { label: "Support", to: "/support" },
];
