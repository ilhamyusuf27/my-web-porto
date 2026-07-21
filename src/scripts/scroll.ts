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
let tallSectionExitIndex = -1;
let tallSectionExitDirection = 0;
let tallSectionExitReadyAt = 0;
let tallSectionExitGestureReleased = false;

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
  clip?: "vertical" | "horizontal" | "none";
  rotate?: number;
};

const SECTION_TRANSITIONS: Record<string, SectionTransitionConfig> = {
  hero: { y: 48, duration: 0.72, ease: "power3.out", exitDistance: 0.5, clip: "vertical" },
  about: { x: 38, y: 34, scale: 0.965, duration: 0.88, exitDistance: 0.44, clip: "none", rotate: -1.1 },
  skills: { x: 84, y: 0, scale: 0.92, duration: 0.82, stagger: 0.04, clip: "horizontal", rotate: -0.8 },
  experience: { x: 72, y: 0, duration: 0.78, stagger: 0.025, exitDistance: 0.5, clip: "horizontal" },
  projects: {
    y: 54,
    scale: 0.985,
    duration: 0.72,
    stagger: 0,
    exitDistance: 0.35,
    clip: "none",
    rotate: 1.2,
  },
  experimental: { y: 76, scale: 0.9, duration: 0.84, stagger: 0.035, clip: "none", rotate: 1.8 },
  ongoing: { x: 68, y: 0, duration: 0.72, exitDistance: 0.5, clip: "horizontal" },
  education: { y: 20, scale: 0.95, duration: 0.72, exitDistance: 0.5, clip: "none" },
  contact: { y: 64, duration: 0.78, ease: "power3.out", clip: "vertical" },
};

const DEFAULT_TRANSITION: Required<SectionTransitionConfig> = {
  x: 0,
  y: 52,
  scale: 1,
  duration: 0.72,
  ease: "power3.out",
  stagger: 0.008,
  enterDelay: 0.08,
  exitDistance: 0.45,
  exitScale: 0.997,
  clip: "vertical",
  rotate: 0,
};

/** Desktop-only GSAP snapping + reveals + progress + active-section tracking. */
export function initScrollAnimations(): void {
  const sections = gsap.utils.toArray<HTMLElement>("[data-section]");
  sectionEls = sections;

  if (!prefersReducedMotion) {
    if (isTouch) {
      initNativeReveals(sections);
      initAnchorNavigation(sections, true);
    } else {
      initFluidSectionSnap(sections);
      initAnchorNavigation(sections, false);
    }
  } else {
    document.documentElement.classList.add("reveal-done");
    initAnchorNavigation(sections, true);
  }

  initProgress();
  initActiveSection(sections);
  syncInitialHash(sections);
}

/**
 * Reference-style desktop motion: native input remains untouched, section
 * content softens during the handoff, and ScrollTrigger settles the document
 * onto the next section after the gesture ends.
 */
