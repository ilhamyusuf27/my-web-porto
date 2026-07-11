# PRD: Ilham Yusuf — Pixel Space Portfolio

A single-page developer portfolio styled as a retro pixel-art space journey.
This document defines measurable acceptance criteria so behavior can be judged
against requirements rather than taste. It pairs with `DESIGN.md` (visual
direction) and `CLAUDE.md` (implementation guide).

## 1. Goals and audience

- **Goal:** present Ilham Yusuf as a frontend / fullstack-capable developer,
  communicate craft and reliability, and make contact frictionless.
- **Audience:** hiring managers, engineering leads, and fellow developers.
- **Tone:** professional first; the game/space metaphor is secondary flavor.
  The site must read as a credible portfolio before it reads as a game.

## 2. Scope

- Single page, 9 sections, ordered:
  Hero, About, Expertise, Experience, Selected Work, Experiments,
  Currently Building, Education, Contact.
- No backend. Project details open in an in-page modal, never a new page.

## 3. Breakpoints

- Desktop: `>= 1024px`. Full scene + snapping.
- Tablet: `768px–1023px`. Scene retained at lower resolution, two-column grids.
- Mobile: `<= 768px`. Free scrolling (no snap), stacked layouts, reduced scene.

## 4. Scroll and snap behavior (acceptance criteria)

Implemented by GSAP `ScrollTrigger` in `src/scripts/scroll.ts`.

- **Wheel/trackpad (desktop):** on scroll end, snap to the nearest section's
  measured top offset within `0.3–0.55s`, easing `power3.inOut`.
- **Snap targets:** measured per-section offsets, NOT equal progress increments.
- **Tall sections:** a section taller than the viewport still has exactly one
  snap point at its own top; a user can scroll through its full content before
  the next snap engages.
- **Touch (<= 768px):** snapping is disabled; native momentum scrolling.
- **Keyboard:** `Tab`/focus and anchor links move normally. Anchor links use
  native smooth scroll (immediate jump under reduced motion).
- **No competing systems:** CSS `scroll-snap-type` is OFF; GSAP is the only
  snap authority.
- **Single source of truth:** the active section (IntersectionObserver, center
  band) drives snapping feedback, HUD highlight, progress bar, and rocket state
  through `src/scripts/sectionStore.ts`.

## 5. Rocket journey (acceptance criteria)

Implemented in `src/components/scene/RocketJourney.ts`.

- One authored state (position, rotation, scale) per section.
- The ship animates to a section's state on activation (short eased tween),
  with a small idle bob at rest.
- The ship stays on the right of the viewport and never overlaps centered or
  left-aligned content.
- Contact section has a distinct launch animation (exits toward top).
- Motion is event-driven (active-section changes), not mapped to raw scroll.

## 6. Rocket visual direction

- Final asset: an angular spacecraft/shuttle with a technical silhouette.
  Dark neutral materials dominate, with one or two restrained accents.
- Avoid: round toy body, bright window, red fins, cartoon flame.
- Procedural fallback (`createRocket`) is acceptable only while no GLB ships.
- A real `.glb` may be dropped at `public/assets/models/rocket.glb`; set
  `USE_GLB = true` in `SpaceScene.ts` to auto-load it.
- License must be documented in `public/assets/ASSET_LICENSES.md`.

## 7. Pixel-art rendering

- The 3D scene renders at a reduced internal resolution (`pixelScale`)
  and is upscaled with `image-rendering: pixelated` (nearest-neighbor).
- Antialiasing is OFF; pixel ratio is capped at 1.
- Low-poly geometry alone does not satisfy this requirement.

## 8. Typography

- Headings and the hero name use Space Grotesk (sharp geometric sans).
- Press Start 2P is restricted to small HUD indexes, labels, and status.
- Pixelify Sans is removed.
- Body: Inter. Technical copy: JetBrains Mono.

## 9. Color

- Base the interface on crust, mantle, text, and muted blue-grey tones.
- One primary accent: mauve. Secondary/glow: blue/sky.
- Reserve green (done/active-done) and yellow (in-progress) for meaningful
  states, not decoration.
- Glow and offset shadows are occasional details, not the default for every
  surface.

## 10. Reduced motion (`prefers-reduced-motion: reduce`)

- No scroll scrub, no snapping, no particle trail, no idle bob.
- Rocket is static at one unobtrusive fixed position.
- Anchor navigation jumps immediately.
- All content remains visible; reveals are skipped.

## 11. Accessibility

- Real `button` / `a` elements for all interactions.
- Modal: `role="dialog"`, `aria-modal="true"`, focus trap, Esc to close,
  scroll lock, focus restored to the trigger, close button labeled.
- Decorative icons `aria-hidden`; informative icons have accessible text.
- Visible `:focus-visible` outlines; skip-link present.
- Color contrast meets WCAG AA for body text.
- No essential content appears only after animation.

## 12. Performance budgets

- Initial JS (non-scene) gzipped target: `<= 60 kB`.
- Three.js scene is lazy-loaded at `idle` and never blocks first paint.
- Scene renders at `pixelScale` (`0.5` desktop / `0.55` mobile) to cut fill.
- GLTFLoader is not fetched while no GLB ships.
- Lighthouse performance: target `>= 90` on desktop for the static shell.

## 13. Definition of done (per section)

- Section is `min-height: 100vh`, content never clipped, real content present.
- Heading is professional; game terms only as small HUD metadata.
- `data-reveal` items animate in (or are visible under reduced motion).
- Layout holds at 375px, 768px, 1024px, and 1440px widths.
- No emoji; icons only; palette from CSS variables.

## 14. Out of scope

- Backend, CMS, auth, analytics.
- Multi-page routes (the site is intentionally single-page).
- Photorealistic imagery as primary visuals.
