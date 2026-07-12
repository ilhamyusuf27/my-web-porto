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
    location: "Remote, Indonesia",
    status: "active",
    stack: ["WordPress", "WooCommerce", "PHP", "Elementor"],
    highlights: [
      "Build and maintain client WordPress and WooCommerce sites.",
      "Handle theme customization, performance checks, and cross-browser fixes.",
      "Turn marketing requirements into maintainable frontend implementation.",
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
      "Built multi-tenant SaaS dashboards across Tomps SaaS, Project, and Building.",
      "Worked on landing pages, customer portals, payment flows, and operational modules.",
      "Shipped responsive UI with Redux state, Tailwind styling, and interaction tests.",
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
      "Developed React interfaces with reusable, tested components.",
      "Maintained styling systems with Tailwind and Bootstrap.",
      "Collaborated with backend teams on integration contracts.",
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
      "Supported design, streaming, and video editing needs.",
      "Helped run online events and media production.",
      "Built production discipline outside pure code work.",
    ],
  },
];
