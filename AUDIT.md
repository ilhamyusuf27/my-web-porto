# 🔍 Portfolio Website Audit — ilhamya.dev

> Audit date: 2026-07-09 | Stack: Astro · Tailwind · TypeScript

---

## 1. Overview

This is a well-structured Astro portfolio with two distinct visual styles that are **not fully unified**:

| Area | Style used |
|---|---|
| `index.astro` (homepage) | Dark HUD / game-terminal aesthetic (Catppuccin Mocha) |
| `Hero.astro`, `About.astro`, `WorkExperience.astro`, etc. | **These components are never used on the homepage!** |
| `pages/projects/*` | Dark HUD style (consistent with homepage) |
| `work.astro`, `notes.astro` | Dark HUD style |

The core problem: **the homepage (`index.astro`) is a 1592-line monolith that inline-codes everything instead of using the components in `src/components/`.**

---

## 2. 🐛 The "Weird Stuff" on the Project Pages

### 2a. Components Exist But Are Not Used on the Project Detail Pages

> ✅ **Status: Acknowledged — intentionally unused during active redesign**

The `src/components/` folder contains several components from a previous design iteration:
- `Hero.astro` — light-mode, gradient/purple style
- `About.astro` — light-mode with card-based skills grid
- `Contact.astro` — light-mode contact grid
- `WorkExperience.astro` — light-mode timeline
- `Project.astro` — light-mode card grid (wraps `Card.astro`)
- `Navbar.astro` — top + side nav with dark mode toggle
- `Slider.astro` — tech stack scroll strip

These components belong to the **old design system** and are being replaced as part of an active redesign toward the dark HUD / Catppuccin Mocha aesthetic. They can be **safely deleted** once the redesign is complete, or kept as a reference during the transition.

**Remaining concern:** Each project detail page still duplicates the full structure — `<Layout>`, `<main>`, `<article>`, `<nav class="crumb">`, and 500+ lines of scoped `<style>` — from scratch. This is still **copy-paste architecture** and should be addressed with a shared `ProjectDetailLayout.astro` (see §6).

### 2b. Two Parallel Design Systems Living in the Same Codebase

| System A (components/) | System B (homepage + project pages) |
|---|---|
| Light/dark mode via `.dark` class | Dark-only (Catppuccin Mocha CSS vars) |
| Tailwind utility classes | Custom scoped CSS |
| `text-primary`, `text-secondary` semantic classes | `var(--mauve)`, `var(--rosewater)`, `var(--teal)` etc. |
| `DarkModeToggle.astro` toggles a `.dark` class | Dark mode toggle never wired up in the HUD pages |
| Components like `<Hero>`, `<About>`, `<Contact>` | Everything inlined in `index.astro` |

This means the 9 components in `src/components/` are **effectively dead code** for the main user flow through the HUD-style homepage → project pages.

### 2c. `Project.astro` Component Has Only 2 Projects; Index Has 3

`Project.astro` and `Card.astro` reference `tomps-building.png` and `daily-language.svg`, but the homepage's projects array (inline) has `Tomps SaaS`, `BRI Box`, and `Daily Language`. They're out of sync.

### 2d. `About.astro` Has Placeholder/Stale Data

```astro
// About.astro
const experiences = [
  {
    role: "Frontend Developer",
    company: "Company Name",   // ← placeholder!
    period: "2022 - Present",
    description: "Led frontend development...", // ← generic
    tech: ["React", "TypeScript", "Tailwind"]
  },
];
const education = {
  degree: "Bachelor of Computer Science",
  school: "University Name",  // ← placeholder!
  year: "2018 - 2022",
  achievements: "Graduated with honors, Led development team in final project"
};
```

Real data exists in `WorkExperience.astro` and `work.astro`, but `About.astro` still has the boilerplate.

### 2e. `DarkModeToggle` Appears Three Times in Navbar

In `Navbar.astro`, `<DarkModeToggle />` is rendered:
1. Inside the top nav (desktop)
2. Inside the side nav
3. Inside the mobile menu

All three share the same script, which queries `document.querySelectorAll('.theme-toggle')` — that's fine, but it creates UX confusion since all three toggles exist in the DOM simultaneously, potentially causing desynced UI state.

### 2f. `Contact.astro` LinkedIn URL is Wrong

```astro
link: "https://linkedin.com/in/ilhamya",   // ← incorrect slug
```

The correct URL (used elsewhere) is: `https://www.linkedin.com/in/ilhamyusufalghani/`

---

## 3. 🎨 Design & Attractiveness Improvements

### 3a. Homepage: Good HUD Aesthetic, But Missing Transitions

