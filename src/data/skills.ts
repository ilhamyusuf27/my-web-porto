export type SkillGroup = {
  title: string;
  icon: string;
  accent: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    icon: "mdi:code-tags",
    accent: "mauve",
    skills: ["Astro", "React", "Next.js", "Vue", "Nuxt", "TypeScript", "SCSS", "Tailwind"],
  },
  {
    title: "Animation & UI",
    icon: "mdi:sparkles",
    accent: "sky",
    skills: ["GSAP", "Three.js", "Framer Motion", "Canvas", "CSS Animation"],
  },
  {
    title: "WordPress",
    icon: "mdi:view-dashboard",
    accent: "blue",
    skills: ["Elementor", "WooCommerce", "ACF", "WPML", "Custom Themes"],
  },
  {
    title: "Backend",
    icon: "mdi:server",
    accent: "green",
    skills: ["Node.js", "NestJS", "Express", "Prisma", "PostgreSQL"],
  },
  {
    title: "Data & APIs",
    icon: "mdi:database",
    accent: "teal",
    skills: ["REST", "Redux Toolkit", "Vuex", "Pinia", "Socket"],
  },
  {
    title: "Tools",
    icon: "mdi:wrench",
    accent: "peach",
    skills: ["Git", "Docker", "Linux", "Cloudflare", "CI/CD"],
  },
];
