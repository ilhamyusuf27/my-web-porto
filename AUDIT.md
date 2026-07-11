# Portfolio Website Audit

## Audit scope

This audit compares the current website implementation with `DESIGN.md` and the available project documentation.

`PRD.md` is currently empty, so product requirements, acceptance criteria, supported viewport behavior, and the exact expected scroll interaction cannot be verified against a PRD. The findings below are therefore based primarily on `DESIGN.md`, the source code, and the current design feedback.

## Executive summary

The website builds successfully, but the current experience does not yet reach the intended "playful, technical, and professional" direction.

The most important issues are:

1. GSAP section snapping is not implemented.
2. The rocket movement is continuous and floaty instead of snapping decisively between section-specific positions.
3. The current rocket is a temporary procedural fallback and is not acceptable as the final visual asset.
4. The rocket is low-poly but not pixelated.
5. The hero and section typography makes the portfolio feel childish.
6. Game terminology, bright accents, glow, and pixel styling are applied too heavily.
7. `PRD.md` contains no requirements against which the implementation can be formally accepted.

## Critical findings

### 1. GSAP section snapping is not implemented

`src/scripts/scroll.ts` registers `ScrollTrigger`, but only uses it for reveal animations. There is no document-level `ScrollTrigger` with a `snap` configuration.

The current snapping comes from CSS:

```css
html {
  scroll-snap-type: y proximity;
}
```

`proximity` snapping is optional and deliberately allows normal free scrolling. It is also completely disabled at viewport widths of 768px and below. The current behavior is therefore expected from the implementation and is not a GSAP malfunction.

#### Recommendation

- Add one GSAP `ScrollTrigger` that controls page-level snapping.
- Snap to the measured offset of each section rather than equal progress increments.
- Use a short duration and decisive easing so the transition feels responsive.
- Allow normal scrolling inside sections that are taller than the viewport.
- Disable snapping for reduced-motion users and, if needed, small mobile screens.
- Remove the CSS proximity snap after GSAP snapping is working so the two systems do not compete.

### 2. Rocket positioning is not snappy

The rocket position is calculated from total document scroll progress on every animation frame:

```ts
const p = this.scrollProgress();
const sway = Math.sin(p * Math.PI * 2) * 0.4;
const y = THREE.MathUtils.lerp(3.2, -3.2, p);
```

This produces a continuous floating path. The rocket never arrives at a clear visual anchor for each section, so it feels loose and disconnected from the section transitions.

It also does not implement the section-specific journey described in `DESIGN.md`, such as hovering near projects, following the experience timeline, slowing near education, and launching at contact.

#### Recommendation

- Define a position, rotation, scale, and visual state for every section.
- Animate between those states with GSAP timelines tied to the same section transition system as scroll snapping.
- Use short eased transitions when a snap completes rather than mapping the rocket directly to raw global scroll progress.
- Keep only a very small idle movement after the rocket reaches its target.
- Make the rocket's position reinforce the content layout and never cover important text or cards.
- Use a distinct contact-section launch animation instead of continuing the same sine-wave movement.

### 3. The current rocket is an unacceptable placeholder

`src/components/scene/RocketModel.ts` explicitly describes the procedural rocket as a stand-in until `public/assets/models/rocket.glb` is added. That GLB asset is currently missing, so the site always falls back to a rocket assembled from basic cylinders, cones, boxes, and a sphere.

The result has a generic toy-rocket silhouette and does not have enough detail, personality, or visual quality to serve as the main recurring portfolio asset. Because the rocket remains visible across the entire site, its quality strongly affects the perceived quality of the whole portfolio.

#### Recommendation

- Replace the procedural rocket rather than refining it as the final asset.
- Use an angular spacecraft, shuttle, or compact exploration ship with a more technical silhouette.
- Avoid the classic round body, bright window, red fins, and cartoon flame combination.
- Use a restrained palette dominated by dark neutral materials with one or two accents.
- Verify and document the asset license in `public/assets/ASSET_LICENSES.md`.
- Keep a simplified fallback only for loading failures.

### 4. The rocket is not pixelated

The current implementation is low-poly, but low-poly and pixel-art are not the same visual treatment.

Current rendering choices work against a pixelated result:

- Desktop antialiasing is enabled.
- Renderer pixel ratio can reach `2`.
- The rocket uses smoothly rendered Three.js geometry.
- The window uses a 12-by-12-segment sphere.
- There is no pixel texture, pixel shader, low-resolution render target, or nearest-neighbor upscale.

#### Recommendation

Choose one intentional visual direction:

1. Render the 3D scene at a deliberately low internal resolution and upscale it using nearest-neighbor filtering.
2. Apply a controlled pixelation post-processing pass to the rocket and scene.
3. Replace the 3D rocket with a high-quality pixel-art sprite or sprite sheet.