function initFluidSectionSnap(sections: HTMLElement[]): void {
  document.documentElement.classList.add("reveal-done");
  gsap.set("[data-reveal]", {
    clearProps: "opacity,visibility,transform,willChange",
  });

  sections.forEach((section, index) => {
    const inner = section.querySelector<HTMLElement>(".section__inner");
    if (!inner) return;

    if (index > 0) {
      gsap.fromTo(
        inner,
        {
          autoAlpha: 0.28,
          y: 64,
          scale: 0.988,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 38%",
            scrub: 0.38,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    if (index < sections.length - 1) {
      gsap.to(inner, {
        autoAlpha: 0.28,
        y: -52,
        scale: 0.99,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "bottom 62%",
          end: "bottom 8%",
          scrub: 0.38,
          invalidateOnRefresh: true,
        },
      });
    }
  });

  ScrollTrigger.create({
    start: 0,
    end: "max",
    snap: {
      snapTo: (progress, self) => {
        const max = ScrollTrigger.maxScroll(window);
        if (max <= 0) return progress;

        const y = progress * max;
        const readableTallSection = sections.some((section) => {
          if (!isTallSection(section)) return false;
          const top = measuredTop(section);
          const readableEnd = top + section.offsetHeight - window.innerHeight;
          return y > top + 24 && y < readableEnd - 24;
        });
        if (readableTallSection) return progress;

        const points = sections.map((section) => measuredTop(section) / max);
        const direction = self?.direction ?? 1;
        const epsilon = 1 / max;

        if (direction > 0) {
          return points.find((point) => point >= progress - epsilon)
            ?? points[points.length - 1];
        }

        return [...points].reverse().find((point) => point <= progress + epsilon)
          ?? points[0];
      },
      duration: { min: 0.38, max: 0.82 },
      delay: 0.07,
      ease: "power4.inOut",
      inertia: false,
      onStart: () => {
        document.documentElement.setAttribute("data-section-transitioning", "true");
      },
      onComplete: () => {
        const section = sections[getNearestSectionIndex(sections)];
        const id = section?.getAttribute("data-section") ?? section?.id ?? "hero";
        document.documentElement.removeAttribute("data-section-transitioning");
        cueSectionTransition(id);
        syncActiveSection(id);
      },
      onInterrupt: () => {
        document.documentElement.removeAttribute("data-section-transitioning");
      },
    },
  });
}

/** Lightweight reveal-once animations for native mobile scrolling. */
function initNativeReveals(sections: HTMLElement[]): void {
  sections.forEach((section) => {
    const id = section.getAttribute("data-section") ?? section.id;
    const inner = section.querySelector<HTMLElement>(".section__inner");
    const sectionMotion: Record<string, gsap.TweenVars> = {
      hero: { y: 18, scale: .995 },
      about: { x: -34, y: 10 },
      skills: { x: 30, y: 16 },
      experience: { y: 34, scale: .985 },
      projects: { x: -24, y: 22, scale: .99 },
      experimental: { x: 28, y: 26 },
      education: { y: 30, scale: .975 },
      contact: { x: -20, y: 34 },
    };

    if (inner) {
      gsap.fromTo(
        inner,
        { autoAlpha: .56, ...(sectionMotion[id] ?? { y: 24 }) },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: .58,
          ease: "power4.out",
          clearProps: "opacity,visibility,transform,willChange",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            once: true,
          },
        }
      );
    }

    const items = section.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.46,
        stagger: 0.045,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 76%",
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
      const currentSection = sections[currentIndex];
      if (
        isTallSection(currentSection) &&
        wouldCrossTallSectionEdge(currentSection, direction, event.deltaY)
      ) {
        event.preventDefault();
        tallSectionExitIndex = currentIndex;
        tallSectionExitDirection = direction;
        tallSectionExitReadyAt = window.performance.now() + 650;
        tallSectionExitGestureReleased = false;
        lockWheelGesture();
        settleTallSectionEdge(currentSection, direction);
        return;
      }

      if (canReadTallSection(currentSection, direction)) {
        clearTallSectionExit();
        return;
      }

      if (
        isTallSection(currentSection) &&
        !isTallSectionExitArmed(currentIndex, direction)
      ) {
        event.preventDefault();
        tallSectionExitIndex = currentIndex;
        tallSectionExitDirection = direction;
        tallSectionExitReadyAt = window.performance.now() + 650;
        tallSectionExitGestureReleased = false;
        lockWheelGesture();
        settleTallSectionEdge(currentSection, direction);
        return;
      }

      clearTallSectionExit();

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
    if (tallSectionExitIndex >= 0) tallSectionExitGestureReleased = true;
  }, 360);
}

function isTallSection(section: HTMLElement | undefined): boolean {
  return Boolean(section && section.offsetHeight > window.innerHeight + 8);
}

function isTallSectionExitArmed(index: number, direction: number): boolean {
  return tallSectionExitIndex === index &&
    tallSectionExitDirection === direction &&
    tallSectionExitGestureReleased &&
    window.performance.now() >= tallSectionExitReadyAt;
}