The homepage HUD style is creative and distinctive. However:
- **No page-transition animations** between homepage and project pages. The switch from HUD dark to project dark is jarring.
- **No scroll-triggered animations** on the homepage panels (the `reveal` class works on detail pages but not the homepage).
- The **pixel cat mascot** is charming — but the bubble message `"nya~ hover a panel"` isn't discoverable. Consider adding a subtle initial animation (wiggle/bounce) to draw attention.
- The career map SVG paths have routes but the nodes feel static — adding a **pulsing animation on the YOU-pin** and **active node** would add life.

### 3b. Project Index Page (`/projects`): Needs Visual Hierarchy Upgrades

- Project cards have a `box-shadow: 4px 4px 0` retro style but lack any **status indicator color coding** beyond the text. A colored left-border per status type (Work/Freelance/Learning/Ongoing) would instantly improve scannability.
- The **hero `<h1>` text** (`Categorized work, learning labs, and ongoing builds.`) is clamp-scaled nicely but could benefit from a **gradient or accent underline**.
- The jump links (`Work`, `Learn`, `Ongoing`) in `.hero-actions` look like small monospace buttons — they could be styled more prominently as **tab pills with a counter badge**.

### 3c. Project Detail Pages: Good Bones, Minor Polish Gaps

- The `image-section` slider is excellent — interactive, keyboard-accessible, with zoom. No immediate improvement needed.
- **`info-grid` text is very small** (`font-size: .56rem` for labels, `.82rem` for values) — on high-density screens this becomes hard to read.
- The `check-list` `[x]` prefix is a nice touch. Consider using the green `var(--green)` color for the check icon more prominently.
- **No "next project" / "previous project" navigation** at the bottom of detail pages. Users reaching the end of a case study have no path to the next one.

### 3d. Layout Component is Bare Minimum

`Layout.astro` has no:
- Open Graph / Twitter card meta tags
- `<link rel="canonical">`
- Structured data (JSON-LD for `Person`)
- `lang` is hardcoded to `"en"` but the developer profile says Indonesia — consider `lang="id"` fallback or at minimum a `lang` prop.

---

## 4. 🛠 Code Quality Improvements

### 4a. `index.astro` is a 1592-line Monolith

The homepage is a single file with:
- All data arrays inlined at the top (good)
- **All HTML inline** — no use of components
- **CSS at the bottom** — 1000+ lines of scoped styles mixed with scripts

**Recommended refactor:**
```
src/
  components/
    hud/
      HudLayout.astro        ← desktop-frame wrapper
      HudHero.astro          ← intro + profile panels
      HudTerminal.astro      ← interactive terminal
      HudToolbelt.astro      ← toolbelt + quest log panel
      HudCareerMap.astro     ← experience map SVG
      HudFooter.astro        ← status footer
      PixelCat.astro         ← cat mascot widget
```

### 4b. No Shared ProjectDetailLayout

Each of the 5 project detail pages repeats this structure identically:
- `<Layout>` wrapper
- `<main class="detail-shell">`
- `<article class="detail-card">`
- `<nav class="crumb">` breadcrumb
- `<div class="image-zoom">` modal
- All `<style>` rules (copied verbatim across files)

**Create a `ProjectLayout.astro`** that accepts props like `project`, `facts`, `gallery`, `responsibilities`, `modules`, `outcomes` and renders the shared skeleton. This would reduce each project page from ~520 lines to ~60 lines of data + one component call.

### 4c. Tailwind + Custom CSS Token Clash

The project uses both Tailwind utility classes (`text-primary`, `text-secondary`, `bg-secondary`, etc. — likely custom Tailwind color names) and raw CSS custom properties (`var(--mauve)`, `var(--teal)`). They're never reconciled:

- `tailwind.config.mjs` defines a `primary` color scale (blues: `#0ea5e9`, etc.) 
- But in global.css, `--primary` / `text-primary` seem to mean the foreground text color
- `darkMode: 'class'` is set in Tailwind config but the dark mode in `DarkModeToggle.astro` toggles a `.dark` class that's not actually applied to any Tailwind dark: variant classes on the HUD pages

**Recommendation:** Decide on one system. Either map the Catppuccin tokens into Tailwind's `theme.extend.colors` so you can use `text-mauve`, `bg-crust`, etc. as Tailwind utilities, or remove Tailwind from the HUD pages entirely and keep it only for the component-based pages.

### 4d. Script Duplication / IntersectionObserver Instances

> ✅ **Status: No longer applicable — affected components are part of the old design being replaced (see §2a)**

The components that had duplicated `IntersectionObserver` setups (`About.astro`, `Contact.astro`, `Card.astro`, `WorkExperience.astro`) are all old-design components that are no longer in use. This issue resolves itself once those files are cleaned up.

