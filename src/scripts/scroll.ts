import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getActiveSection, setActiveSection } from "./sectionStore";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouch = window.matchMedia("(max-width: 768px)").matches;

let sectionEls: HTMLElement[] = [];
let hudDesktopItems: NodeListOf<HTMLElement> | null = null;
let hudMobileItems: NodeListOf<HTMLElement> | null = null;
let isTransitioning = false;
let scrollTween: gsap.core.Animation | null = null;

const SECTION_TRANSITION_DURATION = 0.72;

type SectionTransitionStyle = {
  outgoing: gsap.TweenVars;
  incoming: gsap.TweenVars;
  scene: gsap.TweenVars;
  enterDuration?: number;
  exitDuration?: number;
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
 * are made readable up front, then the currently visible mission screen gets
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
      clearProps: "opacity,visibility,transform,transformOrigin,clipPath,willChange",
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

  window.addEventListener("wheel", (event) => {
    if (shouldIgnoreNavigationEvent(event.target)) return;

    if (isTransitioning) {
      event.preventDefault();
      return;
    }

    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    const currentIndex = getCurrentSectionIndex(sections);
    if (canReadTallSection(sections[currentIndex], direction)) return;

    const nextIndex = clampIndex(currentIndex + direction, sections);
    if (nextIndex === currentIndex) {
      event.preventDefault();
      scrollToSection(currentIndex, { immediate: false });
      return;
    }

    event.preventDefault();
    scrollToSection(nextIndex, { immediate: false });
  }, { passive: false });

  document.addEventListener("keydown", (event) => {
    if (shouldIgnoreNavigationEvent(event.target) || event.defaultPrevented) return;
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
    if (isTransitioning) return;
    scrollToSection(targetIndex, { immediate: false });
  });
}

function initScrollSettle(sections: HTMLElement[]): void {
  let settleTimer = 0;

  const settle = () => {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      if (isTransitioning || shouldIgnoreNavigationEvent(document.activeElement)) return;

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
 * the shared store (drives HUD + rocket). Falls back to scroll-position math
 * when IntersectionObserver is unavailable.
 */
function initActiveSection(sections: HTMLElement[]): void {
  hudDesktopItems = document.querySelectorAll<HTMLElement>("[data-hud-item]");
  hudMobileItems = document.querySelectorAll<HTMLElement>("[data-hud-mobile-item]");

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
      if (visible) syncActiveSection(visible.target.getAttribute("data-section") ?? "hero");
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
  );

  syncActiveSection(sections[getNearestSectionIndex(sections)]?.id ?? "hero");
  sections.forEach((section) => observer.observe(section));
}

function initAnchorNavigation(sections: HTMLElement[], immediate: boolean): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
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
  syncActiveSection(id);

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
 * One timeline coordinates page travel and both mission-panel states. Content
 * between non-adjacent anchor targets is temporarily hidden so a long jump
 * does not read as several normal stacked sections flying past.
 */
function createSectionTransition(
  currentIndex: number,
  targetIndex: number,
  y: number,
  id: string
): gsap.core.Timeline {
  const direction = targetIndex > currentIndex ? 1 : -1;
  const outgoing = getSectionMotionTargets(sectionEls[currentIndex]);
  const incoming = getSectionMotionTargets(sectionEls[targetIndex]);
  const outgoingStyle = getSectionTransitionStyle(sectionEls[currentIndex], direction);
  const incomingStyle = getSectionTransitionStyle(sectionEls[targetIndex], direction);
  const sceneLayer = getSceneLayer();
  const intermediate = sectionEls
    .slice(
      Math.min(currentIndex, targetIndex) + 1,
      Math.max(currentIndex, targetIndex)
    )
    .flatMap(getSectionMotionTargets);
  const cleanupTargets = [...outgoing, ...incoming, ...intermediate, sceneLayer].filter(
    (element): element is HTMLElement => element !== null
  );

  gsap.set(cleanupTargets, { willChange: "transform,opacity,clip-path" });
  gsap.set([...outgoing, ...incoming], { transformOrigin: "50% 50%" });
  gsap.set(incoming, { autoAlpha: 0, ...incomingStyle.incoming });
  gsap.set(intermediate, { autoAlpha: 0 });

  const timeline = gsap.timeline({
    onComplete: () => finishSectionTransition(id, cleanupTargets),
    onInterrupt: () => finishSectionTransition(id, cleanupTargets),
  });

  timeline
    .to(
      outgoing,
      {
        autoAlpha: 0,
        ...outgoingStyle.outgoing,
        duration: outgoingStyle.exitDuration ?? 0.26,
        stagger: 0.025,
        ease: "power2.out",
      },
      0
    )
    .to(
      sceneLayer,
      {
        ...incomingStyle.scene,
        duration: 0.34,
        ease: "power2.out",
      },
      0
    )
    .to(
      window,
      {
        scrollTo: { y, autoKill: false },
        duration: SECTION_TRANSITION_DURATION,
        ease: "power3.inOut",
        overwrite: true,
      },
      0
    )
    .to(
      sceneLayer,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.46,
        ease: "power3.out",
      },
      0.28
    )
    .to(
      incoming,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: incomingStyle.enterDuration ?? 0.42,
        stagger: 0.04,
        ease: "power3.out",
      },
      0.26
    );

  return timeline;
}

