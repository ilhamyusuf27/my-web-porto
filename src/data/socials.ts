export type Social = {
  id: string;
  label: string;
  handle: string;
  url: string;
  icon: string;
};

export const socials: Social[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "ilhamyusuf27",
    url: "https://github.com/ilhamyusuf27",
    icon: "mdi:github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "ilhamyusufalghani",
    url: "https://www.linkedin.com/in/ilhamyusufalghani/",
    icon: "mdi:linkedin",
  },
  {
    id: "email",
    label: "Email",
    handle: "hello@ilhamya.dev",
    url: "mailto:hello@ilhamya.dev",
    icon: "mdi:email",
  },
];

export const resumeUrl = "/documents/cv-ilham-yusuf-alghani.pdf";
