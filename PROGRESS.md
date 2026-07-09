# Progress

Branch: `develop`

## Latest update

### CV document navbar
- [x] Added uploaded CV PDF to `public/documents/cv-ilham-yusuf-alghani.pdf`.
- [x] Added a navbar `CV` link to open the PDF in a new tab.
- [x] Renamed the internal experience nav label to `Experience` to avoid two `CV` items.


### Tomps Project case study
- [x] Added Tomps Project as a Work project using the shared SSG project data template.
- [x] Added Vue, TypeScript, and Vuex stack plus role notes for Tomps SaaS integration and multi-tenant maintenance.
- [x] Copied provided screenshots into `public/projects/tomps-project/`.
- [x] Added gallery/content for login, candidate project setup, project-number import, serial-number monitoring, project detail, map dashboard, candidate list, and stakeholder master data.
- [x] Added Tomps Project to the homepage featured project list.
- [x] Verified `pnpm build` succeeds with Node available via nvm PATH.


### Latest feedback fixes
- [x] Updated `/projects` category labels to `Work & Freelance`, `Learning`, and `Ongoing`.
- [x] Kept the work category active by default via the first `#production` tab.
- [x] Removed the trailing dashed timeline line after the last item on `/experience`.


### AUDIT_NEW.md implementation
- [x] Removed the `/projects` `All` tab so exactly one category is visible at a time.
- [x] Added hash-based tab routing for `/projects` with `#production`, `#practice`, and `#building` deep links.
- [x] Replaced inline project-row markup with `src/components/ProjectRow.astro`.
- [x] Added reusable `src/components/TabNav.astro` for tab lists and count badges.
- [x] Removed `is:inline` scripts from active routed pages and moved tab logic to standard scripts using `astro:page-load`.
- [x] Renamed `src/pages/work.astro` to `src/pages/experience.astro`.
- [x] Updated homepage CV and career-map links from `/work` to `/experience`.
- [x] Refactored `/experience` to use hash tabs (`#work`, `#education`) via the shared `TabNav`.
- [x] Replaced `/experience` 2-column cards with a vertical dashed timeline layout.
- [x] Added reusable `src/components/ExperienceItem.astro` for timeline entries.
- [x] Verified `src/pages/work.astro` no longer exists and `/experience` exists.
- [ ] `pnpm build` could not run because Node/npm/pnpm are missing in PATH in this environment.

### AUDIT_FIX_QUEUE.md fixes
- [x] Removed duplicate homepage `/projects` CTA by keeping only the compact header `View all →` link.
- [x] Renamed `/projects` categories to cleaner HUD copy: `Production`, `Practice`, and `Building Now`.
- [x] Replaced `/projects` anchor-jump links with client-side category tabs and category counters.
- [x] Added `data-category` filtering to `/projects` sections with accessible tab selected state updates.
- [x] Renamed `/experience` presentation consistently to `CV` after route migration.
- [x] Updated `/experience` header copy to `Career overview` and `Experience & Education`.
- [x] Added Work/Education tabs to `/experience` so visitors no longer scroll through all CV content at once.
- [x] Added internal card scrolling safety net on `/experience` with viewport-capped `.page-card`.
- [x] Verified no stale queue strings remain in `src` and `progress.md` stays removed.
- [ ] `pnpm build` could not run because Node/npm/pnpm are missing in PATH in this environment.

### AUDIT_UX.md fixes
- [x] Fixed blank navigation risk when returning to `/` by adding `data-astro-reload` to Home crumb links.
- [x] Scoped homepage overflow to `.home-shell` and restored default `body { overflow: auto; }` to avoid stale global overflow conflicts between pages.
- [x] Added homepage reveal timeout fallback so HUD panels cannot remain invisible after a page transition.
- [x] Simplified homepage panel `02` from `Projects / quest log` into a clear `Projects` snapshot.
- [x] Removed visitor-facing dev notes (`quest-list`) and redundant category queue links from the homepage projects panel.
- [x] Removed duplicate category queue links from the homepage projects panel.
- [x] Reworked `/projects` from a 2-column equal-card grid into a full-width readable project list.
- [x] Stacked category headings vertically with clearer section separation and larger typography.
- [x] Converted each project row into a full-card link so the whole item is clickable.
- [x] Removed the status-colored left-border styling from project cards/rows.
- [x] Renamed navigation hint to `View case study →`.
- [x] Consolidated `progress.md` into this `PROGRESS.md` file and removed the lowercase progress file.