function wouldCrossTallSectionEdge(
  section: HTMLElement | undefined,
  direction: number,
  deltaY: number
): boolean {
  if (!section) return false;
  const top = measuredTop(section);
  const remaining = direction > 0
    ? top + section.offsetHeight - (window.scrollY + window.innerHeight)
    : window.scrollY - top;
  return remaining > 8 && Math.abs(deltaY) >= remaining;
}

function clearTallSectionExit(): void {
  tallSectionExitIndex = -1;
  tallSectionExitDirection = 0;
  tallSectionExitReadyAt = 0;
  tallSectionExitGestureReleased = false;
}

function settleTallSectionEdge(
  section: HTMLElement | undefined,
  direction: number
): void {
  if (!section) return;
  const top = measuredTop(section);
  const edge = direction > 0
    ? top + section.offsetHeight - window.innerHeight
    : top;
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: edge, behavior: "auto" });
  root.style.scrollBehavior = previousScrollBehavior;
}

/** Top progress bar fill. */
function initProgress(): void {
  const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
  if (!bar) return;
  let queued = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    queued = false;
  };

  const queueUpdate = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate, { passive: true });
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

function syncInitialHash(sections: HTMLElement[]): void {
  if (!window.location.hash) return;

  const id = decodeURIComponent(window.location.hash.slice(1));
  const section = sections.find((item) => item.id === id);
  if (!section) return;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      document.documentElement.classList.add("reveal-done");
      gsap.set("[data-reveal]", {
        clearProps: "opacity,visibility,transform,willChange",
      });

      const previousScrollBehavior =
        document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, measuredTop(section));
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      syncActiveSection(section.id);
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
  const current = sectionEls[currentIndex];
  const target = sectionEls[targetIndex];
  const outgoing = current?.querySelector<HTMLElement>(".section__inner");
  const incoming = target?.querySelector<HTMLElement>(".section__inner");
  const cleanupTargets = [outgoing, incoming].filter(
    (item): item is HTMLElement => Boolean(item)
  );

  gsap.set(cleanupTargets, { willChange: "transform,opacity" });
  if (incoming) {
    gsap.set(incoming, {
      autoAlpha: 0.28,
      y: 64 * direction,
      scale: 0.988,
    });
  }

  const timeline = gsap.timeline({
    onComplete: () => finishSectionTransition(id, cleanupTargets),
    onInterrupt: () => finishSectionTransition(id, cleanupTargets),
  });

  timeline
    .call(() => cueSectionTransition(id), [], 0)
    .to(window, {
      scrollTo: { y, autoKill: false },
      duration: 0.78,
      ease: "power4.inOut",
    }, 0)
    .to(outgoing, {
      autoAlpha: 0.28,
      y: -48 * direction,
      scale: 0.99,
      duration: 0.34,
      ease: "power2.in",
    }, 0)
    .to(incoming, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.52,
      ease: "power4.out",
    }, 0.26);

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
        "opacity,visibility,transform,transformOrigin,clipPath,filter,willChange",
    });
  }
  stage?.restore();
  isTransitioning = false;
  lockWheelGesture();
  scrollTween = null;
  document.documentElement.removeAttribute("data-section-transitioning");
  syncActiveSection(id);
  ScrollTrigger.update();
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
  const clipPath = config.clip === "horizontal"
    ? direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"
    : config.clip === "vertical"
      ? direction > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)"
      : "inset(0% 0 0% 0)";

  return {
    autoAlpha: 0,
    x: config.x * direction,
    y: config.y * direction,
    scale: config.scale,
    rotation: config.rotate * direction,
    clipPath,
  };
}

function getOutgoingState(
  config: Required<SectionTransitionConfig>,
  direction: number
): gsap.TweenVars {
  const clipPath = config.clip === "horizontal"
    ? direction > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)"
    : config.clip === "vertical"
      ? direction > 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)"
      : "inset(0% 0 0% 0)";

  return {
    x: config.x ? config.x * direction * -config.exitDistance : 0,
    y: config.y * direction * -config.exitDistance,
    scale: config.exitScale,
    rotation: config.rotate * direction * -0.5,
    clipPath,
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
