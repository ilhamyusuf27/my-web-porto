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
    title: "S1 Informatics",
    org: "AMIKOM Yogyakarta",
    period: "2017 - 2021",
    type: "degree",
    detail: "Bachelor of Informatics focused on web, multimedia, and animation.",
    note: "GPA 3.85",
  },
  {
    id: "pijarcamp",
    title: "Full-Stack Website Developer",
    org: "Pijar Camp",
    period: "2022",
    type: "bootcamp",
    detail: "Intensive full-stack program covering JavaScript, Node, Express, React, and Next.js.",
    note: "Bootcamp graduate",
  },
];

export const certificates: { id: string; title: string; issuer: string }[] = [
  { id: "cert-fullstack", title: "Full-Stack Website Developer", issuer: "Pijar Camp" },
  { id: "cert-degree", title: "Bachelor of Informatics", issuer: "AMIKOM Yogyakarta" },
];
