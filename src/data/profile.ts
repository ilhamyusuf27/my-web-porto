export const profile = {
  name: "Ilham Yusuf",
  callsign: "ilhamya",
  role: "Frontend Developer",
  subrole: "Full-stack Capable Developer",
  tagline: "Frontend engineering for maintainable products, practical workflows, and dependable delivery.",
  intro:
    "I turn product requirements into responsive interfaces, connect them to real data and workflows, and carry the work through production delivery.",
  location: "Indonesia - GMT+7",
  availability: "Open for freelance and remote roles",
  avatar: "/ilham-avatar.webp",
  avatarFallback: "/ilham-avatar.png",
};

export const ongoingBuilds: { id: string; title: string; focus: string; progress: number; next: string; accent: string }[] = [
  {
    id: "sre-path",
    title: "Reliability / SRE path",
    focus: "Developing practical skills in deployment, monitoring, and service reliability.",
    progress: 45,
    next: "Apply Docker, CI/CD, and basic monitoring in a small deployable project.",
    accent: "green",
  },
  {
    id: "moneyflow",
    title: "MoneyFlow app",
    focus: "Building a personal finance product around clear account, category, and transaction flows.",
    progress: 60,
    next: "Finish transaction flow and category rules.",
    accent: "yellow",
  },
  {
    id: "portfolio",
    title: "This portfolio",
    focus: "Refining this Astro, GSAP, and Three.js portfolio for clarity, speed, and responsive behavior.",
    progress: 70,
    next: "Finish content QA and responsive polish.",
    accent: "mauve",
  },
];
