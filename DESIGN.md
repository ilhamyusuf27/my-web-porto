# DESIGN: Retro Pixel Space Portfolio

## 1. Design Direction

The website should feel like a retro pixel-art space game interface, but it must still work as a professional developer portfolio. The visual design should combine game HUD panels, pixel borders, starfield backgrounds, low-poly or pixel-styled space assets, and clean readable content.

The design must not feel childish. It should feel playful, technical, and memorable.

## 2. Core Concept

The visitor enters the website like starting a retro game mission. A rocket/spacecraft guides the visitor through each section. Each scroll movement feels like moving to the next game level or mission stage.

Main metaphor:

- Hero: Start screen
- About: Player profile
- Skills: Inventory
- Experience: Mission log
- Projects: Mission archive
- Experimental projects: Lab / test chamber
- Ongoing projects: Active quests
- Education: Training records
- Contact: Final transmission

## 3. Visual Principles

1. Retro first, readable always.
2. Pixel UI elements should support the content, not hide it.
3. Use motion to guide attention, not distract.
4. Keep large sections cinematic with enough breathing space.
5. Use icons instead of emoji.
6. Prefer custom SVG/pixel icons or icon-library icons with a consistent stroke weight.
7. Every section should have a clear visual identity but remain part of the same space journey.

## 4. Color Palette

Use the supplied palette as CSS variables.

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

## 5. Color Usage

### Background

- Main background: `--crust` or `--mantle`
- Section panels: `--base`
- Cards: `--surface-0`
- Elevated cards: `--surface-1`
- Borders: `--surface-2` or accent colors

### Text

- Main text: `--text`
- Secondary text: `--subtext-1`
- Muted text: `--subtext-0`
- Disabled text: `--overlay-0`

### Accents

- Primary action: `--mauve`
- Secondary action: `--blue`
- Success/status: `--green`
- Warning/active mission: `--yellow` or `--peach`
- Danger/error: `--red`
- Interactive hover glow: `--sky` or `--teal`

## 6. Typography

### Recommended Pairing

- Heading / game labels: pixel-style font such as "Press Start 2P", "Pixelify Sans", or another self-hosted pixel font.
- Body: Inter, Geist, or system sans-serif.
- Code/stack chips: JetBrains Mono or a readable monospace font.

### Rules

- Do not use pixel font for long body text.
- Use uppercase sparingly for HUD labels and small headings.
- Body text should stay between 16px and 18px on desktop.
- Avoid line lengths longer than 70 characters.

## 7. Layout System

### Page Layout

- One-page vertical scroll.
- Each section uses `min-height: 100vh`.
- Section content is centered in a max-width container.
- Use CSS scroll snap or GSAP snap.
- Avoid placing important content behind the rocket scene.

### Suggested Section Layout

```txt
+--------------------------------------------------+
| HUD nav / progress                               |
|                                                  |
|  [section label]                                 |
|  Large title                                     |
|  Short description                               |
|                                                  |
|  Primary content panel       Rocket / scene      |
|  Secondary cards             Floating elements   |
|                                                  |
+--------------------------------------------------+
```

## 8. Component Design

### Pixel Button

Use for CTAs and modal actions.

Visual details:

- Hard border: 2px
- No soft border radius or only small radius
- Pixelated shadow offset
- Hover: slight translate and accent glow
- Focus: clear outline

States:

- Default
- Hover
- Active/pressed
- Disabled
- Focus-visible

### Pixel Card

Use for skills, projects, experience items.

Visual details:

- Background: `--surface-0`
- Border: 1px or 2px solid `--surface-2`
- Accent corner or top border
- Optional small HUD label
- Minimal glow only on hover

### HUD Navigation

Position:

- Desktop: fixed left or top
- Mobile: bottom compact nav or hidden behind menu button

Content:

- Section icon
- Section label
- Active section indicator
- Scroll progress

### Project Modal

Visual style:

- Looks like an opened mission file.
- Use dark overlay.
- Modal frame should use pixel border.
- Header includes project title, status, and close button.
- Content uses clear sections: overview, contribution, stack, links.

## 9. Icon Direction

Use icons instead of emoji. Recommended icons:

- Rocket / spaceship: hero, scroll guide
- User / ID card: about
- Code brackets: skills
- Briefcase: experience
- Folder / archive: projects
- Flask / lab: experimental
- Activity / progress: ongoing
- Graduation cap: education
- Mail / send: contact
- External link: project links
- GitHub: repository links

Icon style:

- Stroke icons with 1.5px to 2px stroke
- Consistent sizing
- Use accent colors but avoid too many colors per card

## 10. Section Design Details

### 10.1 Hero / Start Screen

Theme: Game start screen.

Elements:

- Large pixel title
- Subtitle with role
- CTA buttons
- Small command prompt style text
- Rocket scene visible
- Starfield/parallax background