**Note for the new design:** When building new animated components for the HUD redesign, use a single shared observer pattern rather than per-component scripts to avoid repeating this pattern.

### 4e. `DarkModeToggle.astro` Has Dead Server-Side Variable

> ✅ **Status: No longer applicable — `DarkModeToggle.astro` and `Navbar.astro` are part of the old design being replaced (see §2a)**

The FOUC bug described here exists in `DarkModeToggle.astro`, which is used exclusively by `Navbar.astro`. Since both are old-design components being retired in the redesign, this issue will be resolved by deletion. If a theme toggle is added to the new HUD design, avoid the same pattern by reading `localStorage` in a blocking `<script>` in `<head>` before paint.

### 4f. `aria-label="LinkedIn Profile"` on Email Button

In `Hero.astro`:
```html
<a href="mailto:hello@ilhamya.dev" aria-label="LinkedIn Profile">
```
The `aria-label` says "LinkedIn Profile" but the link goes to email. This is a misleading accessibility label.

### 4g. `Work.astro` Title Tag is Generic

`Layout.astro` always renders `<title>Ilham Yusuf — Frontend Developer</title>` regardless of the current page. The `/work`, `/projects`, and individual project pages should have unique, descriptive `<title>` tags.

**Fix:** Accept a `title` prop in `Layout.astro`:
```astro
---
interface Props { title?: string; description?: string; }
const { title = "Ilham Yusuf — Frontend Developer", description = "..." } = Astro.props;
---
<title>{title}</title>
```

### 4h. Missing `loading="lazy"` on Avatar Image

```html
<img class="avatar-image" src="/ilham-avatar.png" alt="" aria-hidden="true" />
```
This is a 746KB PNG loaded eagerly (no `loading="lazy"` attribute). Since it's above the fold it could justify `fetchpriority="high"` instead, but at 746KB it should also be compressed/converted to WebP.

---

## 5. 📋 Summary of Priority Actions

### 🔴 Critical (fix now)

| # | Issue | File(s) | Status |
|---|---|---|---|
| 1 | `aria-label="LinkedIn Profile"` on email link | `Hero.astro:62` | Old design — resolved by redesign |
| 2 | Stale placeholder data in `About.astro` | `About.astro:15-29` | Old design — resolved by redesign |
| 3 | Wrong LinkedIn URL in `Contact.astro` | `Contact.astro:16` | Old design — resolved by redesign |
| 4 | `DarkModeToggle` FOUC bug | `DarkModeToggle.astro:2-3` | ✅ Old design — resolved by redesign |
| 5 | Layout has no dynamic `<title>` or OG tags | `Layout.astro` | ⚠️ Still applies |

### 🟡 High (refactor soon)

| # | Issue | File(s) | Status |
|---|---|---|---|
| 6 | Project detail pages have no shared layout — 5× duplicated CSS/HTML | `pages/projects/*.astro` | ⚠️ Still applies |
| 7 | `index.astro` is a 1592-line monolith | `pages/index.astro` | ⚠️ Still applies |
| 8 | Two parallel design systems (Tailwind light vs CSS vars dark) | whole codebase | ⚠️ Resolves as redesign completes |
| 9 | IntersectionObserver duplication | `About`, `Contact`, `Card`, `WorkExperience` | ✅ Old design — resolved by redesign |
| 10 | No "next project" link at bottom of case study pages | `pages/projects/*.astro` | ⚠️ Still applies |

### 🟢 Enhancement (good to have)

| # | Issue | File(s) | Status |
|---|---|---|---|
| 11 | Avatar PNG is 746KB — convert to WebP | `public/ilham-avatar.png` | ⚠️ Still applies |
| 12 | Add JSON-LD `Person` structured data | `Layout.astro` | ⚠️ Still applies |
| 13 | Add `rel="canonical"` to all pages | `Layout.astro` | ⚠️ Still applies |
| 14 | Project status color-coded left-borders | `pages/projects/index.astro` | ⚠️ Still applies |
| 15 | Page-to-page transition animation | `Layout.astro` / Astro View Transitions | ⚠️ Still applies |
| 16 | Pixel cat initial wiggle animation for discoverability | `index.astro` | ⚠️ Still applies |
| 17 | Map Catppuccin tokens into Tailwind config | `tailwind.config.mjs` | ⚠️ Still applies |
| 18 | `DarkModeToggle` triplicated in Navbar DOM | `Navbar.astro` | ✅ Old design — resolved by redesign |

---

## 6. 🏗 Recommended Refactor Plan (project pages)

Create a shared `ProjectDetailLayout.astro` that each project page slots data into:

