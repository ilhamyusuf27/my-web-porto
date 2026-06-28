# Progress

Branch: `develop`

## Today’s work summary

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
