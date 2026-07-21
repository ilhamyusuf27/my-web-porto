export type Education = {
  id: string;
  title: string;
  org: string;
  period: string;
  type: "degree" | "bootcamp" | "certificate";
  detail: string;
  note?: string;
};

export const education: Education[] = [
  {
    id: "amikom",
    title: "Bachelor of Informatics",
    org: "AMIKOM Yogyakarta",
    period: "2017 - 2021",
    type: "degree",
    detail: "Built a broad technical foundation across web development, multimedia systems, and animation.",
    note: "GPA 3.85",
  },
  {
    id: "pijarcamp",
    title: "Full-Stack Website Developer",
    org: "Pijar Camp",
    period: "2022",
    type: "bootcamp",
    detail: "Applied full-stack training across JavaScript, Node.js, Express, React, and Next.js.",
    note: "Bootcamp graduate",
  },
];

export const certificates: { id: string; title: string; issuer: string }[] = [
  { id: "cert-fullstack", title: "Full-Stack Website Developer", issuer: "Pijar Camp" },
  { id: "cert-degree", title: "Bachelor of Informatics", issuer: "AMIKOM Yogyakarta" },
];
