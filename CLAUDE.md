# CLAUDE.md: Coding Agent Guide for Production Systems Portfolio

## Read this first

You are working on Ilham Yusuf's one-page portfolio.

The project has pivoted away from the previous retro spaceship/game concept. The new concept is **Production Systems Portfolio**.

The website should feel like an elegant dark technical portfolio inspired by production dashboards, terminals, observability tools, deployment pipelines, architecture diagrams, API/network graphs, release logs, and reliability engineering.

Do not continue the old spaceship/game direction.

## Main goal

Present Ilham Yusuf as:

- a frontend developer with strong UI craft
- a fullstack-capable developer
- a developer learning DevOps/SRE and reliability practices
- a reliable person for client/product delivery

The portfolio must feel professional, technical, dark, elegant, and readable.

## Stack

Use the existing stack:

```txt
Astro
TypeScript
GSAP
Three.js
CSS / SCSS
```

Keep components modular and readable.

## Hard constraints

- No emoji in UI.
- Use icons instead of emoji.
- Keep the site as one page.
- Keep project detail in a modal.
- Do not invent external project URLs.
- Do not add backend code.
- Do not use unclear assets/licenses.
- Respect reduced motion.
- Preserve accessibility.
- Run `pnpm build` after edits.

## New section system

Use these section names and concepts:

1. Hero — System Online
2. About — Operator Profile
3. Expertise — Capability Matrix
4. Experience — Delivery Timeline
5. Selected Work — Case Study Index
6. Experiments — R&D Lab
7. Currently Building — Build Queue / Roadmap
8. Education — Credentials Archive
9. Contact — Secure Handshake

## Language rules

### Use

- system
- operator
- capability
- matrix
- delivery
- timeline
- case study
- R&D
- prototype
- build queue
- roadmap
- credentials
- records
- handshake
- endpoint
- observability
- deployment
- reliability

### Avoid

- rocket
- spaceship
- mission
- player
- cockpit
- pilot
- quest
- launch
- final transmission
- weapons
- shields
- bullets
- explosions
- arcade effects

If old component or file names still contain `Rocket`, do not rename everything at once unless it is safe. You may keep compatibility names internally while changing user-facing language and direction.

## Visual rules

- Professional first, stylized second.
- Dark Catppuccin base.
- Mauve primary accent.
- Blue/Sky only as small supporting accents.
- Green/yellow/red only for meaningful states.
- Neutral card borders.
- No rainbow borders.
- No excessive glow.
- No random ornaments.
- No dense starfield as main visual identity.
- Pixel/terminal details only as subtle texture.

## Three.js scene direction

The current ship/space scene should be replaced with an abstract production-system scene.

Preferred elements:

- network nodes
- architecture edges
- signal pulses
- deployment pipeline paths
- observability waveform
- section-specific topology

Avoid:

- central spacecraft object
- rocket trails
- game particles
- combat effects
- colorful sprite effects

Reduced motion:

- scene becomes static or nearly static
- no pulses/trails
- no idle motion

## Motion direction

The staged section transition architecture can stay.

Motion should feel like:

- changing system panels
- switching between technical views
- controlled and premium

Avoid:

- arcade bounce
- elastic motion
- huge movement
- attention-grabbing animation loops

## Section style expectations

### Hero — System Online

Boot/status screen. Use a strong intro, terminal command, and system status indicators.

### About — Operator Profile

Developer/operator profile with working context. Avoid pilot/player language.

### Expertise — Capability Matrix

Grouped skills as capability modules. No fake skill percentages.

### Experience — Delivery Timeline

Work history as delivery/release timeline.

### Selected Work — Case Study Index

Professional project cards and case-study modal. Keep current good structure where possible.

### Experiments — R&D Lab

Prototype/learning notes. Use hypothesis, prototype, learning, next iteration.

### Currently Building — Build Queue / Roadmap

Current active projects and learning path as build queue/pipeline.

### Education — Credentials Archive

Clean record/archive layout.

### Contact — Secure Handshake

Strong contact CTA, email, social links, availability snapshot.

## Implementation discipline

Do not do broad rewrites. Work in small passes.

Recommended order:

1. Replace scene concept from ship to system/network.
2. Update global user-facing labels from game language to system language.
3. Rework Hero/About/Expertise.
4. Rework Experience/Currently Building.
5. Update Selected Work labels and modal wording only.
6. Polish Education/Contact.
7. Final responsive/accessibility/performance pass.

## Current recommended next task

Replace the current ship/spacecraft scene with an abstract production-system network scene.

Task boundaries:

- Do not change project data.
- Do not redesign all sections.
- Do not change colors globally.
- Do not modify project cards/modal unless necessary.
- Do not add ornaments.
- Preserve transitions, reduced motion, and modal protections.

## Build and verification

After edits:

```bash
pnpm build
```

Report:

- changed files
- what changed
- what was intentionally not changed
- build result
- any existing warnings
