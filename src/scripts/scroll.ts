import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  cueSectionTransition,
  getActiveSection,
  setActiveSection,
} from "./sectionStore";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouch = window.matchMedia("(max-width: 768px)").matches;

let sectionEls: HTMLElement[] = [];
let hudDesktopItems: NodeListOf<HTMLElement> | null = null;
let isTransitioning = false;
let scrollTween: gsap.core.Animation | null = null;
let wheelGestureLocked = false;
let wheelReleaseTimer = 0;

type SectionTransitionStage = {
  root: HTMLElement;
  outgoing: HTMLElement[];
  incoming: HTMLElement[];
  restore: () => void;
};

type SectionTransitionConfig = {
  x?: number;
  y?: number;
  scale?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  enterDelay?: number;
  exitDistance?: number;
  exitScale?: number;
};

const SECTION_TRANSITIONS: Record<string, SectionTransitionConfig> = {
  hero: { y: 12, duration: 0.42, ease: "power2.out", exitDistance: 0.42 },
  about: { x: 14, y: 2, duration: 0.46, exitDistance: 0.5 },
  skills: { y: 11, scale: 0.988, duration: 0.5, stagger: 0.014 },
  experience: { y: 16, duration: 0.48, stagger: 0.01, exitDistance: 0.48 },
  projects: {
    y: 5,
    scale: 0.992,
    duration: 0.4,
    stagger: 0,
    exitDistance: 0.35,
  },
  experimental: { x: 10, y: 8, duration: 0.5, stagger: 0.01 },
  ongoing: { x: 15, y: 3, duration: 0.48, exitDistance: 0.52 },
  education: { x: 4, y: 9, duration: 0.44, exitDistance: 0.42 },
  contact: { y: 13, duration: 0.46, ease: "power2.out" },
};

const DEFAULT_TRANSITION: Required<SectionTransitionConfig> = {
  x: 0,
  y: 10,
  scale: 1,
  duration: 0.46,
  ease: "power3.out",
  stagger: 0.008,
  enterDelay: 0.035,
  exitDistance: 0.45,
  exitScale: 0.997,
};

/** Desktop-only GSAP snapping + reveals + progress + active-section tracking. */
export function initScrollAnimations(): void {
  const sections = gsap.utils.toArray<HTMLElement>("[data-section]");
  sectionEls = sections;

  if (!prefersReducedMotion) {
    // Controlled section navigation is desktop/tablet only; touch and
    // reduced-motion users keep native scrolling.
    if (!isTouch) {
      prepareControlledSectionMotion(sections);
      initControlledSectionNavigation(sections);
      initScrollSettle(sections);
    } else {
      initNativeReveals(sections);
      initAnchorNavigation(sections, false);
    }
  } else {
    document.documentElement.classList.add("reveal-done");
    initAnchorNavigation(sections, true);
  }

  initProgress();
  initActiveSection(sections);
}

/** Lightweight reveal-once animations for native mobile scrolling. */
function initNativeReveals(sections: HTMLElement[]): void {
  sections.forEach((section) => {
    const items = section.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      }
    );
  });
}

/**
 * Controlled navigation owns content motion on larger screens. Reveal targets
 * are made readable up front, then the currently visible section screen gets
 * one restrained entrance on initial load.
 */
function prepareControlledSectionMotion(sections: HTMLElement[]): void {
  document.documentElement.classList.add("reveal-done");
  gsap.set("[data-reveal]", {
    clearProps: "opacity,visibility,transform,willChange",
  });

  const current = sections[getNearestSectionIndex(sections)];
  const targets = getSectionMotionTargets(current);
  if (!targets.length) return;

  gsap.fromTo(
    targets,
    { autoAlpha: 0, ...getInitialSectionMotion(current) },
    {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.64,
      stagger: 0.04,
      ease: "power3.out",
      clearProps:
        "opacity,visibility,transform,transformOrigin,clipPath,willChange",
    }
  );
}

/**
 * Controlled section navigation:
 * - wheel/key/click select exactly one target section;
 * - GSAP ScrollToPlugin owns the transition;
 * - extra input is ignored while the transition is running;
 * - tall sections can still be read normally between their own top/bottom.
 */
