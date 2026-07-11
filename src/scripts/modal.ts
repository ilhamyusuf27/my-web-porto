type ProjectPayload = {
  id: string;
  title: string;
  category: string;
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
  images: { src: string; alt: string; caption?: string }[];
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  experimental: "Experimental",
};

function normalizeCategory(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function matchesFilter(project: ProjectPayload, filterId: string): boolean {
  const normalizedFilter = normalizeCategory(filterId);
  const category = normalizeCategory(project.category);
  const status = normalizeCategory(project.status);
  return normalizedFilter === "all" || category === normalizedFilter || (normalizedFilter === "ongoing" && status === "ongoing");
}

function getImages(p: ProjectPayload): { src: string; alt: string; caption?: string }[] {
  return p.images?.length
    ? p.images
    : p.image
      ? [{ src: p.image, alt: `${p.title} preview` }]
      : [];
}

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

  document.addEventListener("click", (event) => {
    const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-project-trigger]");
    if (!trigger?.dataset.projectTrigger) return;
    open(trigger.dataset.projectTrigger, trigger);
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

  initProjectDirectory(projects);
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
      chip.className = "pm-chip";
      chip.textContent = s;
      stackEl.appendChild(chip);
    });
  }

  updateGallery(modal, p);

  // Links
  const linksBlock = modal.querySelector<HTMLElement>('[data-block="links"]');
  const linksEl = modal.querySelector<HTMLElement>('[data-field="links"]');
  const noLinks = modal.querySelector<HTMLElement>('[data-field="no-links"]');
  if (linksBlock && linksEl && noLinks) {
    linksEl.innerHTML = "";
    if (p.links.length) {
      p.links.forEach((l) => {
        const a = document.createElement("a");
        const normalizedLabel = l.label.toLowerCase();
        a.className = normalizedLabel.includes("live") || normalizedLabel.includes("demo")
          ? "pm-link pm-link--primary"
          : "pm-link";
        a.href = l.url;
        a.target = "_blank";
        a.rel = "noreferrer";
        a.textContent = l.label;
        linksEl.appendChild(a);
      });
      linksEl.hidden = false;
      noLinks.hidden = true;
    } else {
      linksEl.hidden = true;
      noLinks.hidden = false;
    }
    linksBlock.hidden = false;
  }

  modal.setAttribute("aria-label", `Project details: ${p.title}`);
}

function updateGallery(modal: HTMLElement, p: ProjectPayload): void {
  const image = modal.querySelector<HTMLImageElement>("[data-gallery-image]");
  const placeholder = modal.querySelector<HTMLElement>("[data-gallery-placeholder]");
  const count = modal.querySelector<HTMLElement>("[data-gallery-count]");
  const caption = modal.querySelector<HTMLElement>("[data-gallery-caption]");
  const thumbs = modal.querySelector<HTMLElement>("[data-gallery-thumbs]");
  if (!image || !placeholder || !count || !caption || !thumbs) return;

  const images = getImages(p);

  const setActiveImage = (index: number) => {
    const selected = images[index];
    if (!selected) return;
    image.src = selected.src;
    image.alt = selected.alt;
    image.hidden = false;
    placeholder.hidden = true;
    count.textContent = `${index + 1} / ${images.length}`;
    caption.textContent = selected.caption ?? selected.alt;
    thumbs.querySelectorAll<HTMLButtonElement>(".pm-thumb").forEach((button, buttonIndex) => {
      button.setAttribute("aria-selected", buttonIndex === index ? "true" : "false");
    });
  };

  thumbs.innerHTML = "";
  if (!images.length) {
    image.hidden = true;
    image.removeAttribute("src");
    image.alt = "";
    placeholder.hidden = false;
    count.textContent = "No images";
    caption.textContent = "No preview asset";
    thumbs.hidden = true;
    return;
  }

  count.textContent = `1 / ${images.length}`;
  if (images.length === 1) {
    thumbs.hidden = true;
    setActiveImage(0);
    return;
  }

  images.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pm-thumb";
    button.setAttribute("aria-label", `Show image ${index + 1} of ${images.length}: ${item.alt}`);
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");

    const thumb = document.createElement("img");
    thumb.src = item.src;
    thumb.alt = "";
    thumb.loading = "lazy";
    thumb.decoding = "async";
    button.appendChild(thumb);
    button.addEventListener("click", () => setActiveImage(index));
    thumbs.appendChild(button);
  });

  thumbs.hidden = false;
  setActiveImage(0);
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

