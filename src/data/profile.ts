export const profile = {
  name: "Ilham Yusuf",
  callsign: "ilhamya",
  role: "Frontend Developer",
  subrole: "Fullstack-capable Developer",
  tagline: "Building maintainable web interfaces and product workflows.",
  intro:
    "Frontend developer who builds polished interfaces, connects backend pieces, and keeps learning reliability-minded delivery.",
  location: "Indonesia - GMT+7",
  availability: "Open for freelance and remote roles",
  avatar: "/ilham-avatar.webp",
  avatarFallback: "/ilham-avatar.png",
};

export const ongoingBuilds: { id: string; title: string; focus: string; progress: number; next: string; accent: string }[] = [
  {
    id: "sre-path",
    title: "Reliability / SRE path",
    focus: "Active learning track for deployment, monitoring, and reliability fundamentals.",
    progress: 45,
    next: "Apply Docker, CI/CD, and basic monitoring in a small deployable project.",
    accent: "green",
  },
  {
    id: "moneyflow",
    title: "MoneyFlow app",
    focus: "Active personal finance build for accounts, categories, and transactions.",
    progress: 60,
    next: "Finish transaction flow and category rules.",
    accent: "yellow",
  },
  {
    id: "portfolio",
    title: "This portfolio",
    focus: "Active polish pass for this Astro, GSAP, and Three.js portfolio.",
    progress: 70,
    next: "Finish content QA and responsive polish.",
    accent: "mauve",
  },
];
