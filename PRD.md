# PRD: Ilham Yusuf — Production Systems Portfolio

A single-page developer portfolio for Ilham Yusuf. The site should present Ilham as a frontend developer who is fullstack-capable and actively growing toward DevOps/SRE and reliability engineering.

This document replaces the previous retro space-game direction. The new concept is a dark, technical, production-systems portfolio inspired by terminals, observability dashboards, deployment pipelines, API/network graphs, architecture diagrams, release logs, and reliability tooling.

## 1. Product goal

The portfolio must communicate:

- frontend craft and UI implementation quality
- fullstack capability across frontend, backend, WordPress, and client delivery
- interest and growth toward DevOps/SRE, reliability, deployment, and observability
- professional credibility for hiring managers, engineering leads, clients, and developers
- clear contact path

The site must feel like a credible technical portfolio before it feels experimental or stylized.

## 2. Audience

Primary audience:

- hiring managers
- engineering leads
- technical recruiters
- freelance/client stakeholders
- developers reviewing craft and project quality

The site should not feel like a game demo. It should feel like a polished technical interface made by a developer who understands product UI, systems, and reliability.

## 3. New concept

### Concept name

Production Systems Portfolio

### Concept statement

A one-page portfolio styled as a dark operational console. Each section acts like a different view into the same production system: system boot, operator profile, capability matrix, delivery timeline, case-study index, R&D lab, roadmap queue, credentials archive, and connection endpoint.

### Keep

- Astro
- GSAP
- Three.js, but no longer as a spaceship scene
- single-page structure
- staged screen-to-screen transitions
- project detail modal
- dark Catppuccin palette
- Mauve primary accent
- subtle pixel/terminal texture as detail

### Remove or de-emphasize

- spaceship / rocket as the main visual concept
- game, mission, player, cockpit, pilot, quest, launch, and final-transmission language
- childish pixel-art framing
- arcade UI
- random stars, excessive HUD ornaments, weapons, shields, explosions, and game effects

## 4. Scope

The site remains one page with 9 major sections:

1. Hero — System Online
2. About — Operator Profile
3. Expertise — Capability Matrix
4. Experience — Delivery Timeline
5. Selected Work — Case Study Index
6. Experiments — R&D Lab
7. Currently Building — Build Queue / Roadmap
8. Education — Credentials Archive
9. Contact — Secure Handshake

Project details must open in an in-page modal, not a new route.

No backend, CMS, auth, or analytics are required.

## 5. Section requirements

### 5.1 Hero — System Online

Purpose: introduce Ilham and establish the technical systems concept.

Must include:

- name
- role statement
- concise value statement
- primary CTA to selected work or contact
- secondary CTA for CV or about
- compact status indicators such as availability, location, focus

Vibe:

- boot terminal
- system status
- production console
- restrained and premium

Avoid:

- start mission/game start language
- spaceship as hero character
- cartoon terminal overload

### 5.2 About — Operator Profile

Purpose: explain who Ilham is and how he works.

Must include:

- profile summary
- location and availability
- working style
- focus areas
- short capability cards

Vibe:

- operator profile
- developer context panel
- secure system identity card

Avoid:

- pilot/cockpit/player labels
- fake stats or numeric power levels

### 5.3 Expertise — Capability Matrix

Purpose: communicate practical skill coverage.

Must include grouped capabilities:

- Frontend
- Backend
- WordPress / Client delivery
- Animation / UI
- DevOps / SRE learning
- Tools / Workflow

Vibe:

- capability matrix
- stack map
- technical modules

Avoid:

- progress bars with fake percentages
- game inventory language
- colorful skill cards

### 5.4 Experience — Delivery Timeline

Purpose: show work history as delivery and production responsibility.

Must include:

- role
- company
- period
- location/remote
- main responsibilities
- measurable or concrete contributions when available
- stack chips

Vibe:

- release history
- production delivery timeline
- deployment log

Avoid:

- mission log framing
- overly playful checkpoint language

### 5.5 Selected Work — Case Study Index

Purpose: showcase real project work.

Must include:

- project cards
- category filters
- title, summary, role/contribution, stack
- modal with detailed overview, contribution, and outcome/context

Vibe:

- case study index
- system archive
- project browser

Avoid:

- mission archive language as primary heading
- overly tiny card text
- hover-only detail access

### 5.6 Experiments — R&D Lab

Purpose: present browser add-ons, plugins, prototypes, and side experiments.

Must include:

- what was tested
- why it was built
- what was learned
- stack
- next iteration, when relevant

Vibe:

- R&D lab
- prototype notes
- experiment log

Avoid:

- chaotic lab decoration
- childish sci-fi props

### 5.7 Currently Building — Build Queue / Roadmap

Purpose: show current learning and active project direction.

Must include:

- current item title
- current focus
- progress as qualitative status, not fake percentage unless based on real progress
- next milestone
- risk/blocker when useful

