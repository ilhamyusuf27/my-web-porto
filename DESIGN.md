# DESIGN: Production Systems Portfolio

## 1. Design direction

The website is no longer a retro space-game portfolio. The new direction is an elegant dark technical portfolio inspired by production interfaces: terminals, observability dashboards, deployment pipelines, architecture diagrams, API graphs, incident timelines, and release logs.

The design should communicate frontend craft, fullstack capability, and a reliability mindset. It should feel professional, calm, technical, and memorable.

## 2. Concept

### Concept name

Production Systems Portfolio

### Core idea

The visitor moves through a set of production-system views:

- System Online
- Operator Profile
- Capability Matrix
- Delivery Timeline
- Case Study Index
- R&D Lab
- Build Queue
- Credentials Archive
- Secure Handshake

Each section should feel like a different technical screen within one coherent system.

## 3. Design principles

1. Professional first, stylized second.
2. Technical clarity beats decorative complexity.
3. Every section needs a distinct scene identity.
4. Visual variety should come from composition, motifs, and information architecture, not more colors.
5. Motion should feel staged and intentional, not arcade-like.
6. Pixel/retro details can remain only as subtle texture or micro UI flavor.
7. The site should look credible for frontend/fullstack roles and DevOps/SRE learning.

## 4. What to remove

Avoid these as primary direction:

- spaceship / rocket as main character
- starfield as dominant identity
- game, mission, player, cockpit, pilot, quest, final transmission wording
- weapons, shields, bullets, explosions
- arcade effects
- colorful borders per card
- excessive scanlines/glow
- fake dashboard percentages
- childish pixel-art styling

## 5. Visual keywords

Use:

- dark
- technical
- elegant
- operational
- structured
- reliable
- systemized
- restrained
- observability-inspired
- terminal-inspired
- architecture-driven

Avoid:

- cute
- toy-like
- colorful arcade
- game dashboard
- spaceship adventure
- generic AI card UI
- glow everywhere

## 6. Color system

Use Catppuccin Mocha as the base.

### Base colors

```css
:root {
  --rosewater: #f5e0dc;
  --flamingo: #f2cdcd;
  --pink: #f5c2e7;
  --mauve: #cba6f7;
  --red: #f38ba8;
  --maroon: #eba0ac;
  --peach: #fab387;
  --yellow: #f9e2af;
  --green: #a6e3a1;
  --teal: #94e2d5;
  --sky: #89dceb;
  --sapphire: #74c7ec;
  --blue: #89b4fa;
  --lavender: #b4befe;
  --text: #cdd6f4;
  --subtext-1: #bac2de;
  --subtext-0: #a6adc8;
  --overlay-2: #9399b2;
  --overlay-1: #7f849c;
  --overlay-0: #6c7086;
  --surface-2: #585b70;
  --surface-1: #45475a;
  --surface-0: #313244;
  --base: #1e1e2e;
  --mantle: #181825;
  --crust: #11111b;
}
```

### Usage rules

- Background: Crust / Mantle / Base.
- Cards: Surface0 with subtle transparency.
- Borders: neutral text/surface alpha, not rainbow accents.
- Primary accent: Mauve.
- Secondary accent: Blue/Sky only for small system signals.
- Green: successful/available/online state only.
- Yellow: warning/in-progress state only.
- Red: error/risk state only.

Do not use many accent colors in one section.

## 7. Typography

### Recommended

- Major headings: Space Grotesk, Sora, Geist, or similar geometric sans.
- Body: Inter or system sans.
- Technical metadata: JetBrains Mono or IBM Plex Mono.
- Pixel font: only for tiny section indexes or metadata, if retained.

### Rules

- Do not use playful pixel font for major headings.
- Do not use pixel font for paragraphs.
- Keep body text readable at 16px+.
- Use uppercase for small labels only.
- Keep line length comfortable.

## 8. Layout language

The old repeated card-on-starfield pattern should be replaced by section-specific compositions.

Shared layout qualities:

- strong alignment
- clear hierarchy
- compact technical metadata
- balanced negative space
- neutral panels
- subtle system motifs

Use different motifs per section:

- terminal boot screen
- profile identity panel
- matrix/grid
- timeline/release log
- case-study browser
- prototype notes
- roadmap queue
- credential records
- handshake endpoint

## 9. Section scene system

Each section needs a different vibe while staying inside the same visual system.

### Hero — System Online

Vibe: terminal boot and system status.

Use:

- command line prompt
- status row
- system health style cards
- strong name and role
- subtle network/boot visualization

Avoid:

- Start Mission
- spaceship launch
- game start screen

### About — Operator Profile

Vibe: developer profile / operating context.

Use:

- profile panel
- working style cards
- identity metadata
- subtle access-control or profile-grid motif

Avoid:

- Pilot/Profile cockpit language
- game stats

### Expertise — Capability Matrix

Vibe: stack map / capability matrix.

