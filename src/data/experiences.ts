export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  status: "active" | "done";
  stack: string[];
  highlights: string[];
};

export const experiences: Experience[] = [
  {
    id: "madeindonesia",
    company: "Madeindonesia",
    role: "Frontend Web Developer",
    period: "2025 - Present",
    location: "Yogyakarta, Indonesia",
    status: "active",
    stack: ["WordPress", "WooCommerce", "PHP", "Elementor"],
    highlights: [
      "Build and maintain WordPress and WooCommerce sites for day-to-day content and commerce operations.",
      "Translate marketing requirements into maintainable themes, templates, and frontend behavior.",
      "Resolve performance regressions, cross-browser issues, and client-specific customizations.",
    ],
  },
  {
    id: "tomps",
    company: "Tomps by Telkom",
    role: "Frontend Web Developer",
    period: "2022 - 2024",
    location: "Jakarta, Indonesia",
    status: "done",
    stack: ["React", "Vue", "Nuxt", "Next.js", "TypeScript", "Redux"],
    highlights: [
      "Delivered multi-tenant SaaS interfaces across Tomps SaaS, Project, and Building products.",
      "Built acquisition pages, customer onboarding, payment flows, and operational dashboard modules.",
      "Shipped responsive UI with shared state, Tailwind styling, and interaction tests.",
    ],
  },
  {
    id: "telkom",
    company: "Telkom Indonesia",
    role: "Frontend Web Developer",
    period: "2022",
    location: "Jakarta, Indonesia",
    status: "done",
    stack: ["React", "Tailwind", "Bootstrap", "Jest"],
    highlights: [
      "Developed React interfaces from reusable, tested components.",
      "Maintained consistent styling across Tailwind and Bootstrap codebases.",
      "Worked with backend engineers to align API contracts and interface states.",
    ],
  },
  {
    id: "ugm",
    company: "UGM FK-KMK",
    role: "IT Assistant",
    period: "2020 - 2021",
    location: "Yogyakarta, Indonesia",
    status: "done",
    stack: ["Design", "Streaming", "Video Editing"],
    highlights: [
      "Supported visual design, live streaming, and video production for faculty programs.",
      "Helped operate online events from preparation through live delivery.",
      "Developed practical production discipline before moving fully into frontend work.",
    ],
  },
];