The third option will provide the clearest pixel-art result and the smallest runtime cost. The first option is preferable if the rocket must remain genuinely 3D.

## Visual direction findings

### 5. The "Ilham Yusuf" hero font feels childish

The hero name uses `Pixelify Sans` at up to `7rem`. Its rounded, playful letterforms become the dominant personality of the page at that scale.

Pixel typography is appropriate for small HUD details, but the current hierarchy makes the portfolio look like a game landing page before it looks like a professional developer portfolio.

#### Recommendation

- Use a sharper display sans for the hero name and major section headings.
- Suitable directions include Space Grotesk, Sora, Geist, Archivo, or a similarly structured geometric sans.
- Keep JetBrains Mono for technical copy, metadata, roles, dates, and commands.
- Restrict Press Start 2P to small indexes, HUD labels, and status indicators.
- Remove Pixelify Sans or limit it to a single minor decorative use.

### 6. The game metaphor is over-applied

Primary labels such as "Player Profile," "Loadout & Inventory," "Mission Log," "Mission Archive," "Active Quests," "Training Records," and "Final Transmission" make nearly every section read as game content.

These labels are individually consistent with `DESIGN.md`, but their combined use weakens the professional tone.

#### Recommendation

Use direct professional headings as the primary information architecture:

- About
- Expertise
- Experience
- Selected Work
- Experiments
- Currently Building
- Education
- Contact

Mission terminology can remain as secondary HUD text or small section metadata.

### 7. Too many playful visual signals compete at once

The site combines a large mauve pixel-style name, pink rocket fins, a glowing cyan window, an animated flame, scanlines, heavy pixel shadows, game labels, and changing accent colors across sections.

The individual choices follow parts of `DESIGN.md`, but their combined intensity pushes the result toward childish rather than technical and memorable.

#### Recommendation

- Base the interface primarily on crust, mantle, text, and muted blue-grey tones.
- Choose one main accent, such as mauve or sky.
- Reserve other palette colors for meaningful states rather than decoration.
- Reduce large glow effects.
- Use pixel borders and offset shadows as occasional details instead of the default treatment for every surface.
- Let spacing, typography, hierarchy, and technical diagrams provide most of the visual character.

## Layout and interaction risks

### 8. Full-height sections can conflict with strict snapping

Each section uses `min-height: 100vh`, vertical padding, `overflow: hidden`, and `scroll-snap-align: start`.

If section content grows taller than the viewport, a strict equal-distance snap system can make its middle content difficult to reach. `overflow: hidden` can also clip positioned decoration or content.

#### Recommendation

- Measure actual section offsets for snapping.
- Do not assume every section is exactly one viewport tall.
- Allow tall content sections to scroll normally before snapping to the next section.
- Reconsider `overflow: hidden` per section instead of applying it globally.
- Test short laptop heights as well as large desktop displays.

### 9. The rocket and section snapping need one shared motion system

Page snapping and rocket motion are currently separate concepts. CSS controls optional section snapping, while the Three.js scene reads raw page progress independently.

This makes it difficult for the rocket to land at the correct location when a section becomes active.

#### Recommendation

Use section activation as the shared source of truth:

1. Determine the active or target section.
2. Snap the page to that section.
3. Animate the rocket to that section's authored state.
4. Update the HUD and progress indicator from the same state.

### 10. Reduced-motion behavior is incomplete

Under reduced motion, the continuous animation loop stops, but the rocket still changes position in response to scroll. `DESIGN.md` recommends keeping the rocket static or using a simple image.

#### Recommendation

- Keep the rocket at one unobtrusive fixed position under reduced motion.
- Disable particle emission entirely.
- Avoid animated snapping and use immediate anchor navigation.

## Performance findings

### 11. The Three.js scene is heavy for its current visual quality

The production build succeeds, but the generated Three.js scene chunk is approximately 574 KB before gzip. The GLTF loader is also included even though the target model is currently missing.

#### Recommendation

- Settle the final rocket direction before optimizing the scene.
- Avoid loading the GLTF loader when no GLB asset is shipped.
- Consider a sprite solution if full 3D interaction is not essential.
- If 3D is retained, split scene features and load them only when needed.
- Measure performance on mid-range mobile hardware.

## Documentation gap

### 12. `PRD.md` needs measurable acceptance criteria

An empty PRD makes it impossible to determine whether a behavior is a defect, a design preference, or an unfinished feature.

The PRD should define at minimum:

- Target audience and portfolio goal.
- Supported desktop, tablet, and mobile breakpoints.
- Exact snap behavior for mouse wheel, trackpad, touch, keyboard, and anchor links.
- How tall sections should behave.
- Rocket visual direction and quality bar.
- Section-specific rocket states.
- Reduced-motion behavior.
- Accessibility requirements.
- Performance budgets.
- Definition of done for each section.

