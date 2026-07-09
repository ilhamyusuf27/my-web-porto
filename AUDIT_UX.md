# 🐛 UX Issues Audit — ilhamya.dev

> Audit date: 2026-07-09 | Reported by: Developer

---

## Issue 1 — Blank Page on Navigate to `/`, Requires Refresh

### What's happening

When you navigate **to** `/` from another page (e.g. clicking the `← Home` breadcrumb on a project detail page), the page renders blank. Only after a hard refresh does content appear.

### Root cause

The homepage CSS forces the entire page into a locked viewport:

```css
/* index.astro — line 572 */
:global(html), :global(body) { height: 100%; overflow: hidden; }
```

The project detail pages override this with:
```css
/* tomps-saas.astro, bri-box.astro, etc. — line 422 */
:global(html), :global(body) { overflow: auto; }
```

**The problem:** these are `:global` style rules. When you navigate from a project page to `/`, the project page's `overflow: auto` gets applied **after** the homepage's `overflow: hidden`. This leaves the body overflowing hidden while the `.home-reveal` IntersectionObserver never fires (elements aren't "visible" inside a zero-overflow container), so they're stuck at `opacity: 0`.

### Fix

**Option A (Recommended) — Add `data-astro-reload` to all Home links:**

```html
<!-- In all project pages crumb nav -->
<a href="/" data-astro-reload>← Home</a>
```

This forces a full page reload when navigating to `/`, bypassing the stale `:global` style state entirely.

**Option B — Scope the overflow rule, don't use `:global`:**

```css
/* Remove the :global rule on line 572 in index.astro */
/* Replace with scoped overflow on .home-shell */
.home-shell {
  height: 100svh;
  overflow: hidden; /* scoped, not :global */
}
```

Then add `overflow: auto` to `body` in `global.css` as the permanent default.

**Option C — Timeout fallback to force reveal:**

```js
// After the IntersectionObserver setup (~line 349 in index.astro)
setTimeout(() => {
  revealItems.forEach(item => {
    if (!item.classList.contains('is-visible')) {
      item.classList.add('is-visible');
    }
  });
}, 600);
```

### Priority: 🔴 Critical

---

## Issue 2 — "Projects / quest log" Panel Is Confusing

### What's happening

The `ops-panel` (panel `02`) has three unrelated elements with no visual hierarchy or purpose label:

1. **`project-stack`** — three `<a>` rows linking to individual project pages
2. **`quest-list`** — a `[ ]` / `[x]` internal todo list (portfolio meta-tasks, not real projects)
3. **`note-queue`** — three links labeled "Work projects", "Learning labs", "Ongoing builds" — all pointing to the same `/projects` URL

**Problems:**
- The `/ ` in "Projects / quest log" reads as "or", making the title ambiguous
- The quest-list items (`"Replace examples with real project data"`, etc.) are internal dev notes — visitors don't need to see them
- Three identically styled links pointing to the same URL look like three separate destinations
- There is no obvious "go to Projects" CTA — the panel should funnel visitors to `/projects`

### Fix

Remove the quest-list (dev notes) and the redundant note-queue. Simplify to a clear "Projects" snapshot with one visible call-to-action:

```html
<article class="ops-panel panel home-reveal">
  <div class="section-head">
    <span>02</span>
    <h2>Projects</h2>
    <a href="/projects" class="panel-cta">View all →</a>
  </div>

  <div class="project-stack">
    {projects.map(([type, name, stack, _, href]) => (
      <a href={href} class="project-mini">
        <span>{type}</span>
        <strong>{name}</strong>
        <small>{stack}</small>
      </a>
    ))}
  </div>

  <!-- Remove: quest-list and note-queue -->
  <!-- Add: single prominent link -->
  <a href="/projects" class="view-all-btn">Browse all projects →</a>
</article>
```

```css
.panel-cta {
  margin-left: auto;
  color: var(--mauve);
  font-family: var(--mono);
  font-size: .62rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  border: 1px solid var(--surface1);
  padding: .2rem .4rem;
}
.panel-cta:hover { border-color: var(--teal); color: var(--teal); }

.view-all-btn {
  display: block;
  margin-top: .5rem;
  padding: .38rem .6rem;
  border: 1px solid var(--mauve);
  background: rgba(203,166,247,.08);
  color: var(--rosewater);
  font-family: var(--mono);
  font-size: .68rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .1em;
  position: relative;
  z-index: 1;
}
.view-all-btn:hover {
  background: rgba(203,166,247,.18);
  transform: translateY(-1px);
}
```

**What to remove:**
- `.quest-list` entirely — `"Replace examples with real project data"` etc. are dev notes, not user-facing
- `.note-queue` with 3 identical `/projects` links — replace with one `view-all-btn`

### Priority: 🟡 High

---

## Issue 3 — `/projects` Layout Is Hard to Read

### What's happening

The `/projects` page has several readability issues:

- **2-column card grid** with equal visual weight — doesn't distinguish prominent work projects from draft/learning ones
- **3-column `section-title`** with baseline-aligned columns — eyebrow, heading, and description squished into one row, collapses awkwardly on mid-width screens
- **Category sections** (`01 / production`, `02 / practice`, `03 / now building`) only separated by a 1px border — easy to miss while scrolling
- **Font sizes extremely small**: `.58rem` labels, `.62rem` chrome, `.72rem` monospace — straining to read
- The `<h1>` is visually dominant but the content hierarchy below is flat

### Fixes

#### 3a. Switch from 2-column card grid to full-width list

Cards have equal `min-height: 210px` regardless of content. A list layout lets each project breathe and naturally distinguishes featured from draft work:

```css
/* Replace .project-grid */
.project-list {
  display: grid;
  gap: .55rem;
}

.project-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: .75rem 1.25rem;
  padding: .9rem 1rem;
  border: 1px solid rgba(180,190,254,.24);
  background: rgba(17,17,27,.54);
  align-items: start;
  cursor: pointer;
  transition: border-color 160ms ease, transform 160ms ease;
}
.project-row:hover {
  border-color: var(--mauve);
  transform: translateX(3px);
}
```

#### 3b. Stack the `section-title` vertically

```css
/* Replace the 3-col grid */
.section-title {
  display: grid;
  gap: .35rem;
  margin-bottom: 1rem;
  padding-bottom: .75rem;
  border-bottom: 1px solid var(--surface1);
}
.section-title span { color: var(--mauve); font-size: .7rem; font-family: var(--mono); }
.section-title h2  { font-size: clamp(1.1rem, 2.2vw, 1.5rem); margin: 0; }
.section-title p   { color: var(--subtext1); font-size: .9rem; max-width: 60ch; margin: 0; }
```

#### 3c. More breathing room between categories

```css
.category-stack { display: grid; gap: 1.5rem; } /* was 1rem */

.archive-section {
  padding: 1.25rem;  /* was clamp(.75rem, 2vw, 1rem) */
  border: 1px solid var(--surface1);
  background: linear-gradient(135deg, rgba(49,50,68,.42), rgba(17,17,27,.28));
}
```

#### 3d. Increase minimum font sizes

```css
.project-card p  { font-size: .9rem; line-height: 1.5; } /* was .9rem — keep */
strong           { font-size: .8rem; }  /* was .72rem */
.card-chrome span,
.card-chrome b   { font-size: .7rem; }  /* was .58rem */
h3               { font-size: 1.3rem; } /* was 1.25rem */
```

### Priority: 🟡 High

---

## Issue 4 — Cards Hard to Navigate + Unwanted Left Border Styling

### What's happening

#### 4a. Only a small link text is clickable

Current card structure:
```html
<article class="project-card">
  <div class="card-chrome">...</div>
  <h3>Project Name</h3>         <!-- not clickable -->
  <strong>stack</strong>        <!-- not clickable -->
  <p>description</p>            <!-- not clickable -->
  <a href={project.href}>Open single-page example →</a>  <!-- only this works -->
</article>
```

The whole card looks interactive but only the small bottom link navigates anywhere. Users naturally try clicking the title or the card body.

#### 4b. Left border / box-shadow reads as AI-template styling

The `box-shadow: 4px 4px 0` retro offset is fine. But a status-based `border-left` color would look like a generic Bootstrap alert card — exactly the kind of pattern the user wants to avoid.

### Fix

#### Convert the whole card to a link

```html
<!-- Replace <article class="project-card"> with <a> -->
{category.projects.map((project) => (
  <a href={project.href} class="project-card">
    <div class="card-chrome">
      <span>{project.status}</span>
      <b>{project.period}</b>
    </div>
    <h3>{project.name}</h3>
    <strong>{project.stack}</strong>
    <p>{project.description}</p>
    <!-- Remove the <a> link at the bottom -->
  </a>
))}
```

```css
/* Update to work as <a> instead of <article> */
a.project-card {
  display: grid;
  gap: .45rem;
  min-height: 180px;  /* slightly reduced from 210px */
  padding: .85rem;
  border: 1px solid rgba(180,190,254,.28);
  background: rgba(17,17,27,.54);
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 160ms ease, transform 160ms ease;
}
a.project-card:hover {
  border-color: var(--mauve);
  transform: translate(-2px, -2px);
  box-shadow: 0 0 20px rgba(203,166,247,.1);
}
```

#### Remove left border, clean up hover

```css
/* Do NOT add border-left coloring — remove from any version you add */
/* Keep the existing retro shadow if preferred, but no colored left accent */
```

#### Rename the CTA text (if keeping a visible label)

If you want a visible text hint at the bottom of the card (optional with full-card-link), rename from:

```
"Open single-page example →"
```

to:

```
"View case study →"
```

### Priority: 🟡 High

---

## Summary

| # | Issue | Root Cause | Priority | Effort |
|---|---|---|---|---|
| 1 | Blank page on navigate to `/` | `:global(overflow)` conflict between pages | 🔴 Critical | Low — add `data-astro-reload` |
| 2 | "Projects / quest log" panel confusing | 3 unrelated elements, no clear CTA | 🟡 High | Medium |
| 3 | `/projects` layout hard to read | 2-col grid, tiny fonts, flat hierarchy | 🟡 High | Medium |
| 4 | Card not fully clickable + border style | Link only on `<a>` text, not whole card | 🟡 High | Low |

## Suggested Fix Order

1. **Issue 1** — Add `data-astro-reload` to all `← Home` links (5-minute fix)
2. **Issue 4** — Convert `<article>` to `<a>`, remove border-left (30-minute fix)
3. **Issue 2** — Strip quest-list, add single CTA link to ops-panel (45-minute fix)
4. **Issue 3** — Refactor `/projects` to list layout, fix fonts (1–2 hour refactor)

---

*End of audit — generated by Antigravity · 2026-07-09*