/** Project directory: shared selection state for list view, grid view, filters, and preview. */
function initProjectDirectory(projects: ProjectPayload[]): void {
  const grid = document.querySelector<HTMLElement>("[data-project-grid]");
  if (!grid) return;

  const filters = grid.querySelectorAll<HTMLElement>("[data-filter]");
  const empty = grid.querySelector<HTMLElement>("[data-project-empty]");
  const count = grid.querySelector<HTMLElement>("[data-project-count]");
  const selectors = grid.querySelectorAll<HTMLElement>("[data-project-select]");
  const viewToggles = grid.querySelectorAll<HTMLElement>("[data-view-toggle]");
  const viewPanels = grid.querySelectorAll<HTMLElement>("[data-view-panel]");
  const previewOpen = grid.querySelector<HTMLElement>("[data-preview-open]");
  const previewImage = grid.querySelector<HTMLImageElement>("[data-preview-image]");
  const previewMedia = grid.querySelector<HTMLElement>("[data-preview-media]");
  const preview = grid.querySelector<HTMLElement>("[data-project-preview]");
  const previewTitle = grid.querySelector<HTMLElement>("[data-preview-title]");
  const previewType = grid.querySelector<HTMLElement>("[data-preview-type]");
  const previewSummary = grid.querySelector<HTMLElement>("[data-preview-summary]");
  const previewStatus = grid.querySelector<HTMLElement>("[data-preview-status]");
  const previewRole = grid.querySelector<HTMLElement>("[data-preview-role]");
  const previewImageCount = grid.querySelector<HTMLElement>("[data-preview-image-count]");
  const previewStack = grid.querySelector<HTMLElement>("[data-preview-stack]");
  const previewLinkState = grid.querySelector<HTMLElement>("[data-preview-link-state]");
  let activeFilter = "all";
  let selectedId = selectors[0]?.dataset.projectSelect ?? "";

  const visibleProjects = () =>
    projects.filter((project) => matchesFilter(project, activeFilter));

  const clearPreview = () => {
    selectedId = "";
    if (previewImage) {
      previewImage.hidden = true;
      previewImage.removeAttribute("src");
    }
    previewMedia?.querySelector<HTMLElement>("[data-preview-placeholder]")?.removeAttribute("hidden");
    if (previewTitle) previewTitle.textContent = "No case file selected";
    if (previewType) previewType.textContent = "Empty folder";
    if (previewSummary) previewSummary.textContent = "This folder does not contain a public case file yet.";
    if (previewStatus) previewStatus.textContent = "Empty";
    if (previewRole) previewRole.textContent = "Not available";
    if (previewImageCount) previewImageCount.textContent = "No image";
    if (previewLinkState) previewLinkState.textContent = "No public link";
    if (previewStack) previewStack.innerHTML = "";
    if (previewOpen) {
      previewOpen.removeAttribute("data-project-trigger");
      previewOpen.setAttribute("disabled", "true");
    }
    selectors.forEach((selector) => {
      selector.classList.remove("is-selected");
      selector.setAttribute("aria-current", "false");
    });
  };

  const renderPreview = (project: ProjectPayload, animate = true) => {
    const images = getImages(project);

    selectedId = project.id;
    if (previewOpen) previewOpen.removeAttribute("disabled");
    if (previewImage && previewMedia) {
      const placeholder = previewMedia.querySelector<HTMLElement>("[data-preview-placeholder]");
      if (images[0]) {
        previewImage.src = images[0].src;
        previewImage.alt = "";
        previewImage.hidden = false;
        placeholder?.setAttribute("hidden", "");
      } else {
        previewImage.hidden = true;
        previewImage.removeAttribute("src");
        placeholder?.removeAttribute("hidden");
      }
    }

    if (previewTitle) previewTitle.textContent = project.title;
    if (previewType) previewType.textContent = project.type;
    if (previewSummary) previewSummary.textContent = project.summary;
    if (previewStatus) previewStatus.textContent = STATUS_LABELS[project.status] ?? project.status;
    if (previewRole) previewRole.textContent = project.role;
    if (previewImageCount) {
      previewImageCount.textContent = images.length ? `${images.length} available` : "No image";
    }
    if (previewOpen) previewOpen.dataset.projectTrigger = project.id;
    if (previewLinkState) {
      previewLinkState.textContent = project.links.length
        ? `${project.links.length} public link${project.links.length > 1 ? "s" : ""}`
        : "No public link";
    }

    if (previewStack) {
      previewStack.innerHTML = "";
      project.stack.slice(0, 5).forEach((item) => {
        const chip = document.createElement("span");
        chip.textContent = item;
        previewStack.appendChild(chip);
      });
    }

    selectors.forEach((selector) => {
      const selected = selector.dataset.projectSelect === project.id;
      selector.classList.toggle("is-selected", selected);
      selector.setAttribute("aria-current", selected ? "true" : "false");
    });

    if (animate && preview) {
      preview.classList.remove("is-updating");
      void preview.offsetWidth;
      preview.classList.add("is-updating");
      window.setTimeout(() => preview.classList.remove("is-updating"), 260);
    }
  };

  const selectProject = (id: string, fallbackToFirst = true) => {
    const visible = visibleProjects();
    const project = visible.find((item) => item.id === id) ?? (fallbackToFirst ? visible[0] : undefined);
    if (project) renderPreview(project);
    else clearPreview();
  };

  const applyFilter = (id: string) => {
    activeFilter = id;

    filters.forEach((filter) => {
      const active = filter.dataset.filter === id;
      filter.setAttribute("aria-selected", active ? "true" : "false");
      filter.setAttribute("aria-pressed", active ? "true" : "false");
      if (active) filter.setAttribute("aria-current", "true");
      else filter.removeAttribute("aria-current");
      filter.classList.toggle("is-active", active);
    });

    const visibleIds = new Set(visibleProjects().map((project) => project.id));
    selectors.forEach((selector) => {
      const projectId = selector.dataset.projectSelect;
      selector.hidden = !projectId || !visibleIds.has(projectId);
    });

    if (empty) empty.hidden = visibleIds.size !== 0;
    if (count) count.textContent = `${visibleIds.size} shown`;

    if (!visibleIds.has(selectedId)) selectProject("", true);
    else selectProject(selectedId, true);
  };

  selectors.forEach((selector) => {
    selector.addEventListener("click", () => {
      const project = projects.find((p) => p.id === selector.dataset.projectSelect);
      if (project) renderPreview(project);
    });
  });

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      applyFilter(filter.dataset.filter ?? "all");
    });
  });

  viewToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const view = toggle.dataset.viewToggle ?? "list";
      grid.dataset.view = view;
      viewToggles.forEach((item) => {
        const active = item === toggle;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      viewPanels.forEach((panel) => {
        panel.hidden = panel.dataset.viewPanel !== view;
      });
      selectProject(selectedId, true);
    });
  });

  applyFilter(activeFilter);
}
