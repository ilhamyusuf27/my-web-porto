# SECTION_STYLES: Section-by-Section Scene Direction

This file defines how each section should feel visually. The goal is to avoid a boring repeated dark-space layout while keeping the same professional retro-space identity.

The site should feel like a cinematic developer portfolio journey, not a colorful arcade dashboard. Every section must have its own environment, composition, and spacecraft role, while still sharing the same dark Catppuccin palette, neutral cards, mauve accent, readable typography, and restrained pixel details.

## Global scene rules

- Professional first; retro/pixel-space second.
- Keep Catppuccin dark colors as the foundation.
- Use Mauve `#cba6f7` as the primary accent.
- Use Blue/Sky only for subtle technical highlights.
- Do not use new random colors to make sections feel different.
- Do not add excessive stars, plus signs, glows, explosions, weapons, shields, or arcade effects.
- Create variety using layout, density, panel shape, background motif, section composition, and spacecraft placement.
- Keep each main section `min-height: 100vh`.
- Preserve the staged screen-to-screen transition architecture.
- The spacecraft is the continuity object, not the main content.
- The spacecraft must never cover important text, cards, or CTAs.
- Reduced-motion users must get a stable readable version without animated scene dependency.

## Section map

| Section | Scene concept | Main feeling | Background motif | Spacecraft role |
|---|---|---|---|---|
| Intro | Launch Console | clear, confident, minimal | sparse terminal grid | ready to depart |
| About | Cockpit / Pilot Profile | personal, capable, grounded | cockpit/radar scan | parked beside profile |
| Expertise | Toolkit Bay | practical, organized, technical | inventory/grid slots | passes through tool bay |
| Experience | Flight Path / Career Route | chronological, reliable | route line/checkpoints | follows career path |
| Selected Work | Mission Archive / Gallery | curated, case-study focused | archive/browser frame | supports gallery depth |
| Experiments | Research Lab | exploratory, prototype-driven | lab notes/scanner grid | observes test bench |
| Currently Building | Construction Bay | active, in-progress, focused | build queue/dock rails | docked near active work |
| Education | Archive / Records Room | quiet, credentialed, factual | record rail/index | low presence/background |
| Contact | Transmission / Docking Bay | decisive, final CTA | signal panel/docking line | arrives or sends signal |

---

## 1. Intro — Launch Console

### Purpose
Create a strong first impression and immediately communicate name, role, and CTA.

### Visual vibe
- Minimal launch terminal.
- Sparse, premium, dark.
- Large typography with a small command-line detail.
- The user should feel like the portfolio is starting, not like a game menu.

### Layout direction
- Left-focused hero content.
- Name and role remain the main focal point.
- Keep CTA buttons close to the intro copy.
- Keep status cards compact and secondary.

### Background motif
- Very subtle terminal grid or launch-line detail.
- Sparse stars only.
- No colorful crosses or decorative noise.

### Spacecraft role
- Positioned away from the main name/CTA.
- Reads as ready to depart.
- Subtle idle movement only.

### Avoid
- Big decorative rocket moment.
- Too many status cards.
- Arcade “press start” feeling.

---

## 2. About — Cockpit / Pilot Profile

### Purpose
Explain who Ilham is and why frontend/fullstack capability matters.

### Visual vibe
- Cockpit profile screen.
- Personal but still technical.
- Stronger identity than generic cards.

### Layout direction
- One dominant profile/capability panel.
- Supporting capability cards arranged like cockpit readouts.
- Use hierarchy: bio first, details second, capability tags third.

### Background motif
- Subtle radar circle, cockpit grid, or scanline panel behind content.
- Motif must be low opacity and not decorative clutter.

### Spacecraft role
- Parked beside or behind the cockpit panel.
- Should not compete with profile copy.

### Avoid
- Fake skill percentages.
- Player-profile language as main heading.
- Floating cards without a composition anchor.

---

## 3. Expertise — Toolkit Bay

### Purpose
Show practical tools and current working capability.

### Visual vibe
- Developer toolkit inventory.
- Organized modules, not RPG inventory.
- Functional and scannable.

### Layout direction
- Grouped skill cards by practical usage or domain.
- Cards may feel like slots/modules, but keep the style professional.
- Each group should have a small icon and compact chip list.

### Background motif
- Subtle technical grid or tool-bay rails.
- Slightly more structured than Intro/About.

### Spacecraft role
- Small visual guide moving across the bay.
- Do not place it over skill chips.

### Avoid
- Numeric progress bars.
- Too many icons per card.
- Color-coded card borders.

---

## 4. Experience — Flight Path / Career Route

### Purpose
Show career growth and reliability through real roles.

