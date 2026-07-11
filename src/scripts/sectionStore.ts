/**
 * Tiny pub/sub for the active section. This is the single source of truth
 * shared by page snapping, the HUD nav, the scroll-progress bar, and the
 * Three.js rocket journey (see src/components/scene/RocketJourney.ts).
 */

type Listener = (id: string) => void;

let activeId: string | null = null;
const listeners = new Set<Listener>();

export function setActiveSection(id: string): void {
  if (id === activeId) return;
  activeId = id;
  listeners.forEach((l) => {
    try {
      l(id);
    } catch {
      /* a bad listener must never break scroll handling */
    }
  });
}

export function getActiveSection(): string | null {
  return activeId;
}

export function onActiveSection(cb: Listener): () => void {
  listeners.add(cb);
  if (activeId) cb(activeId);
  return () => {
    listeners.delete(cb);
  };
}