## Verification
- [x] Syntax-balance check passed for edited Astro/CSS files.
- [x] Confirmed stale `quest-list`, `note-queue`, old `project-card` archive styles, and `Open case study` text are removed from active pages.
- [x] Confirmed Home crumb links use `data-astro-reload`.
- [ ] `pnpm build` could not run because Node/npm/pnpm are not installed in PATH in this environment.

## Consolidated from lowercase progress.md
### AUDIT.md fixes
- [x] Added dynamic `Layout.astro` props for `title`, `description`, `image`, `canonical`, and `lang`.
- [x] Added Open Graph and Twitter card metadata in `Layout.astro`.
- [x] Added canonical URL generation in `Layout.astro`.
- [x] Added JSON-LD `Person` structured data in `Layout.astro`.
- [x] Added Astro `ViewTransitions` for page-to-page transitions.
- [x] Replaced one-page-per-project implementation with SSG dynamic route `src/pages/projects/[slug].astro`.
- [x] Added shared project data source `src/data/projects.ts`.
- [x] Added previous/next project navigation at the bottom of case-study pages.
- [x] Improved `/projects` visual hierarchy with gradient hero text, accent underline, tab-pill counters, and status-colored card borders.
- [x] Added homepage scroll reveal animation for HUD panels.
- [x] Added pixel cat attention animation for discoverability.
- [x] Added stronger active/you-pin career-map pulse treatment.
- [x] Fixed old `Hero.astro` email CTA `aria-label`.
- [x] Fixed old `Contact.astro` LinkedIn URL.
- [x] Replaced stale placeholder data in old `About.astro` with real experience/education copy.
- [x] Reduced `Navbar.astro` dark-mode toggles from three instances to one.
- [x] Converted `public/ilham-avatar.png` to `public/ilham-avatar.webp` and wired homepage OG/avatar source to WebP fallback.
- [x] Added Catppuccin tokens into `tailwind.config.mjs` to reduce token drift.

## Verified
- [x] Syntax-balance check passed for edited Astro/TS/MJS files.
- [x] Checked shared project asset references: no missing image assets detected.
- [x] Checked stale audit strings: no placeholder `Company Name`, wrong LinkedIn slug, wrong email ARIA label, old example route, or duplicate static project data found in `src`.
- [x] Confirmed only one `<DarkModeToggle />` remains in `Navbar.astro`.
- [x] Confirmed only SSG project route files remain: `src/pages/projects/index.astro` and `src/pages/projects/[slug].astro`.
- [ ] `pnpm build` could not run because Node/npm/pnpm are not installed in PATH in this environment.

## Previous progress history

### Projects archive
- Updated homepage panel `02 Projects / quest log` to show categorized project routes instead of generic placeholders.
- Added `/projects` overview page with three categories:
  - Project from work
  - Project for learn
  - Project on going
- Updated homepage nav to include `Projects` and keep CV content under `CV`.

### Verification
- Static asset references used by the new pages exist.
- Basic brace-balance checks passed for changed Astro files.
- `pnpm build` could not be re-run in this environment because Node/npm/pnpm are not installed in PATH.

### Tomps Building case study
- Added `/projects/tomps-building` case-study page using the provided 2022–2024 project data.
- Added tech stack: React, TypeScript, Redux, Socket, Tailwind, Jest, Enzyme.
- Added description for the property-management dashboard modules: revenue dashboard, billing, complaints, maintenance, facility booking, unit data, and admin workflows.
- Added provided screenshots under `public/projects/tomps-building/` and wired them into a working track-based slider gallery with modal expand/zoom controls.
- Updated project overview and homepage panel 02 to point to the Tomps Building case study.

### BRI Box case study
- Added `/projects/bri-box` case-study page using the provided June 2023 project data.
- Added tech stack: React, Redux, Tailwind, Socket.
- Added description for multi-role dashboards, report monitoring, asset data, SLA tracking, user management, and socket-backed operations.
- Added provided screenshots under `public/projects/bri-box/` and wired them into the carousel/modal case-study layout.
- Updated project overview and homepage panel 02 to point to the BRI Box case study.

### Daily Language case study
- Added `/projects/daily-language` case-study page using the provided September 2023 freelance project data.
- Added tech stack: React, Redux, Material UI.
- Added description for tutoring student maintenance, authentication, student list management, status controls, and learning-section navigation.
- Added provided screenshots under `public/projects/daily-language/` and wired them into the carousel/modal case-study layout.
- Updated project overview and homepage panel 02 to point to the Daily Language case study.

