# 🔍 SOLID Refactoring & Tab Routing Audit — ilhamya.dev

> Audit date: 2026-07-09 | Next Iteration Audit

---

## 1. Overview of New Issues

We are addressing 6 key requirements to improve routing robustness, design layout, navigation usability, and code architecture (SOLID principles):

| Issue | Target | Resolution |
|---|---|---|
| **1. Category-specific view** | `/projects` | Remove the "All" tab. Show exactly one active category tab at a time. |
| **2. Prefetching script bug** | Router transitions | Fix the `redeclaration of const` syntax error caused by `is:inline` scripts re-running in View Transitions. |
| **3. Rename route** | `/work` → `/experience` | Rename the physical page file and update all internal navigation references. |
| **4. Redesign layout** | `/experience` | Replace the 2-column card grid with a vertical list timeline using styled dashed lines. |
| **5. Hash-based tab navigation** | `/projects` & `/experience` | Use URL hash fragments (`#`) so tabs can be deep-linked, bookmarked, and refresh-safe. |
| **6. SOLID Clean Components** | Codebase structure | Extract list items, project rows, and shared tab components to eliminate messy inline code. |

---

## 2. Deep Dive & Fix Proposals

### 2a. Issue 1 & 5 — Hash-based Tab Routing & Category-Specific views

#### Current State
- The `/projects` page displays an "All" tab by default, showing all categories at once.
- Tab toggling uses a basic class-toggle script that doesn't update the URL. If a user refreshes the page or links to `/projects#learn`, it defaults back to showing everything.

#### Fix
1. **Remove the "All" tab** from `/projects`.
2. **Assign clean category IDs** matching URL hashes:
   - `#production` (for `work` category)
   - `#practice` (for `learn` category)
   - `#building` (for `ongoing` category)
3. **Write a Hash Router** in client JS to sync tab states automatically.

```js
// The Hash Router Pattern (Shared Utility or inline script)
function initHashRouter(tabsSelector, panelsSelector, defaultHash) {
  const tabs = document.querySelectorAll(tabsSelector);
  const panels = document.querySelectorAll(panelsSelector);

  function switchTab(hash) {
    const targetHash = hash || defaultHash;
    let found = false;

    tabs.forEach(tab => {
      const isTarget = tab.getAttribute('href') === targetHash;
      tab.classList.toggle('is-active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      if (isTarget) found = true;
    });

    panels.forEach(panel => {
      const panelId = '#' + panel.dataset.category;
      panel.hidden = panelId !== targetHash;
    });

    // Fallback if hash doesn't match any tab
    if (!found && defaultHash) {
      switchTab(defaultHash);
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', () => switchTab(window.location.hash));

  // Initialize on load
  switchTab(window.location.hash);
}
```

---

### 2b. Issue 2 — Script Redeclaration Bug under View Transitions

#### Root Cause
Astro's View Transitions (`<ViewTransitions />` in `Layout.astro`) updates page DOM dynamically without a full document unload. When a page with `<script is:inline>` is loaded:
- The script executes in the global context.
- If you navigate away and come back, the script executes **again**.
- Variables declared with `const` or `let` in the root of the script trigger: `Uncaught SyntaxError: redeclaration of const tabBtns`.

#### Fix
Remove `is:inline` and use standard Astro scoped scripts wrapped in an event listener:
```astro
<script>
  // Astro automatically bundles this script and runs it once.
  // We use the 'astro:page-load' event to run page-specific logic on navigation.
  document.addEventListener('astro:page-load', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    // your safe, scoped page logic goes here...
  });
</script>
```

---

### 2c. Issue 3 — Rename `/work` to `/experience`

We will rename:
- `src/pages/work.astro` → `src/pages/experience.astro`

We will update all navigation links in the project:
1. **Topbar navigation in homepage** (`src/pages/index.astro`):
   ```html
   <a href="/experience">CV</a>
   ```
2. **Career map map-nodes in homepage** (`src/pages/index.astro`):
   ```html
   <a class={`map-node ${state}`} href="/experience" ...>
   ```

---

### 2d. Issue 4 — Redesign `/experience` into a Dashed Timeline List

#### Current State
The work/education sections are laid out as a `2-column grid` of card components:
```css
.project-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
```

#### New Design Concept
A vertical, timeline-style list layout using a single vertical dashed line on the left (or between items) with bullet points. This matches the retro terminal/HUD grid theme.

```html
<!-- Component: ExperienceItem.astro -->
<div class="timeline-item">
  <div class="timeline-badge">
    <span class="timeline-dot"></span>
  </div>
  <div class="timeline-content">
    <div class="timeline-header">
      <h3>{company}</h3>
      <span class="timeline-date">{date}</span>
    </div>
    <strong class="timeline-role">{role}</strong>
    <p class="timeline-desc">{desc}</p>
  </div>
</div>
```

```css
/* Styling for Timeline List with Dashed Lines */
.timeline-list {
  display: grid;
  gap: 1.5rem;
  position: relative;
  padding-left: 1.5rem;
}

/* Vertical dashed line */
.timeline-list::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  border-left: 1px dashed var(--surface2);
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
}

.timeline-dot {
  position: absolute;
  left: -23px;
  top: 6px;
  width: 9px;
  height: 9px;
  background: var(--crust);
  border: 2px solid var(--mauve);
  box-shadow: 0 0 8px var(--mauve);
  transform: rotate(45deg);
}

.timeline-content {
  border: 1px solid var(--surface1);
  background: rgba(49, 50, 68, 0.2);
  padding: 1rem 1.25rem;
  transition: border-color 140ms ease;
}

.timeline-content:hover {
  border-color: var(--mauve);
}
```

---

### 2e. Issue 6 — SOLID Refactoring with Reusable Astro Components

To make the codebase maintainable and clean, we will extract inline markup into standalone components:

1. **`src/components/ProjectRow.astro`**
   Handles rendering a single project row in `/projects`.
   Adheres to Single Responsibility Principle (SRP).

2. **`src/components/ExperienceItem.astro`**
   Handles rendering a single work or education timeline node.

3. **`src/components/TabNav.astro`**
   Generates the tab list header with count badges automatically, ensuring DRY (Don't Repeat Yourself) code for tab menus.

---

## 3. Recommended Implementation Steps

1. **Rename the file:**
   Move `src/pages/work.astro` to `src/pages/experience.astro`.

2. **Create the Components:**
   - Create [ExperienceItem.astro](file:///home/lyammm/Documents/projects/personal/my-web-porto/src/components/ExperienceItem.astro)
   - Create [ProjectRow.astro](file:///home/lyammm/Documents/projects/personal/my-web-porto/src/components/ProjectRow.astro)
   - Create [TabNav.astro](file:///home/lyammm/Documents/projects/personal/my-web-porto/src/components/TabNav.astro)

3. **Refactor `/projects` (`src/pages/projects/index.astro`):**
   - Clean up frontmatter to use `ProjectRow` and `TabNav`.
   - Remove `<script is:inline>` and use standard `<script>` with `'astro:page-load'` and hash state.

4. **Refactor `/experience` (`src/pages/experience.astro`):**
   - Clean up frontmatter to use `ExperienceItem` and `TabNav`.
   - Implement vertical dashed timeline styling.
   - Use standard `<script>` with `'astro:page-load'` and hash state.

5. **Update Navigation Links:**
   - Replace `/work` with `/experience` in `src/pages/index.astro` and check other files.

---

*End of audit — generated by Antigravity · 2026-07-09*