### Visual vibe
- Mission route / flight path.
- Chronological, stable, professional.

### Layout direction
- Timeline should feel like a route with checkpoints.
- Job cards can be connected by a subtle rail or waypoint system.
- Most recent role should have strongest visual weight.

### Background motif
- Subtle route line, waypoint dots, or map-like grid.
- Keep text-heavy content readable.

### Spacecraft role
- Aligns with the route concept.
- Can appear near the current/active role, but must not overlap job text.

### Avoid
- Making every experience card identical.
- Overusing “mission log” language.
- Excessive timeline decoration.

---

## 5. Selected Work — Mission Archive / Gallery

### Purpose
Present the strongest portfolio projects and open detail modals.

### Visual vibe
- Curated archive/gallery.
- This should remain one of the most content-dense and useful sections.

### Layout direction
- Keep the project grid as the core structure.
- Project cards should read like case-study entries, not game cards.
- Modal should feel like a professional case-study popup.

### Background motif
- Archive browser, file index, or gallery frame.
- Keep motif subtle because project screenshots already carry visual weight.

### Spacecraft role
- Secondary depth element.
- It can sit behind/near the grid but must not cover cards.

### Avoid
- Rebuilding this section unless necessary.
- Adding more game labels.
- Increasing visual noise around project screenshots.

---

## 6. Experiments — Research Lab

### Purpose
Show prototypes, browser add-ons, tools, and learning experiments.

### Visual vibe
- Research lab / prototype bench.
- More exploratory than Selected Work.

### Layout direction
- Use lab-note cards or two-column experiment/result cards.
- Show “goal”, “learned”, and “stack” clearly.
- It should not look like another project grid.

### Background motif
- Lab scanner line, faint measurement grid, or test-bench frame.
- Keep it restrained.

### Spacecraft role
- Observing the lab or moving diagonally through the scene.
- Lower visual priority than content.

### Avoid
- Explosions, weapons, or arcade laboratory effects.
- Reusing the exact Selected Work card rhythm.

---

## 7. Currently Building — Construction Bay

### Purpose
Show active learning/building direction and current focus.

### Visual vibe
- Build queue / construction dock.
- Focused, in-progress, technical.

### Layout direction
- Cards can look like active tickets, build queue items, or dock modules.
- Show current status, next step, and why it matters.
- Use progress indicators only when they communicate real status; avoid fake skill-like metrics.

### Background motif
- Dock rails, build queue line, or subtle construction grid.
- No warning-stripe overload.

### Spacecraft role
- Docked or passing through the build bay.
- Subtle movement; do not dominate.

### Avoid
- Too much yellow/orange.
- Fake progress bars without meaning.
- Making it feel like a task-management dashboard.

---

## 8. Education — Archive / Records Room

### Purpose
Show formal education and credentials clearly.

### Visual vibe
- Quiet record archive.
- Stable, factual, low-noise.

### Layout direction
- Credential timeline or record cards.
- Certificates index can sit in a secondary panel.
- Keep spacing compact and readable.

### Background motif
- Archive rail, record lines, or subtle document index.
- This should be one of the calmer sections.

### Spacecraft role
- Minimal presence.
- Should feel like it slows down or passes behind the archive.

### Avoid
- Over-designing credentials.
- Too many badges.
- Making education feel like a game achievement screen.

---

## 9. Contact — Transmission / Docking Bay

### Purpose
End with a strong CTA and frictionless contact path.

### Visual vibe
- Final transmission / docking bay.
- Calm, decisive, useful.

### Layout direction
- Main CTA should be prominent.
- Direct email and social links should be easy to find.
- Contact details can be presented as a signal/direct panel.

### Background motif
- Transmission line, signal grid, docking marker, or final route endpoint.
- Keep the ending clean and memorable.

### Spacecraft role
- Arrives, docks, or sends a signal.
- It should support the final CTA, not act as decoration only.

### Avoid
- Empty ending screen.
- Overly gamey “final transmission” copy.
- Large decorative launch effects.

---

## Implementation priority for section variety

Implement section identities gradually. Do not redesign every section in one pass.

1. Document section identities and constraints.
2. Apply scene identity to About + Expertise first.
3. Apply route/dock identity to Experience + Currently Building.
4. Apply final composition to Contact.
5. Revisit spacecraft section positions after layouts are stable.
6. Only then consider optional micro-effects.

## Acceptance checklist

A section is not complete until:

- It has a distinct scene concept.
- It uses the shared palette without adding random colors.
- It has a different composition or motif from adjacent sections.
- It does not rely on extra ornaments for personality.
- The spacecraft has a clear role or is intentionally quiet.
- The content remains more important than the scene.
- It works on short laptop viewports and mobile.