### Tomps SaaS case study
- Added `/projects/tomps-saas` case-study page using the provided 2023–2025 previous-office project data.
- Added landing page stack: Nuxt, Pinia, Vitest, Strapi CMS, i18n.
- Added dashboard stack: Next.js, i18n, Redux Toolkit, React Testing Library, Tailwind.
- Added description for landing page, customer portal, package purchase, company onboarding, subdomain setup, payment flow, invoices, transaction states, and account management.
- Added provided screenshots under `public/projects/tomps-saas/` and wired them into the carousel/modal case-study layout.
- Updated project overview and homepage panel 02 to point to the Tomps SaaS case study.

### Case-study SSG refactor
- Replaced the one-page-per-project approach with one SSG dynamic route: `src/pages/projects/[slug].astro`.
- Added shared project data source: `src/data/projects.ts`.
- Moved Tomps SaaS, BRI Box, Daily Language, and Tomps Building content into shared data.
- Updated `/projects` overview to read from shared data.
- Removed old static project pages so future projects only need a new data entry and assets.
- Tomps Building now uses the same animated template as the newer project pages.

## Previous work summary

### 1. Career map data corrected
- Moved `UGM FK-KMK` out of Education and into Work.
- Relabeled the entry as `IT Assistant · UGM FK-KMK` so the role and institution are both visible.
- Renumbered Work chronologically:
  - `WORK 01` — IT Assistant · UGM FK-KMK · 2020–21
  - `WORK 02` — Telkom Indonesia · Front-End Web Developer · 2022
  - `WORK 03` — Tomps by Telkom · Front-End Web Developer · 2023–25
  - `WORK 04` — Madeindonesia · Front-End Web Developer · 2025 →
- Renumbered Education after removing UGM:
  - `EDU 01` — AMIKOM Yogyakarta · S1 Informatics · 2017–21
  - `EDU 02` — Pijar Camp · Full-Stack Website Developer · 2022

### 2. Career map visual redesign
- Split the old mixed single route into two independent map paths:
  - Work path connects Work nodes only.
  - Education path connects Education nodes only.
- Redesigned the trail geometry with smoother game-map style curves instead of sharp crossing diagonals.
- Added distinct visual treatments:
  - Work route uses mauve/accent dashed trail.
  - Education route uses teal dotted trail.
- Added separate lane labels for `Work experience` and `Education`.
- Increased vertical separation between Work and Education lanes.
- Restyled the map panel background with a subtle grid, compass/marker details, contour lines, and corner flourishes while keeping the Catppuccin/HUD style.

### 3. Career map interaction
- Added cursor-following tooltip for map nodes.
- Tooltip shows node metadata:
  - sequence + date
  - company/school
  - role/program
  - tech/details
- Tooltip follows pointer movement and hides on mouse leave.
- Tooltip uses the existing dark bordered monospace UI style.

### 4. Terminal panel content filled
- Added simulated terminal output so the panel no longer has dead space:
  - `git log --oneline -5`
  - fake commit messages
  - `npm test` passing summary
  - `ls projects/` with portfolio/project folders
- Tightened terminal typography and spacing so the added content fits without clipping.

### 5. Toolbelt expanded
- Added requested tools into existing/new rows:
  - Frontend: Redux, Zustand
  - CMS / PHP: Strapi
  - Backend: Nest
  - Database: Prisma ORM
  - AI tools: Gemini, Codex, Hermes, Claude
- Tightened toolbelt row spacing so the expanded list still fits the dashboard panel.

### 6. Hero avatar animation
- Added subtle idle bob animation.
- Added slight breathing/glow effect.
- Added lightweight particle/glow accents behind the avatar.
- Added subtle pointer parallax/tilt inside the hero character panel.
- Kept animation slow and non-distracting.

### 7. Layout / density fixes
- Fixed hero panel spacing so the CTA remains visible.
- Kept the dashboard one-screen desktop layout intact.
- Verified no page-level vertical scroll.
- Verified panels do not clip after the added content.

## Verification
- `pnpm run build` passes.
- Preview checked on `127.0.0.1:4322`.
- Browser checks confirmed:
  - no page-level vertical scroll
  - no clipped main panels
  - terminal content fits
  - expanded toolbelt fits
  - career map labels/data are updated
  - cursor tooltip appears and hides correctly
  - hero avatar animation is active
  - no browser console errors

## Notes
- If Astro dev preview looks stale after scoped CSS changes, verify with `pnpm run build` + `pnpm preview`; dev HMR/cache can show fresh HTML with stale scoped CSS.