function finishSectionTransition(id: string, cleanupTargets: HTMLElement[] = []): void {
  if (cleanupTargets.length) {
    gsap.set(cleanupTargets, {
      clearProps: "opacity,visibility,transform,transformOrigin,clipPath,willChange",
    });
  }
  isTransitioning = false;
  scrollTween = null;
  document.documentElement.removeAttribute("data-section-transitioning");
  syncActiveSection(id);
  ScrollTrigger.refresh();
}

function getSectionMotionTargets(section: HTMLElement | undefined): HTMLElement[] {
  if (!section) return [];

  return [
    section.querySelector<HTMLElement>(".section__chrome"),
    section.querySelector<HTMLElement>(".section__inner"),
  ].filter((element): element is HTMLElement => element !== null);
}

function getSceneLayer(): HTMLElement | null {
  return document.getElementById("scene-layer");
}

function getInitialSectionMotion(section: HTMLElement | undefined): gsap.TweenVars {
  const id = section?.getAttribute("data-section") ?? section?.id ?? "";

  if (id === "hero" || id === "about") return { x: 14, y: 0 };
  if (id === "projects") return { scale: 0.975, y: 4 };
  if (id === "experimental" || id === "ongoing") return { x: 10, y: 10 };
  if (id === "education" || id === "contact") return { x: 4, y: 8 };
  return { y: 14 };
}

function getSectionTransitionStyle(
  section: HTMLElement | undefined,
  direction: number
): SectionTransitionStyle {
  const id = section?.getAttribute("data-section") ?? section?.id ?? "";

  if (id === "hero" || id === "about") {
    return {
      outgoing: {
        x: direction * -22,
        y: 0,
        clipPath: direction > 0 ? "inset(0% 8% 0% 0%)" : "inset(0% 0% 0% 8%)",
      },
      incoming: {
        x: direction * 18,
        y: 0,
        clipPath: direction > 0 ? "inset(0% 0% 0% 10%)" : "inset(0% 10% 0% 0%)",
      },
      scene: { x: direction * -10, y: -2, scale: 1.012 },
    };
  }

  if (id === "projects") {
    return {
      outgoing: { autoAlpha: 0, scale: 0.972, y: direction * -6 },
      incoming: {
        scale: 0.965,
        y: direction * 6,
        clipPath: "inset(4% 4% 4% 4%)",
      },
      scene: { x: direction * -6, y: direction * -4, scale: 1.022 },
      enterDuration: 0.5,
      exitDuration: 0.3,
    };
  }

  if (id === "experimental" || id === "ongoing") {
    return {
      outgoing: {
        x: direction * -14,
        y: direction * -12,
        clipPath: "inset(0% 6% 6% 0%)",
      },
      incoming: {
        x: direction * 14,
        y: direction * 12,
        clipPath: "inset(6% 0% 0% 6%)",
      },
      scene: { x: direction * -8, y: direction * -6, scale: 1.016 },
    };
  }

  if (id === "education" || id === "contact") {
    return {
      outgoing: { x: direction * -5, y: direction * -8 },
      incoming: {
        x: direction * 5,
        y: direction * 10,
        clipPath: direction > 0 ? "inset(3% 0% 0% 0%)" : "inset(0% 0% 3% 0%)",
      },
      scene: { x: direction * -5, y: direction * -5, scale: 1.01 },
      enterDuration: 0.4,
    };
  }

  return {
    outgoing: { y: direction * -14, clipPath: "inset(0% 0% 5% 0%)" },
    incoming: {
      y: direction * 16,
      clipPath: direction > 0 ? "inset(5% 0% 0% 0%)" : "inset(0% 0% 5% 0%)",
    },
    scene: { x: direction * -6, y: direction * -4, scale: 1.014 },
  };
}

function syncActiveSection(id: string): void {
  setActiveSection(id);
  hudDesktopItems?.forEach((el) =>
    el.setAttribute("aria-current", el.dataset.hudItem === id ? "true" : "false")
  );
  hudMobileItems?.forEach((el) => {
    if (el.dataset.hudMobileItem === id) el.setAttribute("aria-current", "true");
    else el.removeAttribute("aria-current");
  });
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

function canReadTallSection(section: HTMLElement | undefined, direction: number): boolean {
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
  if (target.closest("input, textarea, select, [contenteditable='true']")) return true;
  return Boolean(target.closest("[data-scroll-native]"));
}