```astro
// src/layouts/ProjectDetailLayout.astro
---
interface Props {
  project: { label: string; title: string; ... };
  facts: string[][];
  gallery: string[][];
  responsibilities: string[];
  modules: string[][];
  outcomes: string[][];
}
const { project, facts, gallery, responsibilities, modules, outcomes } = Astro.props;
---
<Layout title={`${project.title} — Ilham Yusuf`}>
  <main class="detail-shell">
    <article class="detail-card">
      <nav class="crumb">...</nav>
      <header class="project-hero reveal">...</header>
      <!-- slider, info-grid, module-grid, check-list, outcome-grid -->
    </article>
  </main>
</Layout>
<script>/* shared slider + zoom logic */</script>
<style>/* shared styles */</style>
```

Then each project file becomes just data:
```astro
// pages/projects/tomps-saas.astro  (~60 lines instead of 523)
---
import ProjectDetailLayout from "../../layouts/ProjectDetailLayout.astro";
const project = { ... };
const facts = [ ... ];
---
<ProjectDetailLayout {project} {facts} {gallery} {responsibilities} {modules} {outcomes} />
```

---

## 7. 📦 Recommended Packages

These packages are well-suited to what's already in this Astro + Tailwind + TypeScript project.

### 🚀 High Priority — Add Now

#### [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
> Official Astro integration. Auto-generates a `sitemap.xml` on build — required for good SEO.
```bash
pnpm astro add sitemap
```

#### [`astro-seo`](https://github.com/jonasmerlin/astro-seo)
> Dead-simple component to drop proper `<title>`, OG tags, Twitter cards, and canonical links into `Layout.astro`. Fixes issue §4g and §3d in one move.
```bash
pnpm add astro-seo
```
```astro
<SEO title="Ilham Yusuf — Tomps SaaS" description="..." openGraph={{ ... }} />
```

#### [`@astrojs/image`](https://docs.astro.build/en/guides/images/) (built-in since Astro 3+)
> Use Astro's built-in `<Image />` component to auto-convert the 746KB avatar PNG to WebP and add proper `width`/`height` to avoid CLS. No extra package needed — just switch from `<img>` to `<Image>`.
```astro
import { Image } from 'astro:assets';
import avatar from '../assets/ilham-avatar.png';
<Image src={avatar} alt="Ilham" width={400} format="webp" />
```

---

### 🎨 Design & Animation

#### [`motion`](https://motion.dev/) (formerly Framer Motion, framework-agnostic)
> Lightweight animation library with a vanilla JS API that works perfectly with Astro's island architecture. Great for the pixel cat wiggle, panel entrance animations, and map node pulses — without shipping a React runtime.
```bash
pnpm add motion
```

#### [`@fontsource/geist`](https://fontsource.org/fonts/geist) / [`@fontsource/geist-mono`](https://fontsource.org/fonts/geist-mono)
> Self-host the Geist fonts (already used in `global.css`) instead of loading from Google Fonts. Eliminates a render-blocking external request and works offline.
```bash
pnpm add @fontsource/geist @fontsource/geist-mono
```
```astro
// In Layout.astro frontmatter
import '@fontsource/geist/400.css';
import '@fontsource/geist/600.css';
import '@fontsource/geist-mono/400.css';
```

---

### 🛠 Developer Experience

#### [`astro-compress`](https://github.com/astro-community/astro-compress)
> Minifies HTML, CSS, JS, and compresses images at build time. Zero-config, significant performance boost for a static Cloudflare Pages deploy.
```bash
pnpm add astro-compress
```

#### [`@playful-coding/astro-relative-links`](https://github.com/playfulprogramming/astro-relative-links) or [`astro-link`](https://github.com/delucis/astro-link)
> Automatically opens external links in `_blank` with `rel="noopener noreferrer"` — saves writing it manually on every social/external `<a>` tag.

#### [`zod`](https://zod.dev/)
> If project data arrays grow (e.g. pulled from a CMS or JSON files), Zod lets you validate and type the schema at build time. Astro's Content Collections already use Zod internally — you can extend this for custom data validation.
```bash
pnpm add zod
```

---

### 📊 Analytics (privacy-friendly)

#### [`astro-umami`](https://github.com/ijkml/umami-astro) + [Umami Cloud](https://umami.is/)
> Cookie-free, GDPR-compliant analytics. Free tier available. Lets you track page visits and button clicks without compromising visitor privacy.
```bash
pnpm add astro-umami
```

---

### ✅ Packages Already Used Well

| Package | Usage |
|---|---|
| `astro-icon` | ✅ Used throughout for MDI icons |
| `tailwindcss` | ✅ Configured, used in component layer |
| `@astrojs/tailwind` | ✅ Wired up in `astro.config.mjs` |

---

*End of audit — generated by Antigravity · last updated 2026-07-09*