function initControlledSectionNavigation(sections: HTMLElement[]): void {
  initAnchorNavigation(sections, false);

  window.addEventListener(
    "wheel",
    (event) => {
      if (shouldIgnoreNavigationEvent(event.target)) return;

      if (isTransitioning || wheelGestureLocked) {
        event.preventDefault();
        queueWheelGestureRelease();
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (direction === 0) return;

      const currentIndex = getCurrentSectionIndex(sections);
      if (canReadTallSection(sections[currentIndex], direction)) return;

      const nextIndex = clampIndex(currentIndex + direction, sections);
      if (nextIndex === currentIndex) {
        event.preventDefault();
        lockWheelGesture();
        scrollToSection(currentIndex, { immediate: false });
        return;
      }

      event.preventDefault();
      lockWheelGesture();
      scrollToSection(nextIndex, { immediate: false });
    },
    { passive: false }
  );

  document.addEventListener("keydown", (event) => {
    if (shouldIgnoreNavigationEvent(event.target) || event.defaultPrevented)
      return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const currentIndex = getCurrentSectionIndex(sections);
    let targetIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "PageDown") {
      targetIndex = clampIndex(currentIndex + 1, sections);
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      targetIndex = clampIndex(currentIndex - 1, sections);
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = sections.length - 1;
    }

    if (targetIndex === null) return;

    event.preventDefault();
    if (event.repeat || isTransitioning) return;
    scrollToSection(targetIndex, { immediate: false });
  });
}

function lockWheelGesture(): void {
  wheelGestureLocked = true;
  queueWheelGestureRelease();
}

function queueWheelGestureRelease(): void {
  window.clearTimeout(wheelReleaseTimer);
  wheelReleaseTimer = window.setTimeout(() => {
    wheelGestureLocked = false;
  }, 180);
}

function initScrollSettle(sections: HTMLElement[]): void {
  let settleTimer = 0;

  const settle = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (
        isTransitioning ||
        shouldIgnoreNavigationEvent(document.activeElement)
      )
        return;

      const nearestIndex = getNearestSectionIndex(sections);
      if (isInsideTallReadableArea(sections[nearestIndex])) return;

      const targetTop = measuredTop(sections[nearestIndex]);
      if (Math.abs(window.scrollY - targetTop) > 8) {
        scrollToSection(nearestIndex, { immediate: false });
      }
    }, 140);
  };

  window.addEventListener("scroll", settle, { passive: true });
}

/** Top progress bar fill. */
function initProgress(): void {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
}

/**
 * Detect the active section via a thin center band and broadcast it through
 * the shared store (drives HUD and progress state). Falls back to scroll-position math
 * when IntersectionObserver is unavailable.
 */
function initActiveSection(sections: HTMLElement[]): void {
  hudDesktopItems = document.querySelectorAll<HTMLElement>("[data-hud-item]");

  if (!("IntersectionObserver" in window)) {
    const onScroll = () => {
      if (isTransitioning) return;
      const center = window.scrollY + window.innerHeight * 0.45;
      let current = sections[0];
      for (const section of sections) {
        if (section.offsetTop <= center) current = section;
      }
      syncActiveSection(current?.getAttribute("data-section") ?? "hero");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (isTransitioning) return;
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible)
        syncActiveSection(
          visible.target.getAttribute("data-section") ?? "hero"
        );
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
  );

  syncActiveSection(sections[getNearestSectionIndex(sections)]?.id ?? "hero");
  sections.forEach((section) => observer.observe(section));
}

function initAnchorNavigation(
  sections: HTMLElement[],
  immediate: boolean
): void {
  document
    .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    .forEach((anchor) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const id = decodeURIComponent(hash.slice(1));
      const index = sections.findIndex((section) => section.id === id);
      if (index === -1) return;

      anchor.addEventListener("click", (event) => {
        if (shouldIgnoreNavigationEvent(event.target)) return;
        event.preventDefault();
        if (isTransitioning) return;

        if (immediate) {
          sections[index].scrollIntoView({ block: "start" });
          syncActiveSection(sections[index].id);
          return;
        }

        scrollToSection(index, { immediate: false });
      });
    });
}

function scrollToSection(index: number, opts: { immediate: boolean }): void {
  const target = sectionEls[index];
  if (!target) return;

  const currentIndex = getCurrentSectionIndex(sectionEls);
  const y = measuredTop(target);
  const id = target.getAttribute("data-section") ?? target.id;

  scrollTween?.kill();
  if (opts.immediate || prefersReducedMotion) {
    window.scrollTo({ top: y, behavior: "auto" });
    syncActiveSection(id);
    return;
  }

  isTransitioning = true;
  document.documentElement.setAttribute("data-section-transitioning", "true");

  const isSectionChange = currentIndex !== index;
  if (!isTouch && isSectionChange) {
    scrollTween = createSectionTransition(currentIndex, index, y, id);
    return;
  }

  scrollTween = gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: 0.46,
    ease: "power3.inOut",
    overwrite: true,
    onComplete: () => finishSectionTransition(id),
    onInterrupt: () => finishSectionTransition(id),
  });
}

/**
 * Crossfade cloned section content while the document settles at the target.
 * This preserves the snap system without a visible full-page cover or long
 * interaction lock.
 */