Suggested copy layout:

```txt
ILHAM YUSUF
Frontend Developer / Fullstack-Capable Developer
Building interactive, performant, and maintainable web experiences.
[Start Mission] [View Projects]
```

### 10.2 About / Player Profile

Theme: Character profile card.

Elements:

- Pixel avatar or portrait frame
- Short bio
- Stats cards:
  - Frontend
  - WordPress
  - Fullstack
  - UI Animation

### 10.3 Skills / Inventory

Theme: Inventory grid.

Elements:

- Skill categories as item slots
- Stack chips
- Active skill highlight
- Optional hover tooltip

### 10.4 Experience / Mission Log

Theme: Chronological mission log.

Elements:

- Timeline line
- Company cards
- Role and period
- Highlight bullets using icon markers, not emoji

### 10.5 Projects / Mission Archive

Theme: Select mission screen.

Elements:

- Filter tabs: All, Work, Personal, WordPress, Fullstack
- Project cards
- Project status tags
- Detail modal on click

### 10.6 Experimental / Lab

Theme: Test chamber.

Elements:

- Cards styled like prototypes
- Highlight add-ons, plugins, browser tools, small apps
- "Experiment goal" and "What I learned" fields

### 10.7 Ongoing / Active Quests

Theme: Active mission board.

Elements:

- Progress bars or status indicators
- Current focus
- Next milestone

### 10.8 Education / Training Records

Theme: Academy/training terminal.

Elements:

- University card
- Certificates
- Learning path cards

### 10.9 Contact / Final Transmission

Theme: Communication terminal.

Elements:

- Closing statement
- Email button
- GitHub/LinkedIn links
- Optional resume button
- Final rocket animation exiting upward

## 11. Motion Design

### Scroll Motion

- Each section transition should feel like entering a new stage.
- Use `scrub` animation for the rocket.
- Use snap to align each full-screen section.
- Text/card reveals should be short and snappy.

### Rocket Motion

Possible motion path:

1. Hero: rocket idle floats near the title.
2. About: rocket moves to right side and rotates slightly.
3. Skills: rocket passes through floating skill chips.
4. Experience: rocket follows timeline path.
5. Projects: rocket hovers near project archive.
6. Experimental: rocket enters lab zone.
7. Ongoing: rocket moves through active quest board.
8. Education: rocket slows near academy panel.
9. Contact: rocket launches away.

### Particle Motion

- Small star particles move slowly.
- Thruster trail appears behind rocket.
- Avoid too many particles on mobile.

### Reduced Motion

When reduced motion is enabled:

- Disable scroll scrub.
- Disable particle trail.
- Keep rocket static or use a simple image.
- Keep all content visible.

## 12. 3D Art Direction

### Rocket/Ship Model

Preferred style:

- Low-poly 3D rocket or spaceship
- Flat colors
- Slight pixelated texture overlay
- Color accents from Mauve, Sky, Peach, and Green

Implementation notes:

- Use `.glb` format.
- Keep file size as small as possible.
- Use a low-poly model from Kenney Space Kit or Quaternius when possible.
- If using Poly Pizza, verify the individual asset license.
- Store model in `public/assets/models/rocket.glb`.

### Background Scene

- Starfield using Three.js points or CSS radial gradients.
- Optional low-poly planets/asteroids.
- Use parallax layers to create depth.
- Do not use a photorealistic background unless it is heavily stylized.

## 13. CSS Patterns

### Full Screen Section

```css
.section {
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  scroll-snap-align: start;
  overflow: hidden;
}
```

### Pixel Border Card

```css
.pixel-card {
  background: var(--surface-0);
  color: var(--text);
  border: 2px solid var(--surface-2);
  box-shadow: 6px 6px 0 var(--crust);
}
```

### Pixel Button

```css
.pixel-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--mauve);
  color: var(--crust);
  border: 2px solid var(--text);
  box-shadow: 4px 4px 0 var(--crust);
  font-weight: 700;
  text-transform: uppercase;
}

.pixel-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--crust);
}
```

### Scanline Overlay

```css
.scanlines::after {
  content: '';
  pointer-events: none;
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.025),
    rgba(255, 255, 255, 0.025) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: screen;
}
```

## 14. Responsive Design

### Desktop

- Full animation enabled.
- Rocket/Three.js scene visible.
- HUD nav fixed.
- Project cards use grid layout.

### Tablet

- Keep section snapping.
- Reduce particle count.
- Reduce 3D model scale.
- Use two-column project grid.

### Mobile

- Consider disabling strict scroll snapping.
- Use simpler rocket animation.
- Use stacked layouts.
- Keep modal content scrollable.
- Use smaller heading sizes.

## 15. Accessibility Requirements

