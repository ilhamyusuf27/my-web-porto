import { getActiveSection, onActiveSection } from "./sectionStore";

type SectionChromeMeta = {
  id: string;
  index: string;
  label: string;
  order: number;
};

const DECODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/._";
const DECODE_STEP_MS = 32;
const DECODE_STEPS = 11;
const ROLL_DURATION_MS = 340;

let initialized = false;

export function initSectionChrome(): void {
  if (initialized) return;
  initialized = true;

  const root = document.querySelector<HTMLElement>("[data-section-chrome]");
  const indexRoot = document.querySelector<HTMLElement>(
    "[data-section-chrome-index]"
  );
  const indexCurrent = document.querySelector<HTMLElement>(
    "[data-section-chrome-index-current]"
  );
  const indexNext = document.querySelector<HTMLElement>(
    "[data-section-chrome-index-next]"
  );
  const label = document.querySelector<HTMLElement>(
    "[data-section-chrome-label]"
  );

  if (!root || !indexRoot || !indexCurrent || !indexNext || !label) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const metadata = readSectionMetadata();
  if (!metadata.length) return;

  let current =
    metadata.find((item) => item.id === getActiveSection()) ?? metadata[0];
  let decodeTimer = 0;
  let rollTimer = 0;

  const setChrome = (next: SectionChromeMeta, animate: boolean) => {
    const previous = current;
    current = next;
    window.clearInterval(decodeTimer);
    window.clearTimeout(rollTimer);

    if (!animate || reducedMotion.matches) {
      indexRoot.classList.remove("is-rolling-down", "is-rolling-up");
      indexCurrent.textContent = next.index;
      indexNext.textContent = "";
      label.textContent = next.label;
      return;
    }

    rollIndex(
      indexRoot,
      indexCurrent,
      indexNext,
      next.index,
      next.order >= previous.order ? "down" : "up"
    );
    rollTimer = window.setTimeout(() => {
      indexRoot.classList.remove("is-rolling-down", "is-rolling-up");
      indexCurrent.textContent = next.index;
      indexNext.textContent = "";
    }, ROLL_DURATION_MS);

    decodeTimer = decodeLabel(label, next.label);
  };

  setChrome(current, false);

  onActiveSection((id) => {
    const next = metadata.find((item) => item.id === id);
    if (!next || next.id === current.id) return;
    setChrome(next, true);
  });
}

function readSectionMetadata(): SectionChromeMeta[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-section]")).map(
    (section, order) => {
      const id = section.dataset.section ?? section.id;
      return {
        id,
        index: section.dataset.sectionIndex || String(order).padStart(2, "0"),
        label:
          section.dataset.sectionLabel || section.getAttribute("aria-label") || id,
        order,
      };
    }
  );
}

function rollIndex(
  root: HTMLElement,
  current: HTMLElement,
  next: HTMLElement,
  value: string,
  direction: "down" | "up"
): void {
  root.classList.remove("is-rolling-down", "is-rolling-up");
  next.textContent = value;
  void root.offsetWidth;
  root.classList.add(direction === "down" ? "is-rolling-down" : "is-rolling-up");
}

function decodeLabel(label: HTMLElement, value: string): number {
  let step = 0;
  label.textContent = value;

  const interval = window.setInterval(() => {
    step += 1;
    const resolved = Math.ceil((step / DECODE_STEPS) * value.length);
    const output = value
      .split("")
      .map((char, index) => {
        if (char === " " || index < resolved) return char;
        return DECODE_CHARS[(index + step * 3) % DECODE_CHARS.length];
      })
      .join("");

    label.textContent = output;
    if (step >= DECODE_STEPS) {
      window.clearInterval(interval);
      label.textContent = value;
    }
  }, DECODE_STEP_MS);

  return interval;
}