function createSectionTransition(
  currentIndex: number,
  targetIndex: number,
  y: number,
  id: string
): gsap.core.Timeline {
  const direction = targetIndex > currentIndex ? 1 : -1;
  const stage = createSectionTransitionStage(
    sectionEls[currentIndex],
    sectionEls[targetIndex],
    y
  );
  const outgoingConfig = getSectionTransitionConfig(sectionEls[currentIndex]);
  const incomingConfig = getSectionTransitionConfig(sectionEls[targetIndex]);
  const duration = getTransitionDuration(
    incomingConfig.duration,
    Math.abs(targetIndex - currentIndex)
  );
  const incomingStagger = getTransitionStagger(
    stage.incoming.length,
    duration,
    incomingConfig.stagger
  );
  const enterDelay = Math.min(incomingConfig.enterDelay, duration * 0.18);
  const cleanupTargets = [...stage.outgoing, ...stage.incoming];

  gsap.set(cleanupTargets, {
    willChange: "transform,opacity",
    transformOrigin: "50% 50%",
  });
  gsap.set(stage.incoming, getIncomingState(incomingConfig, direction));

  const timeline = gsap.timeline({
    onComplete: () => finishSectionTransition(id, cleanupTargets, stage),
    onInterrupt: () => finishSectionTransition(id, cleanupTargets, stage),
  });

  timeline
    .to(
      stage.outgoing,
      {
        autoAlpha: 0,
        ...getOutgoingState(outgoingConfig, direction),
        duration: Math.min(0.18, duration * 0.38),
        stagger: Math.min(0.008, outgoingConfig.stagger),
        ease: "power2.out",
      },
      0
    )
    .call(() => cueSectionTransition(id), [], 0)
    .call(() => jumpDocumentBehindStage(y), [], Math.min(0.08, duration * 0.18))
    .to(
      stage.incoming,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        stagger: incomingStagger,
        ease: incomingConfig.ease,
      },
      enterDelay
    );

  return timeline;
}

/**
 * Clone two complete sections so their scoped component styles and exact
 * layout are retained. Only these two screens exist in the visual stage, so
 * sidebar jumps never expose the sections between them.
 */
function createSectionTransitionStage(
  current: HTMLElement,
  target: HTMLElement,
  targetY: number
): SectionTransitionStage {
  const main = document.querySelector<HTMLElement>(".main-scroll");
  const previousMainVisibility = main?.style.visibility ?? "";
  const root = document.createElement("div");
  const currentRect = current.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  root.setAttribute("aria-hidden", "true");
  root.dataset.sectionStage = "true";
  Object.assign(root.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2",
    overflow: "hidden",
    pointerEvents: "none",
  });

  const outgoingSection = cloneSectionForStage(
    current,
    currentRect.top,
    currentRect
  );
  const targetTop = target.offsetTop - targetY;
  const incomingSection = cloneSectionForStage(target, targetTop, targetRect);

  root.append(outgoingSection, incomingSection);
  document.body.append(root);
  if (main) main.style.visibility = "hidden";

  return {
    root,
    outgoing: getSectionMotionTargets(outgoingSection),
    incoming: getSectionMotionTargets(incomingSection),
    restore: () => {
      if (main) main.style.visibility = previousMainVisibility;
      root.remove();
    },
  };
}