- All buttons must be real `button` or `a` elements.
- Modal must have correct `role="dialog"` and `aria-modal="true"`.
- Modal close button must have an accessible label.
- Decorative icons should use `aria-hidden="true"`.
- Informative icons must have accessible text.
- Respect `prefers-reduced-motion`.
- Keep text contrast high.
- Do not make essential content only appear after animation.

## 16. Performance Requirements

- Lazy-load the Three.js scene if possible.
- Optimize `.glb` model.
- Compress images.
- Use CSS for simple decorations instead of heavy images.
- Avoid many large textures.
- Keep particle count reasonable.
- Use `requestAnimationFrame` carefully.
- Dispose Three.js resources when needed.

## 17. Interaction States

### Buttons

- Default
- Hover
- Active
- Focus-visible
- Disabled

### Cards

- Default
- Hover
- Focus-visible
- Selected/open

### Project Modal

- Closed
- Opening
- Open
- Closing

### HUD Navigation

- Default
- Active section
- Hover
- Focus-visible

## 18. Asset List

Recommended initial assets:

```txt
public/assets/models/rocket.glb
public/assets/images/avatar/pixel-avatar.png
public/assets/images/projects/*.webp
public/assets/textures/noise.png
public/assets/sprites/particle-star.svg
public/assets/icons/*.svg
public/assets/fonts/pixel-heading.woff2
```

## 19. Do and Do Not

### Do

- Use icons instead of emoji.
- Keep content readable.
- Keep interactions meaningful.
- Use the palette consistently.
- Use pixel details intentionally.
- Optimize all assets.

### Do Not

- Do not turn every text block into pixel font.
- Do not use too many glow effects.
- Do not block scroll with fragile custom logic.
- Do not use unclear asset licenses.
- Do not use huge 3D models.
- Do not make project details inaccessible behind hover-only states.


## Updated Visual Direction

The design direction is:

Elegant dark developer portfolio with subtle retro pixel-space influence.

The portfolio must not look like a colorful arcade UI. It should feel technical, premium, calm, and professional while still having personality.

### Reference Folder

Use `/references` as the visual source of truth.

Before making visual changes, inspect the reference images/videos in `/references` and extract:

- spacing
- typography mood
- color restraint
- composition
- density
- motion feeling
- pixel treatment
- object style

Do not copy the references exactly. Use them to guide the mood and quality bar.

### Visual Keywords

Use:

- dark
- elegant
- technical
- cinematic
- restrained
- pixel-detailed
- space-inspired
- professional

Avoid:

- childish
- colorful arcade
- toy rocket
- rainbow borders
- excessive ornaments
- excessive glow
- fake dashboard metrics
- generic AI-generated card style

### Color Usage

Use Catppuccin Mocha as the base.

Main background:

- Crust `#11111b`
- Mantle `#181825`
- Base `#1e1e2e`
- Surface0 `#313244`

Text:

- Text `#cdd6f4`
- Subtext1 `#bac2de`
- Subtext0 `#a6adc8`

Primary accent:

- Mauve `#cba6f7`

Secondary accent, only when necessary:

- Blue `#89b4fa`
- Sky `#89dceb`

Do not use many accent colors at the same time. Green, yellow, peach, pink, and red should only be used for meaningful states such as status, warning, or small badges.

### Ornament Rules

Reduce ornaments aggressively.

Allowed:

- subtle stars
- very low-opacity scanline/noise
- small HUD labels
- minimal sidebar indicators
- small pixel details

Avoid:

- many colorful plus signs
- random bright stars
- large decorative crosses
- excessive dashed lines
- heavy glow behind every object
- colorful borders on every card

### Card Style

Cards should be neutral and professional.

Use:

- dark translucent surface
- subtle neutral border
- clean hierarchy
- limited accent usage
- small status badge

Avoid:

- different border color for every card
- thick colorful outlines
- glowing card edges
- overused pixel shadow

### Typography

Use clean typography for professional content.

Recommended:

- Headings: Space Grotesk, Sora, Geist, or similar geometric sans
- Body: JetBrains Mono or IBM Plex Mono
- Pixel font: only for small HUD labels, section numbers, and tiny metadata

Do not use a playful pixel font for large hero text or long body content.

### Skills Display

Do not use numeric progress bars for skills.

Use grouped skill cards instead:

- Daily use
- Comfortable
- Currently learning
- Experimental

Or use technical categories:

- Frontend
- Backend
- WordPress
- Animation/UI
- DevOps/Tools
- Data/API

### Spacecraft Direction

Rename the visual concept from "rocket" to "spacecraft" or "ship".

The ship should feel inspired by Space Impact, not a cartoon rocket.

Preferred implementation:

1. Pixel-art sprite or sprite sheet for the clearest pixel result.
2. Three.js only if the result can be made angular, pixelated, and mature.
3. Avoid classic toy rocket shape.

The ship should be smaller, more restrained, and should support the layout instead of dominating the page.