## Recommended implementation priority

### Priority 0 — interaction foundation

1. Implement real GSAP section snapping.
2. Create authored rocket states for every section.
3. Drive the page, rocket, HUD, and progress indicator from one active-section state.
4. Verify tall-section, mobile, keyboard, and reduced-motion behavior.

### Priority 1 — visual maturity

1. Replace the current rocket asset.
2. Choose and implement an intentional pixel-rendering technique.
3. Replace Pixelify Sans for the hero name and major headings.
4. Reduce game terminology in primary headings.
5. Simplify accents, glow, shadows, and decorative effects.

### Priority 2 — quality and performance

1. Populate `PRD.md` with measurable acceptance criteria.
2. Optimize Three.js and model loading.
3. Test responsive layouts across short and narrow viewports.
4. Run accessibility and performance checks after the visual redesign.

## Build status

`pnpm build` completes successfully. The build reports a warning that the Three.js scene chunk exceeds 500 KB, but there are no compilation errors.

---

## Resolution log (post-audit work)

Status of each finding after the audit-driven pass. `pnpm build` passes and the
preview serves `200`.

| # | Finding | Status | What changed |
|---|---------|--------|--------------|
| 1 | GSAP snapping not implemented | Resolved | Added a document-level `ScrollTrigger` snap to **measured** section offsets (nearest-point function, resize-safe), short `power3.inOut` ease. Removed competing CSS `scroll-snap-type`. `src/scripts/scroll.ts` |
| 2 | Rocket positioning not snappy | Resolved | New `RocketJourney` with one authored state per section; GSAP tweens on section activation, small idle bob, distinct contact launch. No more raw-scroll mapping. `src/components/scene/RocketJourney.ts` |
| 3 | Rocket is an unacceptable placeholder | Partial | Replaced the cartoon rocket with an **angular, dark-neutral shuttle** (no round body / bright window / red fins / cartoon flame; one mauve + dim sky accent). Still procedural — a real `.glb` is the remaining asset gap; `USE_GLB` toggle + `loadRocketGlb()` are wired for it. `src/components/scene/RocketModel.ts` |
| 4 | Not pixelated | Resolved | Scene now renders at a low internal resolution (`pixelScale` 0.5 / 0.55) and upscales with `image-rendering: pixelated` (nearest-neighbor); antialias OFF; pixel ratio capped at 1. `src/components/scene/SpaceScene.ts`, `SpaceSceneCanvas.astro` |
| 5 | Hero font feels childish | Resolved | Headings + hero name switched to **Space Grotesk**; Pixelify Sans removed from the font stack and Google Fonts request. `src/styles/tokens.css`, `BaseLayout.astro` |
| 6 | Game metaphor over-applied | Resolved | Primary headings are now professional: Intro, About, Expertise, Experience, Selected work, Experiments, Currently building, Education, Get in touch. Mission terms remain only as small HUD metadata. |
| 7 | Too many playful signals | Mostly resolved | Cooled the palette to one accent (mauve) + blue/sky; green/yellow reserved for meaningful states; reduced body glows, scanline/vignette intensity, hero title glow, and contact-rocket glow. Pixel offset shadows remain on cards as the intentional retro detail. |
| 8 | Full-height sections vs strict snapping | Resolved | Snap uses measured offsets; sections switched from `overflow: hidden` to `overflow: clip` (no scroll container, no content clip); tall sections keep one snap point at their own top. |
| 9 | Rocket + snapping need one motion system | Resolved | Shared active-section store drives snapping, HUD, progress, and the rocket. `src/scripts/sectionStore.ts` |
| 10 | Reduced-motion incomplete | Resolved | Under `prefers-reduced-motion`: rocket is static at one position, no particles, no idle bob, no animated snapping, immediate anchor navigation. |
| 11 | Three.js heavy | Partial | GLTFLoader is **no longer bundled** while no GLB ships (scene chunk dropped ~95 KB). Low-res pixelation cuts fill cost; scene stays lazy at `idle`. Three core still ~132 KB gzip — a sprite rocket remains a future option if 3D is not essential. |
| 12 | `PRD.md` has no acceptance criteria | Resolved | `PRD.md` now defines goals, breakpoints, exact snap/rocket/reduced-motion/a11y/perf criteria, and a per-section definition of done. |

### Remaining work (intentionally deferred)

- Ship a real CC0 `public/assets/models/rocket.glb` (or commit to the
  pixelated procedural shuttle) and document its license in
  `public/assets/ASSET_LICENSES.md`. Set `USE_GLB = true` in `SpaceScene.ts`.
- If Three.js weight matters on mid-range mobile, evaluate the sprite option
  from finding #4 (option 3) or further split scene features.
- Final Lighthouse / short-viewport pass after the real asset lands.

