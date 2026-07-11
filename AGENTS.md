# AGENTS.md: Implementation Guide for Production Systems Portfolio

## Project intent

Build a one-page portfolio website for Ilham Yusuf. Ilham is a frontend developer who also works across fullstack delivery and is learning DevOps/SRE practices.

The portfolio concept is now **Production Systems Portfolio**.

The site should feel like an elegant dark technical interface inspired by terminals, observability dashboards, deployment pipelines, system architecture diagrams, API/network graphs, release logs, and reliability tooling.

This document replaces the older retro space-game direction. Do not continue pushing the website toward a spaceship/game concept.

## Core stack

Use the existing stack:

```txt
Astro
TypeScript
GSAP
GSAP ScrollTrigger / ScrollToPlugin where already used
Three.js
CSS / SCSS
Icon library or local SVG icons
```

## Hard rules

- Do not use emoji in UI.
- Use icons instead of emoji.
- Keep Astro as the main framework.
- Keep the site single-page.
- Keep project detail in an in-page modal.
- Keep reusable components inside `src/components`.
- Store public assets inside `public/assets`.
- Respect `prefers-reduced-motion`.
- Keep content readable and accessible.
- Do not invent external URLs for projects.
- Do not add backend code unless explicitly requested.
- Prefer CC0 or clearly licensed assets.
- Do not add random ornaments to solve weak composition.

## Concept override

The old docs and code may still contain spaceship/game terms. Treat this section as the new source of truth.

### New concept

Production Systems Portfolio

### Use

- system
- operator
- capability
- delivery
- case study
- R&D
- build queue
- roadmap
- records
- secure handshake
- observability
- architecture
- deployment
- reliability

### Avoid

- rocket as central concept
- spaceship as central concept
- mission
- player
- cockpit
- pilot
- quest
- launch
- final transmission
- weapons / shields / bullets / explosions
- arcade effects
- colorful game UI
- childish pixel art

Subtle pixel/terminal details are allowed only as UI texture.

## Section order and new names

1. Hero — System Online
2. About — Operator Profile
3. Expertise — Capability Matrix
4. Experience — Delivery Timeline
5. Selected Work — Case Study Index
6. Experiments — R&D Lab
7. Currently Building — Build Queue / Roadmap
8. Education — Credentials Archive
9. Contact — Secure Handshake

## Current implementation priority

Do not redesign everything at once.

Recommended order:

1. Replace current ship/spacecraft scene with abstract system/network scene.
2. Remove spaceship/game language from UI copy and labels.
3. Reframe Hero, About, and Expertise.
4. Reframe Experience and Currently Building.
5. Keep Selected Work structure but update wording to case-study/system language.
6. Polish Education and Contact.
7. Final responsive/accessibility/performance pass.

## Scene direction

Three.js may stay, but it should no longer be a spaceship scene.

Replace it with an abstract production-system visualization:

- system nodes
- API/network edges
- signal pulses
- deployment pipeline paths
- observability waveform
- section-specific topology changes

Rules:

- no central ship character
- no rocket trail
- no combat/game effects
- no colorful particle spray
- low opacity
- never cover text/cards/CTAs
- reduced motion disables pulses and movement

## Section scene behavior

- Hero: system boot / signal online
- About: operator profile node cluster
- Expertise: capability matrix nodes
- Experience: delivery/deployment path
- Selected Work: minimal support layer behind case studies
- Experiments: prototype branch nodes
- Currently Building: roadmap/pipeline queue
- Education: archive record nodes
- Contact: secure handshake pulse

## Folder structure

Follow the existing project structure. Expected key areas:

```txt
src/
  components/
    layout/
    scene/
    sections/
    portfolio/
    ui/
  data/
  pages/
  scripts/
  styles/

public/
  assets/
    images/
    icons/
    sprites/
    textures/
```

If replacing the old ship files, keep compatibility exports if existing imports depend on old names. Prefer refactoring naming gradually to avoid breakage.

## Data strategy

Keep data separated in `src/data` where already used.

Do not change project data unless explicitly asked.

Recommended project categories:

- work
- personal
- experimental
- ongoing

Recommended status labels:

- completed
- ongoing
- experimental

Do not invent project URLs.

## UI language replacements

Replace old labels with new technical language where appropriate:

| Old language | New language |
| --- | --- |
| Start Mission | View Selected Work / System Online |
| Player Profile | Operator Profile |
| Skill Inventory / Loadout | Capability Matrix |
| Mission Log | Delivery Timeline |
| Mission Archive | Case Study Index |
| Experimental Lab | R&D Lab |
| Active Quests | Build Queue / Roadmap |
| Training Records | Credentials Archive |
| Final Transmission | Secure Handshake / Contact Endpoint |
| Rocket / Ship journey | System topology / signal flow |

## Styling rules

- Use Catppuccin dark base.
- Mauve is the primary accent.
- Blue/Sky are secondary and should be limited.
- Green/yellow/red only for meaningful states.
- Cards use neutral borders.
- Avoid rainbow borders.
- Avoid glow-heavy UI.
- Avoid fake progress percentages.
- Use clean professional typography.
- Pixel fonts only for tiny metadata if already present.

## Motion rules

- Keep existing staged screen-to-screen transition architecture unless asked to refactor.
- Motion should feel like switching between technical panels.
- Avoid bouncy, elastic, arcade motion.
- Modal interactions must block scroll/section navigation.
- Reduced motion skips staged transitions and animated scene movement.

## Accessibility checklist

- Real buttons and links.
- Visible focus states.
- Modal remains keyboard-accessible.
- Decorative scene elements are not required to understand content.
- Text remains readable without animation.
- No hover-only critical interactions.

## Build command

Use the package manager already present in the repo. Current workflow has been using:

```bash
pnpm build
```

Run build after each implementation pass and report errors/warnings.

## Prompt discipline for AI coding agents

When implementing, work on one task at a time.

Good task sizes:

- replace the scene only
- update Hero + About copy/layout only
- update Expertise only
- update Experience + Currently Building only
- update labels globally only

Bad task sizes:

- redesign the whole website
- replace scene, layout, copy, and transitions in one pass
- invent a new asset and integrate it in the same pass

## Immediate next coding task

Recommended next task:

```txt
Replace the current ship/spacecraft scene with an abstract production-system node/network scene. Do not redesign sections yet.
```

Use Codex/GPT high reasoning for scene architecture. Use GLM/Claude for smaller copy/layout polish tasks.
