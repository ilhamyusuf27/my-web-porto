---
version: alpha
name: Ilhamya Portfolio HUD
description: A dark Catppuccin Mocha portfolio interface with pixel-art details, terminal/HUD panels, and compact recruiter-focused information density.
colors:
  primary: "#CDD6F4"
  secondary: "#BAC2DE"
  tertiary: "#CBA6F7"
  neutral: "#11111B"
  rosewater: "#F5E0DC"
  flamingo: "#F2CDCD"
  pink: "#F5C2E7"
  mauve: "#CBA6F7"
  red: "#F38BA8"
  maroon: "#EBA0AC"
  peach: "#FAB387"
  yellow: "#F9E2AF"
  green: "#A6E3A1"
  teal: "#94E2D5"
  sky: "#89DCEB"
  sapphire: "#74C7EC"
  blue: "#89B4FA"
  lavender: "#B4BEFE"
  text: "#CDD6F4"
  subtext-1: "#BAC2DE"
  subtext-0: "#A6ADC8"
  overlay-2: "#9399B2"
  overlay-1: "#7F849C"
  overlay-0: "#6C7086"
  surface-2: "#585B70"
  surface-1: "#45475A"
  surface-0: "#313244"
  base: "#1E1E2E"
  mantle: "#181825"
  crust: "#11111B"
typography:
  display:
    fontFamily: Geist
    fontSize: 6rem
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.085em"
  h1:
    fontFamily: Geist
    fontSize: 4.5rem
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.06em"
  h2:
    fontFamily: Geist
    fontSize: 0.92rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: Geist
    fontSize: 0.98rem
    fontWeight: 400
    lineHeight: 1.5
  body-compact:
    fontFamily: Geist
    fontSize: 0.76rem
    fontWeight: 400
    lineHeight: 1.34
  label:
    fontFamily: Geist Mono
    fontSize: 0.68rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.14em
  terminal:
    fontFamily: Geist Mono
    fontSize: 0.62rem
    fontWeight: 400
    lineHeight: 1
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 8px
  full: 999px
spacing:
  xxs: 4px
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
components:
  panel:
    backgroundColor: "{colors.base}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: 16px
  panel-hover:
    backgroundColor: "{colors.mantle}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: 16px
  button-primary:
    backgroundColor: "{colors.mauve}"
    textColor: "{colors.crust}"
    rounded: "{rounded.none}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.surface-0}"
    textColor: "{colors.subtext-1}"
    rounded: "{rounded.none}"
    padding: 12px
  terminal-surface:
    backgroundColor: "{colors.crust}"
    textColor: "{colors.subtext-1}"
    rounded: "{rounded.none}"
    padding: 12px
  status-chip:
    backgroundColor: "{colors.surface-0}"
    textColor: "{colors.teal}"
    rounded: "{rounded.none}"
    padding: 8px
---

## Overview

Ilhamya Portfolio HUD is a compact, dark, game-like portfolio interface. The design should feel like a Catppuccin Mocha desktop dashboard: terminal windows, pixel-art flourishes, map panels, small status chips, and dense but readable recruiter information.

The default mode is dark only. Keep the interface technical, playful, and polished rather than corporate. New UI should look like it belongs inside the current `src/pages/index.astro` HUD: square panels, sharp borders, mono labels, neon pastel accents, and subtle scan/grid effects.

## Colors

Use the Catppuccin Mocha palette already defined in `src/styles/global.css` as the source of truth.

- **Crust `#11111B`:** page background, terminal background, deep overlays.
- **Mantle `#181825` and Base `#1E1E2E`:** primary panel fills and large surfaces.
- **Surface 0–2:** nested cards, table rows, panel borders, map nodes, inputs.
- **Text `#CDD6F4`:** default body copy and high-contrast UI text.
- **Rosewater `#F5E0DC`:** hero names, strong card titles, premium/high-emphasis copy.
- **Mauve `#CBA6F7`:** main interaction color, active borders, focus rings, primary CTA backgrounds.
- **Teal `#94E2D5`:** secondary accent for success, map education lanes, run buttons, status readouts.
- **Green `#A6E3A1`:** active/current state and positive terminal output.
- **Yellow `#F9E2AF`:** caution, terminal window dot, hover node highlight.
- **Blue/Sapphire/Sky:** supporting cool accents for glows, links, route details, and grid overlays.

