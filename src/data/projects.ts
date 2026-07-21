export type ProjectStatus = "completed" | "experimental" | "ongoing";

export type ProjectCategory = "work" | "personal" | "experimental" | "ongoing";

export type ProjectLink = {
  label: string;
  url: string;
  icon?: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
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
  images?: ProjectImage[];
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
      "A connected acquisition and self-service experience for package purchase, company onboarding, payments, invoices, and account management.",
    problem:
      "Tomps needed customers to move from package discovery to an active company account without relying on manual support.",
    contribution: [
      "Built and maintained the Nuxt landing page with Pinia, Strapi CMS, i18n, and Vitest coverage.",
      "Developed customer portal flows in Next.js for package selection, onboarding, payment, and transaction states.",
      "Managed dashboard state with Redux Toolkit and built Tailwind-based responsive SaaS UI.",
      "Added React Testing Library tests for dashboard interactions to keep iterations safe.",
    ],
    outcomes: [
      ["Scope", "Landing + authenticated customer portal"],
      ["Stack bridge", "Nuxt marketing to Next.js dashboard"],
    ],
    stack: ["Nuxt", "Pinia", "Vitest", "Strapi CMS", "i18n", "Next.js", "Redux Toolkit", "Tailwind"],
    image: "/projects/tomps-saas/landing-hero.jpg",
    images: [
      { src: "/projects/tomps-saas/landing-hero.jpg", alt: "Tomps SaaS landing page hero", caption: "Landing page hero" },
      { src: "/projects/tomps-saas/package-pricing.jpg", alt: "Tomps SaaS package pricing screen", caption: "Package pricing" },
      { src: "/projects/tomps-saas/my-package.jpg", alt: "Tomps SaaS package management screen", caption: "Customer package management" },
      { src: "/projects/tomps-saas/company-information-form.jpg", alt: "Tomps SaaS company information form", caption: "Company onboarding form" },
      { src: "/projects/tomps-saas/order-summary.jpg", alt: "Tomps SaaS order summary screen", caption: "Order summary" },
      { src: "/projects/tomps-saas/payment-method.jpg", alt: "Tomps SaaS payment method screen", caption: "Payment method" },
      { src: "/projects/tomps-saas/package-waiting-payment.jpg", alt: "Tomps SaaS waiting payment status", caption: "Waiting payment state" },
      { src: "/projects/tomps-saas/payment-instruction.jpg", alt: "Tomps SaaS payment instruction screen", caption: "Payment instruction" },
      { src: "/projects/tomps-saas/package-active.jpg", alt: "Tomps SaaS active package state", caption: "Active package state" },
      { src: "/projects/tomps-saas/account-company-property.jpg", alt: "Tomps SaaS company property account screen", caption: "Account company property" },
      { src: "/projects/tomps-saas/package-payment-failed.jpg", alt: "Tomps SaaS package payment failed state", caption: "Failed payment state" },
    ],
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
      "A multi-tenant project platform for setup, monitoring, map-based visibility, stakeholder data, and tenant-specific workflows.",
    problem:
      "Each customer tenant needed its own branding, feature flags, and modules while sharing one core project management engine.",
    contribution: [
      "Integrated Tomps Project with Tomps SaaS so customers reached the correct tenant after package activation.",
      "Maintained multi-tenant behavior for styling, branding, feature flags, and workflow variants.",
      "Fixed bugs across Vue, TypeScript, and Vuex screens for setup, monitoring, maps, imports, and master data.",
      "Kept project creation flows usable with multi-step forms, validation states, and draft saving.",
    ],
    outcomes: [
      ["Tenancy", "Per-tenant UI and feature flags"],
      ["Views", "Map-based project visibility"],
    ],
    stack: ["Vue", "TypeScript", "Vuex", "Tailwind"],
    image: "/projects/tomps-project/map-dashboard.jpg",
    images: [
      { src: "/projects/tomps-project/map-dashboard.jpg", alt: "Tomps Project map dashboard", caption: "Map dashboard" },
      { src: "/projects/tomps-project/login.jpg", alt: "Tomps Project login screen", caption: "Login screen" },
      { src: "/projects/tomps-project/candidate-project-list.jpg", alt: "Tomps Project candidate project list", caption: "Candidate project list" },
      { src: "/projects/tomps-project/create-project-basic.jpg", alt: "Tomps Project basic project creation form", caption: "Create project basic data" },
      { src: "/projects/tomps-project/create-project-fields.jpg", alt: "Tomps Project project fields form", caption: "Create project fields" },
      { src: "/projects/tomps-project/create-project-number-table.jpg", alt: "Tomps Project project number table", caption: "Project number table" },
      { src: "/projects/tomps-project/import-project-number-modal.jpg", alt: "Tomps Project import project number modal", caption: "Import project number modal" },
      { src: "/projects/tomps-project/project-detail.jpg", alt: "Tomps Project detail page", caption: "Project detail" },
      { src: "/projects/tomps-project/serial-number-monitoring.jpg", alt: "Tomps Project serial number monitoring", caption: "Serial number monitoring" },
      { src: "/projects/tomps-project/stakeholder-master-data.jpg", alt: "Tomps Project stakeholder master data", caption: "Stakeholder master data" },
    ],
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
      "Operational property modules that bring revenue, billing, complaints, maintenance, facilities, and unit data into one dashboard.",
    problem:
      "Building operators needed one dashboard to monitor revenue, billing, complaints, maintenance, and facility bookings without switching between tools.",
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
    images: [
      { src: "/projects/tomps-building/dashboard.jpg", alt: "Tomps Building dashboard", caption: "Building dashboard" },
      { src: "/projects/tomps-building/complaint-detail.jpg", alt: "Tomps Building complaint detail screen", caption: "Complaint detail" },
      { src: "/projects/tomps-building/facility-detail.jpg", alt: "Tomps Building facility detail screen", caption: "Facility detail" },
      { src: "/projects/tomps-building/facility-transaction.jpg", alt: "Tomps Building facility transaction screen", caption: "Facility transaction" },
      { src: "/projects/tomps-building/ipl-billings.jpg", alt: "Tomps Building IPL billings screen", caption: "IPL billings" },
      { src: "/projects/tomps-building/maintenance-schedule.jpg", alt: "Tomps Building maintenance schedule screen", caption: "Maintenance schedule" },
      { src: "/projects/tomps-building/other-bills.jpg", alt: "Tomps Building other bills screen", caption: "Other bills" },
      { src: "/projects/tomps-building/unit-detail.jpg", alt: "Tomps Building unit detail screen", caption: "Unit detail" },
    ],
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
      "A role-aware service dashboard for device reports, asset records, SLA tracking, and operational follow-up.",
    problem:
      "Super admin, partner, reporter, and technician roles each needed tailored access to reports, assets, and SLA status on a shared platform.",
    contribution: [
      "Built React dashboard interfaces using Redux-managed state and Tailwind styling.",
      "Implemented multi-role navigation and screens for super admin, partner, reporter, and technician.",
      "Developed report monitoring with SLA timers, status tabs, filters, pagination, and Excel export.",
      "Supported socket-driven updates for report status and notifications.",
    ],
    outcomes: [
      ["Roles", "Four distinct access levels"],
      ["Reporting", "SLA timers and Excel export"],
    ],
    stack: ["React", "Redux", "Tailwind", "Socket"],
    image: "/projects/bri-box/brand-splash.jpg",
    images: [
      { src: "/projects/bri-box/brand-splash.jpg", alt: "BRI Box brand splash screen", caption: "Brand splash" },
      { src: "/projects/bri-box/report-recap-admin.jpg", alt: "BRI Box admin report recap", caption: "Admin report recap" },
      { src: "/projects/bri-box/report-recap-partner.jpg", alt: "BRI Box partner report recap", caption: "Partner report recap" },
      { src: "/projects/bri-box/reporter-management.jpg", alt: "BRI Box reporter management screen", caption: "Reporter management" },
      { src: "/projects/bri-box/report-detail.jpg", alt: "BRI Box report detail screen", caption: "Report detail" },
      { src: "/projects/bri-box/asset-data.jpg", alt: "BRI Box asset data screen", caption: "Asset data" },
    ],
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
      "A tutoring operations dashboard for managing students, learning sections, account status, and day-to-day admin workflows.",
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
    images: [
      { src: "/projects/daily-language/student-list.jpg", alt: "Daily Language student list dashboard", caption: "Student list" },
      { src: "/projects/daily-language/sign-in.jpg", alt: "Daily Language sign in screen", caption: "Sign in" },
    ],
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
      "A personal finance product for tracking accounts, income, expenses, and categories through a clear, maintainable transaction model.",
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
    period: "Prototype test",
    role: "Solo prototype",
    type: "Browser extension prototype",
    summary:
      "A browser extension prototype for grammar, rewriting, and translation assistance beside the active text field.",
    problem:
      "The test explored whether writing help next to the active input could reduce tab-switching.",
    contribution: [
      "Tested browser extension UX for inline writing assistance.",
      "Sketched API key-based provider configuration.",
      "Designed popup and settings screens for the prototype.",
    ],
    outcomes: [
      ["Tested", "Inline rewrite and translation near text inputs"],
      ["Learned", "Extension lifecycle and provider configuration"],
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

export function normalizeProjectCategory(value: string): string {
  return value.trim().toLowerCase();
}

export function filterProjects(filterId: string): Project[] {
  const normalizedFilter = normalizeProjectCategory(filterId);
  if (normalizedFilter === "all") return projects;
  return projects.filter((p) => {
    const category = normalizeProjectCategory(p.category);
    const status = normalizeProjectCategory(p.status);
    return category === normalizedFilter || (normalizedFilter === "ongoing" && status === "ongoing");
  });
}
