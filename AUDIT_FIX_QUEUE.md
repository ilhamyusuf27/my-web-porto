# 🛠 Fix Queue Audit — ilhamya.dev

> Audit date: 2026-07-09 · All previous issues resolved ✅

---

## Issue 1 — Duplicate "View All" Buttons in Homepage Projects Panel

### What's happening

The `ops-panel` on the homepage has **two links pointing to the same `/projects` URL**:

```html
<!-- index.astro — line 200 -->
<div class="section-head panel-head-link">
  <span>02</span>
  <h2>Projects</h2>
  <a href="/projects" class="panel-cta">View all →</a>   ← button 1
</div>
<!-- ... project rows ... -->
<a href="/projects" class="view-all-btn">Browse all projects →</a>   ← button 2
```

Both navigate to `/projects`. One should be removed.

### Which one to keep

Keep **`panel-cta` (header "View all →")** — it's compact, sits in the panel header, and is always visible without scrolling. Remove the larger `view-all-btn` at the bottom.

The header link is the right pattern here: it mirrors how other panels are navigated (the topbar nav links work the same way) and doesn't take up extra vertical space inside the panel.

### Fix

**File:** [`src/pages/index.astro`](../src/pages/index.astro) — line ~211

```diff
- <a href="/projects" class="view-all-btn">Browse all projects →</a>
```

Also remove the `.view-all-btn` CSS block (search for `.view-all-btn` in the `<style>` section).

### Priority: 🟢 Low — cosmetic, 2-minute fix

---

## Issue 2 — Poor Category Wording in `/projects` Data File

### What's happening

The three category titles in [`src/data/projects.ts`](../src/data/projects.ts) (lines 234, 241, 265) use awkward phrasing:

| Current | Problem |
|---|---|
| `"Project from work"` | Grammatically odd, sounds like broken English |
| `"Project for learn"` | Same — "for learn" is not natural English |
| `"Project on going"` | "on going" should be "ongoing", and still sounds passive |

These show directly in the `<h2>` of each section on `/projects`.

### Proposed rewording

| Current | Proposed |
|---|---|
| `"Project from work"` | `"Work & Freelance"` |
| `"Project for learn"` | `"Learning & Side Projects"` |
| `"Project on going"` | `"In Progress"` |

Or if you want to keep the Catppuccin/HUD terminal aesthetic tone:

| Current | Proposed (terminal-flavored) |
|---|---|
| `"Project from work"` | `"Production"` |
| `"Project for learn"` | `"Practice"` |
| `"Project on going"` | `"Building Now"` |

The eyebrow labels (`01 / production`, `02 / practice`, `03 / now building`) already use the cleaner terminal style — the `title` field should match that register.

### Fix

**File:** [`src/data/projects.ts`](../src/data/projects.ts)

```diff
- title: "Project from work",
+ title: "Production",

- title: "Project for learn",
+ title: "Practice",

- title: "Project on going",
+ title: "Building Now",
```

### Priority: 🟢 Low — copy edit, 2-minute fix

---

## Issue 3 — `/projects` Shows All Categories at Once — Add Tabs

### What's happening

Currently `/projects` renders all three categories (`work`, `learn`, `ongoing`) stacked vertically in a single scroll. The user sees everything at once with no way to filter. The `hero-actions` links at the top are anchor jumps, not tabs — clicking them scrolls to a section rather than hiding the others.

For a recruiter or visitor, this means they always see the "Learning labs" and "In Progress" sections even if they only care about work projects.

### Fix — Client-side tab filter (no page reload)

Replace the anchor-jump `hero-actions` with tab buttons that show/hide category sections using a small script. No framework needed — plain JS attribute toggle.

#### HTML changes (in `src/pages/projects/index.astro`)

```html
<!-- Replace the hero-actions anchor links -->
<div class="tab-bar" role="tablist" aria-label="Project categories">
  <button
    class="tab-btn is-active"
    role="tab"
    data-tab="all"
    aria-selected="true"
  >All <b>{categories.reduce((n, c) => n + c.projects.length, 0)}</b></button>
  {categories.map((category) => (
    <button
      class="tab-btn"
      role="tab"
      data-tab={category.id}
      aria-selected="false"
    >
      {category.title} <b>{category.projects.length}</b>
    </button>
  ))}
</div>

<!-- Add data-category to each section -->
<div class="category-stack">
  {categories.map((category) => (
    <section class="archive-section" id={category.id} data-category={category.id}>
      ...
    </section>
  ))}
</div>
```

