/**
 * Tiny pub/sub for the active section. This is the single source of truth
 * shared by page snapping, the HUD nav, the scroll-progress bar, and ambient
 * background cues.
 */

type Listener = (id: string) => void;
type TransitionListener = (id: string) => void;

let activeId: string | null = null;
const listeners = new Set<Listener>();
const transitionListeners = new Set<TransitionListener>();

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

/**
 * Signals the visual hand-off before the active section changes. Keeping this
 * separate lets ambient motion bridge the outgoing and incoming screens while
 * navigation state stays truthful until the destination is in place.
 */
export function cueSectionTransition(id: string): void {
  transitionListeners.forEach((listener) => {
    try {
      listener(id);
    } catch {
      /* visual listeners must never break navigation */
    }
  });
}

export function onSectionTransition(cb: TransitionListener): () => void {
  transitionListeners.add(cb);
  return () => {
    transitionListeners.delete(cb);
  };
}
