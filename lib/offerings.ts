import { SERVICES, type ServiceSlug } from "@/lib/services";

export type ServiceValue = ServiceSlug | "multiple";

export const SERVICE_OPTIONS: { value: ServiceValue; label: string }[] = [
  ...SERVICES.map((s) => ({ value: s.slug, label: s.name })),
  { value: "multiple", label: "More than one" },
];

/** The form's "Specifics" chips are the packages on each service page. */
export const SERVICE_NEEDS: Record<ServiceValue, string[]> = {
  ...(Object.fromEntries(
    SERVICES.map((s) => [s.slug, s.packages.map((p) => p.name)]),
  ) as Record<ServiceSlug, string[]>),
  multiple: SERVICES.flatMap((s) => s.packages.map((p) => p.name)),
};

export const TIMELINE_OPTIONS = [
  "ASAP",
  "1–2 weeks",
  "About a month",
  "Flexible",
] as const;

export const BUDGET_OPTIONS = [
  "Under $500",
  "$500–1.5k",
  "$1.5k–5k",
  "$5k+",
  "Not sure yet",
] as const;