#### Script (add inside `<script>` at bottom of the page)

```js
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.archive-section[data-category]');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update active tab
    tabBtns.forEach(b => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });

    // Show/hide sections
    sections.forEach(section => {
      const match = tab === 'all' || section.dataset.category === tab;
      section.hidden = !match;
    });

    // Scroll to top of card
    document.querySelector('.page-card')?.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
```

#### CSS additions

```css
/* Tab bar */
.tab-bar {
  display: flex;
  flex-wrap: wrap;
  gap: .42rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: .42rem;
  padding: .48rem .72rem;
  border: 1px solid var(--surface1);
  background: rgba(17,17,27,.62);
  color: var(--subtext0);
  font-family: var(--mono);
  font-size: .68rem;
  text-transform: uppercase;
  letter-spacing: .1em;
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(17,17,27,.38);
  transition: border-color 140ms ease, color 140ms ease, transform 140ms ease;
}

.tab-btn b {
  min-width: 1.35rem;
  padding: .1rem .28rem;
  border: 1px solid rgba(148,226,213,.32);
  color: var(--teal);
  text-align: center;
  font-size: .6rem;
}

.tab-btn:hover {
  border-color: var(--mauve);
  color: var(--rosewater);
  transform: translate(-2px, -2px);
}

.tab-btn.is-active {
  border-color: var(--mauve);
  background: rgba(203,166,247,.12);
  color: var(--rosewater);
  box-shadow: 0 0 16px rgba(203,166,247,.1), 3px 3px 0 rgba(17,17,27,.38);
}

/* Remove hero-actions (replaced by tab-bar) */
/* .hero-actions { ... } — delete or keep for mobile fallback */
```

> **Note:** Remove or repurpose the old `.hero-actions` div — the tabs replace it.

### Priority: 🟡 High — UX improvement, ~1 hour

---

## Issue 4 — `/work` Page Needs Renaming and Tab Separation

### What's happening

The `/work` page (`work.astro`) currently:
- Is accessed via the topbar nav link labeled `"CV"` pointing to `/work`
- Has the `<title>` `"Work experience"` set in `Layout`
- Has the breadcrumb label `"CV archive"`
- Has the page `<h1>` `"Work history, education, and skills from my CV."`
- Stacks Work Experience and Education as two sequential `<section>` blocks — **no tabs**, no way to jump between them without scrolling

The naming is inconsistent: the nav says "CV", the title says "Work experience", the breadcrumb says "CV archive", and the `href` is `/work`. A visitor doesn't know if this is a CV download, a work history page, or both.

### Recommendations

#### 4a. Rename the page and nav label consistently

Pick one name and use it everywhere. Recommendation: **"CV"** (clear, professional, one word).

| Location | Current | Fix |
|---|---|---|
| Topbar nav link text | `CV` | ✅ Already correct |
| Page URL | `/work` | Keep as-is (changing breaks links) |
| `<title>` in Layout call | `"Work experience"` | → `"CV — Ilham Yusuf"` |
| Breadcrumb `<span>` | `CV archive` | → `CV` |
| Page `<h1>` | `"Work history, education, and skills from my CV."` | → `"Experience & Education"` |
| Header `<p>` eyebrow | `"Experience map data"` | → `"Career overview"` |

#### 4b. Add tabs to separate Work and Education

Same tab pattern as Issue 3. Add two tabs: **Work** and **Education**.

```html
<!-- work.astro — replace the two stacked <section> blocks -->
<div class="tab-bar" role="tablist" aria-label="CV sections">
  <button class="tab-btn is-active" role="tab" data-tab="work" aria-selected="true">
    Work <b>{experiences.length}</b>
  </button>
  <button class="tab-btn" role="tab" data-tab="education" aria-selected="false">
    Education <b>{education.length}</b>
  </button>
</div>

<section class="archive-section" data-tab-panel="work">
  <div class="project-grid">
    {experiences.map(([company, role, date, desc]) => (
      <article>
        <span>{date}</span>
        <h3>{company}</h3>
        <strong>{role}</strong>
        <p>{desc}</p>
      </article>
    ))}
  </div>
</section>

<section class="archive-section" data-tab-panel="education" hidden>
  <div class="project-grid compact">
    {education.map(([school, role, date, desc]) => (
      <article>
        <span>{date}</span>
        <h3>{school}</h3>
        <strong>{role}</strong>
        <p>{desc}</p>
      </article>
    ))}
  </div>
</section>
```

