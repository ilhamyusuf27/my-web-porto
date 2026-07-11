export const profile = {
  name: "Ilham Yusuf",
  callsign: "ilhamya",
  role: "Frontend Developer",
  subrole: "Fullstack-Capable Developer",
  tagline: "Building interactive, performant, and maintainable web experiences.",
  intro:
    "Frontend developer who builds polished interfaces, connects backend pieces, and is growing toward reliable, production-minded web systems.",
  location: "Indonesia - GMT+7",
  availability: "Open for freelance and remote roles",
  avatar: "/ilham-avatar.webp",
  avatarFallback: "/ilham-avatar.png",
};

export type PlayerStat = {
  label: string;
  value: number;
  icon: string;
  accent: string;
  note: string;
};

export const playerStats: PlayerStat[] = [
  { label: "Frontend", value: 92, icon: "mdi:code-tags", accent: "mauve", note: "React · Vue · Astro" },
  { label: "Fullstack", value: 80, icon: "mdi:server", accent: "green", note: "Node · Nest · Prisma" },
  { label: "WordPress", value: 78, icon: "mdi:view-dashboard", accent: "blue", note: "WooCommerce · ACF" },
  { label: "UI Motion", value: 85, icon: "mdi:sparkles", accent: "sky", note: "GSAP · Three.js" },
];

export const ongoingQuests: { id: string; title: string; focus: string; progress: number; next: string; accent: string }[] = [
  {
    id: "sre-path",
    title: "Reliability / SRE path",
    focus: "Growing from full-stack toward reliable systems and observability.",
    progress: 45,
    next: "Deepen Docker, CI/CD, and monitoring practice.",
    accent: "green",
  },
  {
    id: "moneyflow",
    title: "MoneyFlow app",
    focus: "Personal finance web app with a clear cash-flow dashboard.",
    progress: 60,
    next: "Finish transaction flow and category rules.",
    accent: "yellow",
  },
  {
    id: "portfolio",
    title: "This portfolio",
    focus: "Retro pixel space journey built with Astro, GSAP, and Three.js.",
    progress: 70,
    next: "Polish staged motion and interface rhythm.",
    accent: "mauve",
  },
];
