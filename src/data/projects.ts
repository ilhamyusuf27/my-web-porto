export type ProjectStatus = "completed" | "experimental" | "ongoing";

export type ProjectCategory = "work" | "personal" | "experimental" | "ongoing";

export type ProjectLink = {
  label: string;
  url: string;
  icon?: string;
};

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  period: string;
  role: string;
  type: string;
  summary: string;
  problem?: string;
  contribution?: string[];
  outcomes?: [string, string][];
  stack: string[];
  image?: string;
  accent?: string;
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    id: "tomps-saas",
    title: "Tomps SaaS Customer Portal",
    category: "work",
    status: "completed",
    period: "2023 - 2025",
    role: "Frontend Web Developer",
    type: "SaaS landing page and customer dashboard",
    summary:
      "Public landing page and authenticated customer portal for package purchase, company onboarding, subdomain setup, payment flow, transaction history, invoices, and account management.",
    problem:
      "Tomps needed a marketing surface plus a reliable self-service portal where customers could buy a package, onboard a company, pay, and manage their subscription without manual support.",
    contribution: [
      "Built and maintained the Nuxt landing page with Pinia, Strapi CMS, i18n, and Vitest coverage.",
      "Developed customer-portal flows in Next.js for package selection, onboarding, payment, and transaction states.",
      "Managed dashboard state with Redux Toolkit and built Tailwind-based responsive SaaS UI.",
      "Added React Testing Library tests for dashboard interactions to keep iterations safe.",
    ],
    outcomes: [
      ["Scope", "Landing + authenticated customer portal"],
      ["Stack bridge", "Nuxt marketing to Next.js dashboard"],
    ],
    stack: ["Nuxt", "Pinia", "Vitest", "Strapi CMS", "i18n", "Next.js", "Redux Toolkit", "Tailwind"],
    image: "/projects/tomps-saas/landing-hero.jpg",
    accent: "mauve",
    links: [],
  },
  {
    id: "tomps-project",
    title: "Tomps Project Platform",
    category: "work",
    status: "completed",
    period: "2023 - 2025",
    role: "Frontend Web Developer",
    type: "Multi-tenant project-management SaaS",
    summary:
      "Multi-tenant project-management dashboard integrated with Tomps SaaS, covering candidate projects, project setup, monitoring, maps, stakeholder data, and tenant-specific UI behavior.",
    problem:
      "Each customer tenant needed its own branding, feature flags, and modules while sharing one core project-management engine.",
    contribution: [
      "Integrated Tomps Project with Tomps SaaS so customers reached the correct tenant after package activation.",
      "Maintained multi-tenant behavior for styling, branding, feature flags, and workflow variants.",
      "Fixed bugs across Vue, TypeScript, and Vuex screens for setup, monitoring, maps, imports, and master data.",
      "Kept project-creation flows usable with multi-step forms, validation states, and draft saving.",
    ],
    outcomes: [
      ["Tenancy", "Per-tenant UI and feature flags"],
      ["Views", "Map-based project visibility"],
    ],
    stack: ["Vue", "TypeScript", "Vuex", "Tailwind"],
    image: "/projects/tomps-project/map-dashboard.jpg",
    accent: "blue",
    links: [],
  },
  {
    id: "tomps-building",
    title: "Tomps Building Modules",
    category: "work",
    status: "completed",
    period: "2022 - 2024",
    role: "Frontend Web Developer",
    type: "Property-management platform",
    summary:
      "Property-management dashboard modules for revenue monitoring, billing, complaints, maintenance, facility booking, unit data, and admin workflows.",
    problem:
      "Building operators needed one dashboard to monitor revenue, billing, complaints, maintenance, and facility bookings without context-switching between tools.",
    contribution: [
      "Built and maintained React + TypeScript dashboard interfaces for operational building modules.",
      "Integrated Redux-managed data flows across lists, detail pages, filters, status states, and transactions.",
      "Implemented UI flows for complaints, maintenance progress, billing, and facility booking.",
      "Worked with socket-driven updates for operational status visibility.",
    ],
    outcomes: [
      ["Coverage", "Revenue, billing, complaints, facilities"],
      ["Realtime", "Socket-driven status updates"],
    ],
    stack: ["React", "TypeScript", "Redux", "Socket", "Tailwind", "Jest", "Enzyme"],
    image: "/projects/tomps-building/dashboard.jpg",
    accent: "green",
    links: [],
  },
  {
    id: "bri-box",
    title: "BRI Box Dashboard",
    category: "work",
    status: "completed",
    period: "June 2023",
    role: "Frontend Web Developer",
    type: "Device protection and service reporting",
    summary:
      "Multi-role device-protection dashboard for report monitoring, asset management, SLA tracking, user roles, and operational service workflows.",
    problem:
      "Super admin, partner, reporter, and technician roles each needed tailored access to reports, assets, and SLA status on a shared platform.",
    contribution: [
      "Built React dashboard interfaces using Redux-managed state and Tailwind styling.",
      "Implemented multi-role navigation and screens for super admin, partner, reporter, and technician.",
      "Developed report monitoring with SLA timers, status tabs, filters, pagination, and Excel export.",
      "Supported socket-driven operational updates for report status and notifications.",
    ],
    outcomes: [
      ["Roles", "Four distinct access levels"],
      ["Reporting", "SLA timers and Excel export"],
    ],
    stack: ["React", "Redux", "Tailwind", "Socket"],
    image: "/projects/bri-box/brand-splash.jpg",
    accent: "peach",
    links: [],
  },
  {
    id: "daily-language",
    title: "Daily Language Dashboard",
    category: "work",
    status: "completed",
    period: "September 2023",
    role: "Freelance Frontend Developer",
    type: "Tutoring student management platform",
    summary:
      "Tutoring administration dashboard for maintaining students, learning sections, status controls, and student-management workflows.",
    problem:
      "Tutors needed a clean admin surface to maintain student accounts and learning-section content across reading, listening, writing, and speaking.",
    contribution: [
      "Built React admin dashboard interfaces for managing students and learning-section content.",
      "Implemented Redux-managed state flows for student lists, search, status changes, and admin actions.",
      "Used Material UI components to deliver a clean, familiar admin experience.",
      "Structured sidebar navigation for Reading, Listening, Writing, and Speaking sections.",
    ],
    outcomes: [
      ["Sections", "Reading, listening, writing, speaking"],
      ["UX", "Material UI admin patterns"],
    ],
    stack: ["React", "Redux", "Material UI"],
    image: "/projects/daily-language/student-list.jpg",
    accent: "teal",
    links: [],
  },
  {
    id: "moneyflow",
    title: "MoneyFlow",
    category: "personal",
    status: "ongoing",
    period: "In progress",
    role: "Solo builder (frontend + backend)",
    type: "Personal finance web app",
    summary:
      "A personal finance web app for tracking accounts, income, expenses, and categories with a clear dashboard and a maintainable transaction flow.",
    problem:
      "Personal cash flow needs a clear dashboard and a transaction flow that stays maintainable as rules and categories grow.",
    contribution: [
      "Built the frontend architecture with reusable UI components.",
      "Designed the account, category, and transaction data structure.",
      "Worked on backend API patterns using NestJS, Prisma, and PostgreSQL.",
    ],
    outcomes: [
      ["Focus", "Clear cash-flow dashboard"],
      ["Backend", "NestJS + Prisma + PostgreSQL"],
    ],
    stack: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "TypeScript"],
    accent: "yellow",
    links: [],
  },
  {
    id: "write-mate",
    title: "Write-Mate Add-on",
    category: "experimental",
    status: "experimental",
    period: "Prototype",
    role: "Solo experiment",
    type: "Browser extension experiment",
    summary:
      "A browser add-on experiment for grammar, rewriting, and translation assistance that appears near text inputs.",
    problem:
      "Inline writing assistance usually lives in a separate tab; an add-on that sits next to the text input could reduce friction.",
    contribution: [
      "Explored browser extension UX for inline writing assistance.",
      "Planned API-key based provider integration.",
      "Designed popup and settings flow for user configuration.",
    ],
    outcomes: [
      ["Goal", "Inline rewrite and translate near inputs"],
      ["Learned", "Extension lifecycle and provider abstraction"],
    ],
    stack: ["JavaScript", "Browser Extension", "API Integration"],
    accent: "lavender",
    links: [],
  },
];

export const projectFilters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
  { id: "experimental", label: "Experimental" },
  { id: "ongoing", label: "Ongoing" },
];

export function filterProjects(filterId: string): Project[] {
  if (filterId === "all") return projects;
  return projects.filter((p) => p.category === filterId);
}