Use:

- grouped modules
- category chips
- status labels like Daily, Comfortable, Learning
- subtle grid or matrix background

Avoid:

- skill percentage bars
- inventory/loadout language

### Experience — Delivery Timeline

Vibe: release history / production delivery log.

Use:

- timeline rail
- deployment/checkpoint markers
- role entries as release cards
- contribution bullets

Avoid:

- mission log language

### Selected Work — Case Study Index

Vibe: case study browser.

Use:

- filter tabs
- project cards
- readable project summaries
- professional detail modal

Avoid:

- mission archive/game file framing

### Experiments — R&D Lab

Vibe: prototype notes / technical exploration.

Use:

- hypothesis/outcome/learning structure
- lab-note panels
- small technical annotations

Avoid:

- chaotic sci-fi lab decorations

### Currently Building — Build Queue / Roadmap

Vibe: active development board.

Use:

- queue cards
- roadmap stages
- next milestone
- risk/blocker when useful
- pipeline motif

Avoid:

- active quest language

### Education — Credentials Archive

Vibe: credential records.

Use:

- archive cards
- certificate index
- clean timeline

Avoid:

- training/game academy framing

### Contact — Secure Handshake

Vibe: connection endpoint.

Use:

- email CTA
- availability/status
- contact protocol panel
- GitHub/LinkedIn links

Avoid:

- final transmission / rocket exit

## 10. Component direction

### Buttons

Use for CTAs.

Style:

- clear rectangular shape
- subtle border
- mauve fill for primary CTA
- neutral secondary CTA
- visible focus state
- minimal motion

Avoid chunky arcade button styling.

### Cards

Use for projects, experience, capability groups.

Style:

- dark surface
- neutral border
- subtle shadow or none
- strong typography hierarchy
- small metadata row

Avoid:

- per-card colored border systems
- thick pixel shadows
- excessive hover glow

### HUD / navigation

The HUD can remain, but it should feel like a system navigation rail, not a game HUD.

Use labels such as:

- Online
- Profile
- Matrix
- Timeline
- Work
- R&D
- Roadmap
- Records
- Contact

Avoid labels such as:

- Start
- Player
- Inventory
- Mission
- Archive as game archive
- Quest
- Training
- Transmission

### Modal

The project modal should feel like a professional case-study panel.

Sections:

- Overview
- Problem / Context
- Contribution
- Stack
- Outcome / Notes
- Links

Avoid "Mission brief" and game labels.

## 11. Motion design

### Page transition

The existing staged screen-to-screen transition direction is appropriate.

Desired feel:

- screen switching
- restrained fade/mask/slide
- no visible long-page scrolling on desktop
- no bounce/elastic arcade motion
- no huge movement

### Scene motion

The scene should be an abstract system/network visual.

Allowed:

- node pulses
- edge highlights
- subtle topology shifts
- pipeline segment animation
- observability waveform

Avoid:

- spaceship movement
- rocket trails
- particle fireworks
- combat effects

### Reduced motion

When reduced motion is enabled:

- skip staged transitions
- skip node/pulse animation
- keep content visible
- allow direct section jumps

## 12. Three.js scene direction

Replace the current ship/spacecraft scene with an abstract system visualization.

Potential implementation:

- nodes as points or small planes
- edges as thin lines
- signal pulse moving through edges
- subtle layout changes per active section
- low opacity, never covering content

Section states:

- Hero: boot node activates
- About: identity/profile cluster
- Expertise: capability matrix layout
- Experience: timeline path
- Work: index grid support
- Experiments: branching prototype cluster
- Building: pipeline queue
- Education: archive nodes
- Contact: handshake pulse between two endpoints

## 13. Background motifs

Use subtle CSS motifs, not heavy assets.

Allowed:

- low-opacity grid
- terminal scan at very low opacity
- masked radial gradient
- thin architecture lines
- tiny system node dots

Avoid:

- dense stars everywhere
- many colorful plus signs
- large decorative crosses
- big glow fields
- random ornaments

## 14. Responsive behavior

### Desktop

- staged section transitions enabled
- system/network scene visible but restrained
- navigation rail visible

### Tablet

- staged transitions can remain if smooth
- reduce scene density
- two-column layouts where appropriate

### Mobile

- native scrolling preferred
- scene can be hidden or simplified
- content takes priority
- modal must remain scrollable

## 15. Accessibility

- Real buttons/links.
- Modal accessibility maintained.
- Clear focus states.
- Sufficient contrast.
- Scene visuals decorative unless explicitly labelled.
- Do not rely on animation to communicate content.

## 16. Implementation priority

1. Update docs to remove game/ship concept.
2. Replace ship/space scene with production-system node scene.
3. Update section labels and UI copy.
4. Reframe Hero/About/Expertise.
5. Reframe Experience/Currently Building.
6. Keep Selected Work structure but update labels to case-study language.
7. Final responsive and accessibility pass.