function cloneSectionForStage(
  source: HTMLElement,
  top: number,
  sourceRect: DOMRect
): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;

  clone.removeAttribute("id");
  clone
    .querySelectorAll<HTMLElement>("[id]")
    .forEach((element) => element.removeAttribute("id"));
  clone
    .querySelectorAll<HTMLElement>("a, button, input, textarea, select")
    .forEach((element) => element.setAttribute("tabindex", "-1"));

  Object.assign(clone.style, {
    position: "absolute",
    top: `${top}px`,
    left: `${sourceRect.left}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    minHeight: `${sourceRect.height}px`,
    margin: "0",
    visibility: "visible",
    pointerEvents: "none",
  });

  return clone;
}

function jumpDocumentBehindStage(y: number): void {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  root.style.scrollBehavior = previousScrollBehavior;
}

function finishSectionTransition(
  id: string,
  cleanupTargets: HTMLElement[] = [],
  stage?: SectionTransitionStage
): void {
  if (cleanupTargets.length) {
    gsap.set(cleanupTargets, {
      clearProps:
        "opacity,visibility,transform,transformOrigin,clipPath,willChange",
    });
  }
  stage?.restore();
  isTransitioning = false;
  scrollTween = null;
  document.documentElement.removeAttribute("data-section-transitioning");
  syncActiveSection(id);
  ScrollTrigger.refresh();
}

function getSectionMotionTargets(
  section: HTMLElement | undefined
): HTMLElement[] {
  if (!section) return [];

  const revealRoots = Array.from(
    section.querySelectorAll<HTMLElement>("[data-reveal]")
  ).filter((element) => !element.parentElement?.closest("[data-reveal]"));

  return revealRoots.filter(
    (element): element is HTMLElement => element !== null
  );
}

function getSectionTransitionConfig(
  section: HTMLElement | undefined
): Required<SectionTransitionConfig> {
  const id = section?.getAttribute("data-section") ?? section?.id ?? "";
  return { ...DEFAULT_TRANSITION, ...SECTION_TRANSITIONS[id] };
}

function getTransitionDuration(baseDuration: number, distance: number): number {
  return Math.min(0.68, baseDuration + Math.max(0, distance - 1) * 0.04);
}

function getTransitionStagger(
  targetCount: number,
  duration: number,
  preferred: number
): number {
  if (targetCount < 2 || preferred <= 0) return 0;
  const maxTotal = 0.66;
  return Math.min(
    preferred,
    Math.max(0, (maxTotal - duration) / (targetCount - 1))
  );
}

function getIncomingState(
  config: Required<SectionTransitionConfig>,
  direction: number
): gsap.TweenVars {
  return {
    autoAlpha: 0,
    x: config.x * direction,
    y: config.y * direction,
    scale: config.scale,
  };
}

function getOutgoingState(
  config: Required<SectionTransitionConfig>,
  direction: number
): gsap.TweenVars {
  return {
    x: config.x ? config.x * direction * -config.exitDistance : 0,
    y: config.y * direction * -config.exitDistance,
    scale: config.exitScale,
  };
}

function getInitialSectionMotion(
  section: HTMLElement | undefined
): gsap.TweenVars {
  const id = section?.getAttribute("data-section") ?? section?.id ?? "";

  if (id === "hero" || id === "about") return { x: 14, y: 0 };
  if (id === "projects") return { scale: 0.975, y: 4 };
  if (id === "experimental" || id === "ongoing") return { x: 10, y: 10 };
  if (id === "education" || id === "contact") return { x: 4, y: 8 };
  return { y: 14 };
}

function syncActiveSection(id: string): void {
  setActiveSection(id);
  sectionEls.forEach((section) => {
    section.classList.toggle("is-active-section", section.id === id);
  });
  hudDesktopItems?.forEach((el) =>
    el.setAttribute(
      "aria-current",
      el.dataset.hudItem === id ? "true" : "false"
    )
  );
}

function getCurrentSectionIndex(sections: HTMLElement[]): number {
  const activeId = getActiveSection();
  const activeIndex = activeId
    ? sections.findIndex((section) => section.id === activeId)
    : -1;
  if (activeIndex >= 0) return activeIndex;

  const center = window.scrollY + window.innerHeight * 0.45;
  let current = 0;
  sections.forEach((section, index) => {
    if (section.offsetTop <= center) current = index;
  });
  return current;
}

function getNearestSectionIndex(sections: HTMLElement[]): number {
  const y = window.scrollY;
  let nearest = 0;
  let bestDistance = Infinity;

  sections.forEach((section, index) => {
    const distance = Math.abs(measuredTop(section) - y);
    if (distance < bestDistance) {
      bestDistance = distance;
      nearest = index;
    }
  });

  return nearest;
}

function canReadTallSection(
  section: HTMLElement | undefined,
  direction: number
): boolean {
  if (!section) return false;

  const height = section.offsetHeight;
  const viewport = window.innerHeight;
  if (height <= viewport + 8) return false;

  const top = measuredTop(section);
  const bottom = top + height;
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + viewport;
  const tolerance = 12;

  if (direction > 0) return viewportBottom < bottom - tolerance;
  return viewportTop > top + tolerance;
}

function isInsideTallReadableArea(section: HTMLElement | undefined): boolean {
  if (!section) return false;

  const height = section.offsetHeight;
  const viewport = window.innerHeight;
  if (height <= viewport + 8) return false;

  const top = measuredTop(section);
  const bottom = top + height;
  const viewportTop = window.scrollY;
  const viewportBottom = viewportTop + viewport;
  const tolerance = 12;

  return viewportTop > top + tolerance && viewportBottom < bottom - tolerance;
}

function measuredTop(section: HTMLElement): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(max, Math.max(0, section.offsetTop));
}

function clampIndex(index: number, sections: HTMLElement[]): number {
  return Math.min(sections.length - 1, Math.max(0, index));
}

function shouldIgnoreNavigationEvent(target: EventTarget | null): boolean {
  if (document.documentElement.hasAttribute("data-modal-open")) return true;
  if (!(target instanceof Element)) return false;
  if (target.closest("[data-modal]")) return true;
  if (target.closest("input, textarea, select, [contenteditable='true']"))
    return true;
  return Boolean(target.closest("[data-scroll-native]"));
}