```js
// Script for work.astro tabs
const tabs = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('[data-tab-panel]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => {
      t.classList.toggle('is-active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });

    panels.forEach(panel => {
      panel.hidden = panel.dataset.tabPanel !== target;
    });
  });
});
```

> The tab + panel CSS from Issue 3 applies here identically — share or copy it.

### Priority: 🟡 High — naming + UX, ~1 hour

---

## Issue 5 — `/work` Forces Users to Scroll Through All Content

### What's happening

The `/work` page uses `min-height: 100svh; display: grid; place-items: center;` for `.page-shell` but the `.page-card` content can grow beyond the viewport. Currently:

- The Work Experience section has **4 cards** in a 2-column grid
- The Education section has **2 cards**
- Stacked together they easily exceed one viewport height
- There is no sticky header, no "back to top", and no visual cue that more content is below

This is the same overflow issue as the homepage (Issue 1 from previous audit), but applied differently — here the content is just too long for a single view, not a rendering bug.

### Fix — Two-part approach

#### 5a. Cap the page-card height and make it scroll internally

Instead of the page itself scrolling, confine scrolling to inside the `.page-card`:

```css
/* work.astro <style> */

/* Make the shell fill exactly the viewport */
.page-shell {
  height: 100svh;
  overflow: hidden;           /* ← prevent page scroll */
  display: grid;
  place-items: center;
  padding: clamp(1rem, 3vw, 2rem);
}

/* Give the card a max-height and internal scroll */
.page-card {
  width: min(100%, 1080px);
  max-height: calc(100svh - 4rem);  /* ← constrained to viewport */
  overflow-y: auto;                  /* ← card scrolls internally */
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--mauve) rgba(49,50,68,.34);
  border: 1px solid var(--border);
  background: rgba(30,30,46,.88);
  padding: clamp(1rem, 3vw, 2rem);
  box-shadow: 0 24px 80px rgba(0,0,0,.36);
}
```

#### 5b. This becomes irrelevant with tabs (Issue 4)

With tabs added (Issue 4), Work shows 4 cards and Education shows 2 cards — each tab's content fits in a single viewport at most screen sizes, making the scroll cap less critical. Prioritise Issue 4 first.

If tabs are implemented, the page-card height cap is still useful as a safety net for smaller screens.

#### 5c. Also apply the same pattern to `/projects`

The same scroll issue applies to `/projects` — with tabs active only one category shows at a time, so the content is shorter. But without tabs, the three categories stack and require scrolling. The tab fix (Issue 3) resolves this naturally.

### Priority: 🟡 Medium — resolves naturally after Issue 3 & 4

---

## Summary

| # | Issue | File | Priority | Effort |
|---|---|---|---|---|
| 1 | Duplicate "View All" / "Browse All Projects" buttons | `index.astro` line ~211 | 🟢 Low | 2 min |
| 2 | Bad category wording ("Project from work", "for learn", "on going") | `src/data/projects.ts` lines 234, 241, 265 | 🟢 Low | 2 min |
| 3 | `/projects` shows all categories at once — needs tabs | `pages/projects/index.astro` | 🟡 High | ~1 hr |
| 4 | `/work` needs page rename + tab layout (Work / Education) | `pages/work.astro` | 🟡 High | ~1 hr |
| 5 | `/work` forces full-page scroll — cap height and scroll internally | `pages/work.astro` CSS | 🟡 Medium | 20 min (after Issue 4) |

## Suggested Fix Order

1. **Issues 1 & 2** — Copy edits, do together in 5 minutes
2. **Issue 3** — Add tabs to `/projects` (tab bar + show/hide script)
3. **Issue 4** — Rename + add tabs to `/work` (reuse same tab component)
4. **Issue 5** — Add `max-height` + `overflow-y: auto` to `.page-card` on `/work`

---

*End of audit — generated by Antigravity · 2026-07-09*