Vibe:

- build queue
- roadmap board
- CI/deployment pipeline

Avoid:

- active quest language
- gamified progress bars without meaning

### 5.8 Education — Credentials Archive

Purpose: show formal learning and certification.

Must include:

- degree
- institution
- period
- bootcamp/certificates
- relevant notes

Vibe:

- credentials archive
- records system
- clean and quiet

Avoid:

- training records/game academy framing

### 5.9 Contact — Secure Handshake

Purpose: provide a strong final CTA and contact information.

Must include:

- email CTA
- CV/download CTA if available
- GitHub/LinkedIn links
- availability
- location/timezone
- focus/work interest

Vibe:

- connection endpoint
- secure handshake
- contact protocol

Avoid:

- final transmission/launch language
- decorative rocket/ship ending

## 6. Interaction requirements

### Desktop and tablet

- Each main section is visually treated as a screen.
- One intentional scroll gesture should navigate one section when the current section is not taller than the viewport.
- Screen-to-screen transition should feel staged, not like normal long-page scrolling.
- Sidebar/HUD navigation should move to sections through the same transition system.
- Keyboard navigation should support Arrow/Page/Home/End without stacking transitions.
- Modals must disable section navigation while open.

### Mobile

- Native free scrolling is allowed.
- Heavy staged snapping may be disabled for usability.
- Scene layer should be reduced or hidden if it hurts readability or performance.

### Reduced motion

When `prefers-reduced-motion: reduce` is enabled:

- skip cinematic transitions
- skip animated snapping
- skip particle/signal motion
- jump directly to the target section
- keep all content visible

## 7. Scene requirements

The Three.js layer should no longer present a spaceship or rocket as the main character.

New scene direction:

- abstract production-system visualization
- system nodes
- API/network edges
- signal pulses
- deployment pipeline segments
- observability waveforms
- lightweight architecture map

The scene should support the current section, not dominate it.

### Section scene behavior

- Hero: system boot / signal online
- About: operator profile node cluster
- Expertise: capability matrix nodes
- Experience: deployment/release timeline path
- Selected Work: minimal case-study index support
- Experiments: prototype/lab node cluster
- Currently Building: roadmap/pipeline flow
- Education: archive/record nodes
- Contact: secure handshake pulse

### Hard exclusions

- no spaceship as central object
- no rocket trail
- no shields, weapons, bullets, explosions
- no arcade effects
- no colorful particle spray

## 8. Visual requirements

- Professional first, stylized second.
- Dark Catppuccin base.
- Mauve primary accent.
- Blue/Sky only for small supporting details.
- Green/yellow/red only for meaningful states.
- Use neutral borders and subtle surfaces.
- Use pixel/terminal details sparingly.
- Avoid generic AI-looking cards with excessive gradient borders or glow.

## 9. Typography requirements

- Major headings: Space Grotesk, Sora, Geist, or similar structured sans.
- Body text: Inter or system sans.
- Technical metadata: JetBrains Mono or readable monospace.
- Pixel font, if retained, only for tiny metadata or section indexes.
- Do not use playful pixel fonts for large hero text or paragraphs.

## 10. Accessibility requirements

- All interactive items use real `button` or `a` elements.
- Modal uses `role="dialog"`, `aria-modal="true"`, labelled close button, focus trap, Escape close, and focus return.
- Decorative icons are `aria-hidden="true"`.
- Informative icons have text labels.
- Focus-visible styles are clear.
- Color contrast meets WCAG AA for body text.
- Animation is not required to understand content.

## 11. Performance requirements

- Three.js scene is lazy-loaded and should not block first paint.
- Scene stays lightweight; avoid large textures and heavy GLB models.
- Prefer procedural node/edge rendering over large visual assets.
- Dispose Three.js resources where applicable.
- Keep desktop Lighthouse performance target at 90+ for static shell.
- Mobile should remain readable even if scene is reduced/disabled.

## 12. Definition of done

A section is done when:

- it clearly communicates its content
- it has a distinct scene identity without using game/spacecraft metaphors
- it remains visually consistent with the rest of the site
- it is readable at 375px, 768px, 1024px, and 1440px
- it respects reduced motion
- it has no emoji
- it uses icons only where useful
- it does not rely on random decoration for visual interest

## 13. Implementation priority

1. Update documentation to the Production Systems concept.
2. Remove spaceship/game language from UI copy.
3. Replace ship/space scene with abstract system/network scene.
4. Reframe Hero, About, and Expertise first.
5. Reframe Experience and Currently Building.
6. Keep Selected Work mostly intact, but update labels from mission/archive to case-study/system language.
7. Polish Education and Contact.
8. Final accessibility, performance, and responsive pass.

## 14. Out of scope

- backend or CMS
- analytics
- multi-page routing
- photorealistic backgrounds
- large 3D models
- game combat effects
- decorative asset packs unless they support the production-systems concept
