export type ProjectCaseStudy = {
  slug: string;
  category: "work" | "learn" | "ongoing";
  label: string;
  title: string;
  status: string;
  type: string;
  period: string;
  role: string;
  stack: string[];
  summary: string;
  cardDescription: string;
  galleryTitle: string;
  galleryIntro: string;
  gallerySummary: string;
  facts: [string, string][];
  gallery: [string, string, string][];
  responsibilities: string[];
  modules: [string, string][];
  outcomes: [string, string][];
};

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "tomps-saas",
    category: "work",
    label: "Work project",
    title: "Tomps SaaS customer portal",
    status: "2023–2025",
    type: "SaaS landing page and customer dashboard",
    period: "2023–2025",
    role: "Frontend Web Developer",
    stack: [
      "Nuxt",
      "Pinia",
      "Vitest",
      "Strapi CMS",
      "i18n",
      "Next.js",
      "Redux Toolkit",
      "React Testing Library",
      "Tailwind",
    ],
    summary:
      "A Tomps SaaS platform covering the public landing page and authenticated customer portal for package purchase, company onboarding, subdomain setup, payment flow, transaction history, invoices, and account management.",
    cardDescription:
      "SaaS landing page and customer portal for package purchase, company onboarding, subdomain setup, payments, invoices, and account management.",
    galleryTitle: "Tomps SaaS screens / slider overview",
    galleryIntro:
      "A compact walkthrough of the Tomps SaaS landing page, customer portal, package checkout, payment, and account-management flows.",
    gallerySummary:
      "Slider overview for Tomps SaaS: landing, package selection, company onboarding, payment flow, transaction states, and customer profile management.",
    facts: [
      [
        "Product",
        "Tomps SaaS landing page and customer portal for project, building, and asset management products.",
      ],
      [
        "Landing",
        "Nuxt, Pinia, Vitest, Strapi CMS, and i18n for marketing pages, articles, pricing, language switching, and product entry points.",
      ],
      [
        "Dashboard",
        "Next.js, i18n, Redux Toolkit, React Testing Library, and Tailwind for package management, checkout, payment, and profile flows.",
      ],
      [
        "Focus",
        "Clear SaaS onboarding, subscription purchase, virtual-account payment, subdomain activation, and customer self-service workflows.",
      ],
    ],
    gallery: [
      [
        "Landing page hero",
        "/projects/tomps-saas/landing-hero.jpg",
        "Public Tomps homepage introducing project, building, and asset management solutions with product navigation, pricing, articles, language switching, and conversion CTAs.",
      ],
      [
        "My Package dashboard",
        "/projects/tomps-saas/my-package.jpg",
        "Customer portal package hub showing Tomps Project, Tomps Building, and Tomps Asset cards with buy-package and coming-soon states.",
      ],
      [
        "Package pricing step",
        "/projects/tomps-saas/package-pricing.jpg",
        "Checkout step for choosing Personal or Basic packages with monthly duration controls, feature comparison, and guided stepper navigation.",
      ],
      [
        "Company information form",
        "/projects/tomps-saas/company-information-form.jpg",
        "Onboarding form for company data, province/regency selection, employee count, NPWP, address, position, and subdomain availability check.",
      ],
      [
        "Payment method selection",
        "/projects/tomps-saas/payment-method.jpg",
        "Payment step with customer/package summary, virtual-account bank options, company confirmation, and continue action.",
      ],
      [
        "Order summary",
        "/projects/tomps-saas/order-summary.jpg",
        "Order review screen showing package price, PPN, service fee tooltip, payment method, total payment, cancel, and pay actions.",
      ],
      [
        "Waiting payment package",
        "/projects/tomps-saas/package-waiting-payment.jpg",
        "Package detail state with pending payment deadline, Pay Now CTA, transaction history, search, and waiting-for-payment status.",
      ],
      [
        "Payment instruction page",
        "/projects/tomps-saas/payment-instruction.jpg",
        "Virtual account payment screen with countdown timer, copyable VA number, order detail, total payment, and Mandiri payment instructions.",
      ],
      [
        "Active package detail",
        "/projects/tomps-saas/package-active.jpg",
        "Active subscription state with subdomain copy action, Open App CTA, extend package button, invoice/tax invoice menu, and transaction history.",
      ],
      [
        "Payment failed state",
        "/projects/tomps-saas/package-payment-failed.jpg",
        "Package detail state for failed payment with alert banner, failed transaction row, and buy-package recovery CTA.",
      ],
      [
        "Account and property profile",
        "/projects/tomps-saas/account-company-property.jpg",
        "Customer account, company, and property information page with editable profile cards, company fields, property category, tagline, address, and logo.",
      ],
    ],
    responsibilities: [
      "Built and maintained the Tomps public landing page with Nuxt, Pinia, Strapi CMS content integration, i18n language support, and Vitest coverage.",
      "Developed customer portal flows in Next.js for package selection, onboarding forms, payment methods, order summaries, transaction states, and package activation.",
      "Managed dashboard state with Redux Toolkit and implemented Tailwind-based UI for responsive SaaS screens and customer self-service workflows.",
      "Implemented i18n-ready interface patterns for navigation, package pages, account settings, and payment-related screens.",
      "Added tests with React Testing Library for dashboard interactions and Vitest for landing-page logic to improve confidence during product iteration.",
    ],
    modules: [
      [
        "Landing and CMS",
        "Marketing homepage, product navigation, article/pricing/about pages, Strapi CMS content, i18n language switching, and conversion CTAs.",
      ],
      [
        "Package catalog",
        "Customer package listing for Tomps Project, Tomps Building, and Tomps Asset with available, coming-soon, active, failed, and pending states.",
      ],
      [
        "Checkout stepper",
        "Choose package, complete company information, select payment method, review order summary, and continue to payment.",
      ],
      [
        "Payment flow",
        "Virtual account options, total price breakdown, service fee tooltip, countdown, copyable VA number, payment instructions, and payment status recovery.",
      ],
      [
        "Customer portal",
        "Account settings, password page, FAQ, notifications, package history, invoice/tax invoice menu, and open-app/subdomain actions.",
      ],
      [
        "Company onboarding",
        "Company profile, regional data, employee count, NPWP, property information, logo, tagline, and subdomain availability validation.",
      ],
    ],
    outcomes: [
      [
        "SaaS readiness",
        "Connected public marketing, onboarding, package purchase, and customer self-service into one product journey.",
      ],
      [
        "Payment clarity",
        "Helped customers understand order totals, bank transfer steps, payment deadlines, invoices, and transaction status.",
      ],
      [
        "Maintainable delivery",
        "Separated landing and dashboard stacks while keeping i18n, tests, CMS content, and state management maintainable.",
      ],
    ],
  },
  {
    slug: "tomps-project",
    category: "work",
    label: "Work project",
    title: "Tomps Project multi-tenant platform",
    status: "2023–2025",
    type: "Project management SaaS dashboard",
    period: "2023–2025",
    role: "Frontend Web Developer",
    stack: ["Vue", "TypeScript", "Vuex"],
    summary:
      "A Tomps project-management platform for candidate projects, project creation, stakeholder setup, monitoring, serial-number tracking, map-based project visibility, and multi-tenant workspace operations.",
    cardDescription:
      "Multi-tenant project-management dashboard integrated with Tomps SaaS, covering candidate projects, project setup, monitoring, maps, stakeholder data, and tenant-specific UI behavior.",
    galleryTitle: "Tomps Project screens / slider overview",
    galleryIntro:
      "A compact walkthrough of the Tomps Project login, candidate project setup, project detail, monitoring, map dashboard, serial-number tracking, and master-data screens.",
    gallerySummary:
      "Slider overview for Tomps Project: authentication, create-project flows, bulk import, project activation, map-based dashboard, serial-number monitoring, and tenant-specific administration.",
    facts: [
      [
        "Product",
        "Tomps Project management dashboard for candidate projects, active project operations, stakeholder data, monitoring, and reporting workflows.",
      ],
      [
        "Stack",
        "Vue, TypeScript, and Vuex for multi-tenant dashboard screens and state-managed project workflows.",
      ],
      [
        "Integration",
        "Integrated Tomps Project with Tomps SaaS so package/subdomain/customer flows could open and operate the correct tenant workspace.",
      ],
      [
        "Maintenance",
        "Maintained tenant-specific behavior where each workspace could have different branding, styling, available modules, and functionality.",
      ],
    ],
    gallery: [
      [
        "Login screen",
        "/projects/tomps-project/login.jpg",
        "Tomps Project login screen with Telkom Indonesia branding, email/password form, remember-me checkbox, forgot-password link, social links, and WhatsApp support shortcut.",
      ],
      [
        "Create project fields",
        "/projects/tomps-project/create-project-fields.jpg",
        "Candidate project creation wizard with step navigation, project information fields, project value, category/group selectors, access status, strategic-project flag, project numbers, and draft/next actions.",
      ],
      [
        "Create project number table",
        "/projects/tomps-project/create-project-number-table.jpg",
        "Alternative create-project layout with number-project table, imported project-number columns, currency helper, category/group selection, and bulk import/download actions.",
      ],
      [
        "Import project number modal",
        "/projects/tomps-project/import-project-number-modal.jpg",
        "Excel import modal for adding many project numbers, including label input, drag-and-drop upload area, browse action, import button, and template download.",
      ],
      [
        "Serial number monitoring",
        "/projects/tomps-project/serial-number-monitoring.jpg",
        "Monitoring module for BAST serial numbers with searchable project list, selected project summary, serial-number table, empty state, download action, and import serial-number CTA.",
      ],
      [
        "Project detail overview",
        "/projects/tomps-project/project-detail.jpg",
        "Project detail page showing project value, scale, progress status, category, access status, strategic flag, identity numbers, stakeholders, organization data, schedule, address, map preview, activation/update actions, and status badge.",
      ],
      [
        "Create project basic layout",
        "/projects/tomps-project/create-project-basic.jpg",
        "Simplified tenant-specific project creation form with project info fields, category and group selectors, access controls, project-number add action, draft save, and next-step action.",
      ],
      [
        "Map dashboard",
        "/projects/tomps-project/map-dashboard.jpg",
        "Dashboard map view with project search, filters, project cards, total-project counter, map pin popup, project value, partner tags, delivery status, location, and detail link.",
      ],
      [
        "Candidate project list",
        "/projects/tomps-project/candidate-project-list.jpg",
        "Candidate Project table with tenant/status chips, searchable toolbar, action buttons, sortable columns, people-in-charge avatars, customer/partner columns, activate actions, row menus, and pagination.",
      ],
      [
        "Stakeholder master data",
        "/projects/tomps-project/stakeholder-master-data.jpg",
        "Settings master-data page for stakeholder types with sidebar navigation, search, add stakeholder action, type/code/description table, and edit/delete actions.",
      ],
    ],
    responsibilities: [
      "Integrated Tomps Project with Tomps SaaS so customers could access the right project-management tenant after package activation.",
      "Maintained multi-tenant dashboard behavior where each tenant could have different styling, branding, feature flags, modules, and workflow variations.",
      "Fixed bugs across Vue, TypeScript, and Vuex screens for candidate project setup, project activation, monitoring, map views, imports, and master-data modules.",
      "Maintained project creation flows with multi-step forms, project-number imports, validation states, draft saving, and tenant-specific field requirements.",
      "Supported operational modules for serial-number monitoring, stakeholder master data, project lists, detail pages, and map-based project visibility.",
    ],
    modules: [
      [
        "Authentication",
        "Branded login flow with email/password access, remember-me option, forgot-password route, registration entry, social links, and support shortcut.",
      ],
      [
        "Candidate project setup",
        "Multi-step project creation covering information, time/address, customer/partner, deliverables, documents, stakeholders, and cost planning.",
      ],
      [
        "Project numbers",
        "Manual project-number fields, dynamic add/remove columns, bulk Excel import, template download, and project-number table views.",
      ],
      [
        "Project operations",
        "Candidate project table, activation workflow, sortable columns, tenant/status chips, customer/partner data, and pagination.",
      ],
      [
        "Monitoring",
        "BAST serial-number monitoring with searchable project list, selected-project context, serial-number imports, downloads, tables, and empty states.",
      ],
      [
        "Workspace configuration",
        "Stakeholder master data, tenant-specific settings, workspace panel behavior, language switching, and module-level customization.",
      ],
      [
        "Map dashboard",
        "Geographic project discovery with searchable locations, project cards, map pins, project status, partner tags, delivery status, and detail navigation.",
      ],
    ],
    outcomes: [
      [
        "SaaS integration",
        "Connected the standalone project-management dashboard into the broader Tomps SaaS customer workspace flow.",
      ],
      [
        "Tenant flexibility",
        "Supported different tenant styling and functionality without breaking shared project-management workflows.",
      ],
      [
        "Operational coverage",
        "Maintained critical project setup, monitoring, map, import, stakeholder, and activation workflows used across project tenants.",
      ],
    ],
  },
  {
    slug: "bri-box",
    category: "work",
    label: "Work project",
    title: "BRI Box multi-role dashboard",
    status: "June 2023",
    type: "Device protection & service reporting platform",
    period: "June 2023",
    role: "Frontend Web Developer",
    stack: ["React", "Redux", "Tailwind", "Socket"],
    summary:
      "A BRI internal web dashboard for work-device protection workflows, asset management, report monitoring, SLA tracking, and multi-role user access across super admin, partner, reporter, and technician roles.",
    cardDescription:
      "Multi-role device protection dashboard for report monitoring, asset management, SLA tracking, user roles, and operational service workflows.",
    galleryTitle: "BRI Box screens / slider overview",
    galleryIntro:
      "A compact walkthrough of the BRI Box dashboards, role-based modules, asset pages, report lifecycle, and SLA monitoring screens.",
    gallerySummary:
      "Slider overview for the main BRI Box modules: multi-role dashboards, reports, assets, user management, SLA details, and operational monitoring.",
    facts: [
      [
        "Product",
        "BRI Box dashboard for protecting and monitoring employee work devices.",
      ],
      [
        "Scope",
        "Multi-role dashboards, report monitoring, asset data, user management, SLA status, and Excel reporting.",
      ],
      [
        "Users",
        "Super Admin, partner/admin teams, reporters, technicians, and regional operation users.",
      ],
      [
        "Focus",
        "Clear operational tables, role-based navigation, real-time report status, and fast admin workflows.",
      ],
    ],
    gallery: [
      [
        "BRI Box brand splash",
        "/projects/bri-box/brand-splash.jpg",
        "Opening brand screen for BRI Box with the message Perlindungan Perangkat Kerja Anda, establishing the product identity for device protection.",
      ],
      [
        "Report recap dashboard",
        "/projects/bri-box/report-recap-admin.jpg",
        "Super Admin report monitoring view with summary cards for incoming, waiting, in-progress, and completed reports, plus filters and Excel export.",
      ],
      [
        "Asset data management",
        "/projects/bri-box/asset-data.jpg",
        "Asset inventory table with search, asset condition filter, bulk asset import, new asset creation, status, and detail actions.",
      ],
      [
        "Report detail and SLA workflow",
        "/projects/bri-box/report-detail.jpg",
        "Detailed report page showing reporter information, asset information, SLA timeline, technician evidence, report photos, and user feedback.",
      ],
      [
        "Reporter user management",
        "/projects/bri-box/reporter-management.jpg",
        "Role-based user management page for Pelapor accounts with regional filters, search, active/nonactive toggles, and edit actions.",
      ],
      [
        "Partner report monitoring",
        "/projects/bri-box/report-recap-partner.jpg",
        "Report recap for partner/regional users with notification badge, Kanwil filter, SLA timer, status tabs, and paginated report table.",
      ],
    ],
    responsibilities: [
      "Built React dashboard interfaces for BRI Box operational modules using Redux-managed state and Tailwind styling.",
      "Implemented multi-role navigation and screens for super admin, partner, reporter, and technician workflows.",
      "Developed report monitoring views with SLA timers, status tabs, filters, table pagination, and Excel download flows.",
      "Built asset and user-management interfaces with search, condition/status filters, create/import actions, and detail/edit interactions.",
      "Supported socket-driven operational updates for report status visibility and notification-oriented dashboard behavior.",
    ],
    modules: [
      [
        "Multi-role dashboard",
        "Different access paths and navigation states for Super Admin, partner/regional users, Pelapor, and Teknisi roles.",
      ],
      [
        "Report monitoring",
        "Summary cards, status tabs, report filters, SLA timers, ticket tables, detail pages, and Excel export.",
      ],
      [
        "Report detail",
        "Reporter data, asset data, SLA progress, technician assignment, evidence photos, completion notes, and feedback.",
      ],
      [
        "Asset management",
        "Asset inventory, asset condition states, regional ownership, bulk import, new asset creation, and detail actions.",
      ],
      [
        "User management",
        "Pelapor and role-based account lists with regional filters, active toggles, search, and edit actions.",
      ],
      [
        "Realtime operations",
        "Socket-backed status awareness for report queues, notifications, and operational monitoring.",
      ],
    ],
    outcomes: [
      [
        "Role clarity",
        "Separated operational flows across admin, partner, reporter, and technician responsibilities.",
      ],
      [
        "Operational speed",
        "Helped users scan report queues, SLA status, and asset details from dense but readable dashboard screens.",
      ],
      [
        "Service traceability",
        "Connected tickets, assets, evidence, technician progress, and feedback into one report lifecycle.",
      ],
    ],
  },
  {
    slug: "daily-language",
    category: "work",
    label: "Freelance project",
    title: "Daily Language tutoring dashboard",
    status: "September 2023",
    type: "Tutoring student management platform",
    period: "September 2023",
    role: "Freelance Frontend Developer",
    stack: ["React", "Redux", "Material UI"],
    summary:
      "A tutoring administration dashboard for Daily Language, built to help maintain student accounts and learning-section content across reading, listening, writing, and speaking activities.",
    cardDescription:
      "Tutoring administration dashboard for maintaining students, learning sections, status controls, and student-management workflows.",
    galleryTitle: "Daily Language screens / slider overview",
    galleryIntro:
      "A compact walkthrough of the Daily Language sign-in and student-maintenance dashboard screens.",
    gallerySummary:
      "Slider overview for the Daily Language tutoring dashboard: authentication, student management, and learning-section navigation.",
    facts: [
      [
        "Product",
        "Daily Language admin dashboard for tutoring and student maintenance.",
      ],
      [
        "Scope",
        "Authentication, student list management, learning section navigation, status controls, and CRUD-style admin actions.",
      ],
      [
        "Users",
        "Tutoring admins/operators who manage students and learning content.",
      ],
      [
        "Focus",
        "Simple admin workflows, clear student tables, quick search, and organized learning modules.",
      ],
    ],
    gallery: [
      [
        "Daily Language sign-in",
        "/projects/daily-language/sign-in.jpg",
        "Login screen paired with Everyday English learning identity, including email/password access, remember-me option, forgot-password link, and sign-up route.",
      ],
      [
        "Student management dashboard",
        "/projects/daily-language/student-list.jpg",
        "Admin student list with sidebar modules, search, add-student action, status toggles, edit/delete/detail actions, and pagination.",
      ],
    ],
    responsibilities: [
      "Built React admin dashboard interfaces for managing tutoring students and learning-section content.",
      "Implemented Redux-managed state flows for student list interactions, search, status changes, and admin actions.",
      "Used Material UI components and layout patterns to create a clean, familiar admin experience.",
      "Structured sidebar navigation for Reading, Listening, Writing, and Speaking sections so admins can maintain learning activities clearly.",
    ],
    modules: [
      [
        "Authentication",
        "Sign-in flow with email, password, remember-me, forgot-password, and sign-up entry points.",
      ],
      [
        "Student management",
        "Student table with names, email/account data, registration date, active status toggle, and row-level actions.",
      ],
      [
        "Reading section",
        "Navigation entries for News/Article and Native Sosmed content maintenance.",
      ],
      [
        "Listening section",
        "Admin access for Listen a Song and Watching Youtube learning materials.",
      ],
      [
        "Writing section",
        "Mini Diary, Private Chat, and Group Chat areas for writing-practice workflows.",
      ],
      [
        "Speaking section",
        "Private Speaking, Group Speaking, and Real Speak modules for conversation-practice activities.",
      ],
    ],
    outcomes: [
      [
        "Admin clarity",
        "Grouped tutoring features by learning skill so operators can find the right maintenance area quickly.",
      ],
      [
        "Student control",
        "Provided student search, add, status toggle, edit, delete, and detail actions in one table.",
      ],
      [
        "Maintainable UI",
        "Used familiar Material UI dashboard patterns for a clean freelance deliverable.",
      ],
    ],
  },
  {
    slug: "tomps-building",
    category: "work",
    label: "Work project",
    title: "Tomps Building dashboard modules",
    status: "2022–2024",
    type: "Property management platform",
    period: "2022–2024",
    role: "Frontend Web Developer",
    stack: [
      "React",
      "TypeScript",
      "Redux",
      "Socket",
      "Tailwind",
      "Jest",
      "Enzyme",
    ],
    summary:
      "A property-management dashboard for apartment/building operations, covering revenue monitoring, tenant/unit data, billing, complaints, maintenance schedules, facility booking, and admin workflows.",
    cardDescription:
      "Property-management dashboard modules for revenue monitoring, billing, complaints, maintenance, facility booking, unit data, and admin workflows.",
    galleryTitle: "Tomps Building screens / slider overview",
    galleryIntro:
      "Compact screenshot slider for the admin modules. Open any screen to inspect it in zoom mode.",
    gallerySummary:
      "Image-heavy overview of the admin modules: dashboard analytics, operational details, billing flows, maintenance evidence, facility booking, and unit management.",
    facts: [
      ["Product", "Admin dashboard for building and apartment operations."],
      [
        "Scope",
        "Dashboard, billing, complaint, maintenance, facility, unit, and transaction detail pages.",
      ],
      [
        "Users",
        "Building admins, property managers, engineers, and operational staff.",
      ],
      [
        "Focus",
        "Clear data tables, readable detail pages, status tracking, and evidence-based workflows.",
      ],
    ],
    gallery: [
      [
        "Operations dashboard",
        "/projects/tomps-building/dashboard.jpg",
        "Main dashboard for revenue, units, billings, token usage, facility counts, maintenance tracking, and complaint summaries.",
      ],
      [
        "Complaint detail workflow",
        "/projects/tomps-building/complaint-detail.jpg",
        "Complaint/request detail page with tenant data, status timeline, report photos, engineer solution, payment details, invoice, and document attachments.",
      ],
      [
        "Facility master detail",
        "/projects/tomps-building/facility-detail.jpg",
        "Facility detail page showing room information, availability, operational time, asset list, search, table layout, and pagination.",
      ],
      [
        "Facility booking transaction",
        "/projects/tomps-building/facility-transaction.jpg",
        "Facility booking transaction page with reservation data, payment status, invoice number, charges, notes, and invoice download action.",
      ],
      [
        "IPL billings list",
        "/projects/tomps-building/ipl-billings.jpg",
        "Billing table with residence/commercial tabs, search, status filter, date range filter, download Excel action, create billing action, and paginated tenant rows.",
      ],
      [
        "Maintenance schedule detail",
        "/projects/tomps-building/maintenance-schedule.jpg",
        "Maintenance schedule page for assigned assets, technician contact, task priority, progress timeline, and evidence images.",
      ],
      [
        "Other bills transaction",
        "/projects/tomps-building/other-bills.jpg",
        "Other-bills transaction page with tenant, category, invoice, payment method, billing details, paid status, and cancel bill action.",
      ],
      [
        "Unit and owner detail",
        "/projects/tomps-building/unit-detail.jpg",
        "Unit management detail page with tower/unit metadata, owner identity data, legal document links, edit/delete owner actions, and tenant access controls.",
      ],
    ],
    responsibilities: [
      "Built and maintained React + TypeScript dashboard interfaces for operational building-management modules.",
      "Integrated Redux-managed data flows across list pages, detail pages, filters, status states, and transaction views.",
      "Implemented UI flows for complaints, maintenance progress, billing, facility booking, unit details, and admin master data.",
      "Worked with real-time/socket-driven interaction needs for operational status updates and admin workflows.",
      "Maintained component quality with Jest and Enzyme tests around critical interface behavior.",
    ],
    modules: [
      [
        "Dashboard",
        "Revenue cards, unit charts, billing charts, token usage, maintenance, and complaint summary widgets.",
      ],
      [
        "Complaint & request",
        "Ticket timeline, report evidence, engineer solution, payment details, and downloadable documents.",
      ],
      [
        "Maintenance",
        "Task schedule details, staff assignment, priority, progress states, and evidence gallery.",
      ],
      [
        "Billing",
        "IPL billing, other bills, invoice details, payment status, filtering, Excel download, and create/cancel actions.",
      ],
      [
        "Facility booking",
        "Facility detail, asset list, reservation transaction, pricing, invoice download, and booking notes.",
      ],
      [
        "Unit management",
        "Unit metadata, owner information, legal IDs/documents, and tenant access management.",
      ],
    ],
    outcomes: [
      [
        "Operational coverage",
        "Centralized many building-management workflows into consistent admin screens.",
      ],
      [
        "Data clarity",
        "Turned complex tenant, billing, facility, and maintenance data into readable tables and detail layouts.",
      ],
      [
        "Workflow traceability",
        "Supported timelines, statuses, invoices, documents, and evidence images for operational accountability.",
      ],
    ],
  },
];

export const projectHref = (slug: string) => `/projects/${slug}`;

export const archiveCategories = [
  {
    id: "production",
    eyebrow: "01 / production",
    title: "Work & Freelance",
    summary:
      "Client and company projects shipped with product constraints, team workflows, and real users.",
    projects: projectCaseStudies.filter(
      (project) => project.category === "work"
    ),
  },
  {
    id: "practice",
    eyebrow: "02 / practice",
    title: "Learning",
    summary:
      "Small labs and rebuilds used to sharpen fundamentals, explore new tools, and document learning progress.",
    projects: [],
  },
  {
    id: "building",
    eyebrow: "03 / now building",
    title: "Ongoing",
    summary:
      "Current ideas and long-running tracks that are still collecting data, screenshots, and build notes.",
    projects: [],
  },
];