Prefer translucent versions of these colors for effects: panel glows, gradients, grid lines, and hover states should use low-opacity mauve/blue/teal rather than new colors.

## Typography

Use `Geist` for normal UI text and `Geist Mono` for labels, terminal text, metadata, nav, timestamps, and status values.

- Display headings are large, tight, and slightly compressed: `line-height` under `1`, negative tracking, and max-width constraints.
- Labels are uppercase mono text with generous letter spacing. Use them for section numbers, breadcrumbs, chips, status keys, and terminal chrome.
- Body copy should stay short. Prefer compact sentences over long paragraphs; this design values quick scanning.
- Avoid mixing additional fonts. If Google Fonts are unavailable, fall back to the CSS variables in `src/styles/global.css`.

## Layout

The homepage is a single-screen HUD on desktop: a top bar, hero grid, content grid, and status footer inside a constrained desktop frame. Preserve this dashboard rhythm when adding new sections.

- Use CSS grid for major panels; avoid free-floating content unless it is decorative.
- Desktop panels should be dense and compact. Use small internal spacing and let typography hierarchy create separation.
- Mobile/secondary pages may scroll, but should keep the same panel-card language (`page-shell`, `page-card`, `archive-section`).
- Use `clamp()` for responsive sizing where possible.
- Keep background detail layered: dark base, radial glows, subtle grid, then content.

## Elevation & Depth

Depth should feel digital rather than soft/material.

- Default panels use a 1px accent border, dark translucent background, subtle inset highlight, and deep black shadow.
- Hovered panels may tilt slightly, lift by 2px, increase mauve border intensity, and show a scan-line highlight.
- Pixel-art elements should use hard shadows and square offsets instead of blur-heavy effects.
- Use glow sparingly around active elements: focus, map expansion, active nodes, and cursor-follow effects.

## Shapes

The current visual language is mostly square and pixel-like.

- Default cards, panels, buttons, inputs, terminal rows, and map labels should have no radius.
- Use tiny radius (`2px`–`4px`) only for utility overlays/tooltips where readability benefits.
- Fully rounded shapes are reserved for biological or system metaphors: avatar glasses, dots, pulses, toggles, and badges inherited from older components.
- Do not introduce large rounded marketing cards unless redesigning the entire section to match.

## Components

`panel`
: Primary building block. Use a `var(--border)` border, dark gradient fill, internal padding around `0.68rem`–`1rem`, and optional `::after` accent wash.

`panel-lite`
: Lighter chrome for topbar/footer. It should align visually with `panel` but with less padding and lower content density.

`button.primary`
: Mauve background, crust text, mono label, square border, and a hard offset blue/mauve shadow. Hover translates up-left by 2px.

`button.secondary`
: Surface fill, subtext color, same sizing as primary. Use it for lower-emphasis external links.

`terminal`
: Crust/base background, mono typography, colored prompt tokens. Keep lines short and output scannable. Command rows use green prompt markers and mauve output markers.

`status-list` / `toolbelt-list`
: Dense definition-list rows with mono keys and rosewater values. Use them for facts, skills, and compact profile data.

`map-node`
: Square node dot plus compact node card. Mauve means work/done, teal means education, green means active/current.

`page-card`
: Secondary page shell. Use the same border, base background, large shadow, and rosewater/mauve/teal text accents as the homepage.

## Do's and Don'ts

Do:

- Reuse the CSS custom properties from `src/styles/global.css` before adding new tokens.
- Keep new UI dark, compact, terminal-like, and pixel/HUD inspired.
- Use mauve for the main action/focus state and teal/green for successful or secondary system states.
- Use `Geist Mono` for all metadata and status UI.
- Preserve keyboard focus styling with a clear mauve or teal outline.
- Respect reduced-motion preferences when adding new animations.

Don't:

- Add unrelated light-theme sections without designing a complete mode switch.
- Mix in bright Tailwind default colors when a Catppuccin token exists.
- Use large border radii, soft glassmorphism cards, or generic SaaS gradients unless intentionally replacing the current style.
- Add long prose blocks to dashboard panels; create secondary pages for expanded content.
- Use low-contrast gray text on dark surfaces; choose `subtext-1`, `subtext-0`, or `text` instead.
- Place decorative animation above content readability or keyboard accessibility.
