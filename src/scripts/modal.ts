type ProjectPayload = {
  id: string;
  title: string;
  type: string;
  period: string;
  role: string;
  status: string;
  summary: string;
  problem: string | null;
  contribution: string[];
  outcomes: [string, string][];
  stack: string[];
  links: { label: string; url: string; icon?: string }[];
  accent: string;
  image: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  experimental: "Experimental",
};

/** Project detail modal: open from any [data-project-trigger], a11y-safe. */
export function initModal(): void {
  const modal = document.getElementById("project-modal");
  const dataEl = document.getElementById("project-data");
  if (!modal || !dataEl) return;

  let projects: ProjectPayload[] = [];
  try {
    projects = JSON.parse(dataEl.textContent || "[]");
  } catch {
    return;
  }

  let lastFocused: HTMLElement | null = null;

  const closeBtn = modal.querySelector<HTMLElement>("[data-modal-close]");
  const open = (id: string, trigger: HTMLElement) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    lastFocused = trigger;
    populate(modal, project);
    showModal(modal);
    window.requestAnimationFrame(() => closeBtn?.focus());
  };

  const close = () => {
    hideModal(modal);
    lastFocused?.focus();
  };

  // Triggers
  document.querySelectorAll<HTMLElement>("[data-project-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => open(trigger.dataset.projectTrigger!, trigger));
  });

  // Close interactions
  modal.querySelectorAll<HTMLElement>("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.hasAttribute("hidden") && e.key === "Escape") {
      e.preventDefault();
      close();
    }
    if (!modal.hasAttribute("hidden") && e.key === "Tab") {
      trapFocus(e, modal);
    }
  });

  initProjectFilter();
}

function populate(modal: HTMLElement, p: ProjectPayload): void {
  const setText = (field: string, value: string) => {
    const el = modal.querySelector<HTMLElement>(`[data-field="${field}"]`);
    if (el) el.textContent = value;
  };

  setText("title", p.title);
  setText("type", p.type);
  setText("status-label", STATUS_LABELS[p.status] ?? "Project");
  setText("period", p.period);
  setText("role", p.role);
  setText("summary", p.summary);

  const panel = modal.querySelector<HTMLElement>(".modal__panel");
  if (panel) panel.style.setProperty("--card-accent", `var(--${p.accent})`);

  // Problem
  const problemBlock = modal.querySelector<HTMLElement>('[data-block="problem"]');
  if (problemBlock) {
    if (p.problem) {
      setText("problem", p.problem);
      problemBlock.hidden = false;
    } else {
      problemBlock.hidden = true;
    }
  }

  // Contribution list
  const contribBlock = modal.querySelector<HTMLElement>('[data-block="contribution"]');
  const contribList = modal.querySelector<HTMLElement>('[data-field="contribution"]');
  if (contribBlock && contribList) {
    contribList.innerHTML = "";
    if (p.contribution.length) {
      p.contribution.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        contribList.appendChild(li);
      });
      contribBlock.hidden = false;
    } else {
      contribBlock.hidden = true;
    }
  }

  // Outcomes
  const outcomeBlock = modal.querySelector<HTMLElement>('[data-block="outcomes"]');
  const outcomeList = modal.querySelector<HTMLElement>('[data-field="outcomes"]');
  if (outcomeBlock && outcomeList) {
    outcomeList.innerHTML = "";
    if (p.outcomes.length) {
      p.outcomes.forEach(([k, v]) => {
        const wrap = document.createElement("div");
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.textContent = v;
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        outcomeList.appendChild(wrap);
      });
      outcomeBlock.hidden = false;
    } else {
      outcomeBlock.hidden = true;
    }
  }

  // Stack chips
  const stackEl = modal.querySelector<HTMLElement>('[data-field="stack"]');
  if (stackEl) {
    stackEl.innerHTML = "";
    p.stack.forEach((s) => {
      const chip = document.createElement("span");
      chip.className = "stack-chip";
      chip.style.setProperty("--chip-accent", `var(--${p.accent})`);
      chip.textContent = s;
      stackEl.appendChild(chip);
    });
  }

  // Links
  const linksBlock = modal.querySelector<HTMLElement>('[data-block="links"]');
  const linksEl = modal.querySelector<HTMLElement>('[data-field="links"]');
  if (linksBlock && linksEl) {
    linksEl.innerHTML = "";
    if (p.links.length) {
      p.links.forEach((l) => {
        const a = document.createElement("a");
        a.className = "pixel-button pixel-button--ghost";
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = l.label;
        linksEl.appendChild(a);
      });
      linksBlock.hidden = false;
    } else {
      linksBlock.hidden = true;
    }
  }

  modal.setAttribute("aria-label", `Project details: ${p.title}`);
}

function showModal(modal: HTMLElement): void {
  modal.hidden = false;
  document.documentElement.setAttribute("data-modal-open", "true");
}

function hideModal(modal: HTMLElement): void {
  modal.hidden = true;
  document.documentElement.removeAttribute("data-modal-open");
}

function trapFocus(e: KeyboardEvent, modal: HTMLElement): void {
  const focusable = modal.querySelectorAll<HTMLElement>(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Project archive filter tabs. */
function initProjectFilter(): void {
  const grid = document.querySelector<HTMLElement>("[data-project-grid]");
  if (!grid) return;

  const filters = grid.querySelectorAll<HTMLElement>("[data-filter]");
  const cells = grid.querySelectorAll<HTMLElement>("[data-category]");
  const empty = grid.querySelector<HTMLElement>("[data-project-empty]");

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const id = filter.dataset.filter!;

      filters.forEach((f) =>
        f.setAttribute("aria-selected", f === filter ? "true" : "false")
      );

      let visible = 0;
      cells.forEach((cell) => {
        const show = id === "all" || cell.dataset.category === id;
        cell.hidden = !show;
        if (show) visible++;
      });

      if (empty) empty.hidden = visible !== 0;
    });
  });
}
