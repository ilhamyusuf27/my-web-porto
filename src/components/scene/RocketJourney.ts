import * as THREE from "three";
import gsap from "gsap";
import type { Rocket } from "./RocketModel";

type RocketState = {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
};

/**
 * Authored rocket state per section (per AUDIT.md #2 / DESIGN.md section 11).
 * The ship stays on the right of the viewport so it never covers centered or
 * left-aligned content, and "launches" away in the contact section.
 */
const STATES: Record<string, RocketState> = {
  hero: { pos: [3.2, 1.6, 0], rot: [0, -0.5, 0.05], scale: 1 },
  about: { pos: [3.2, 0.7, 0], rot: [0, -0.62, 0.08], scale: 1 },
  skills: { pos: [3.4, 0.1, 0], rot: [0, -0.4, -0.05], scale: 1 },
  experience: { pos: [3.0, -0.2, 0], rot: [0, -0.7, 0.1], scale: 1 },
  projects: { pos: [3.5, 0.4, 0], rot: [0, -0.5, 0.0], scale: 1 },
  experimental: { pos: [3.0, -0.4, 0], rot: [0, -0.6, -0.08], scale: 1 },
  ongoing: { pos: [3.3, 0.0, 0], rot: [0, -0.5, 0.05], scale: 1 },
  education: { pos: [3.0, 0.7, 0], rot: [0, -0.6, 0.06], scale: 1 },
  // Contact: launch up and toward center-top, exiting the frame.
  contact: { pos: [1.4, 4.6, 0.5], rot: [0, 0, 0.0], scale: 1.18 },
};

const DEFAULT_STATE: RocketState = STATES.hero;

export type RocketJourneyOptions = {
  isMobile: boolean;
  reducedMotion: boolean;
};

export class RocketJourney {
  private readonly anchor = new THREE.Object3D();
  private idleTween: gsap.core.Tween | null = null;

  constructor(
    private readonly rocket: Rocket,
    scene: THREE.Scene,
    private readonly opts: RocketJourneyOptions
  ) {
    scene.add(this.anchor);
    this.anchor.add(rocket.group);

    if (!opts.reducedMotion) {
      this.startIdle();
    }
  }

  /** Animate the ship to a section's authored state. */
  go(id: string): void {
    const state = STATES[id] ?? DEFAULT_STATE;
    // Pull the ship a bit closer to the edge on narrow screens.
    const xMul = this.opts.isMobile ? 0.8 : 1;
    const launch = id === "contact";

    const duration = this.opts.reducedMotion ? 0 : launch ? 1.3 : 0.85;
    const ease = launch ? "power2.in" : "power2.inOut";

    if (duration === 0) {
      this.anchor.position.set(state.pos[0] * xMul, state.pos[1], state.pos[2]);
      this.anchor.rotation.set(state.rot[0], state.rot[1], state.rot[2]);
      this.rocket.group.scale.setScalar(state.scale);
      return;
    }

    gsap.to(this.anchor.position, {
      x: state.pos[0] * xMul,
      y: state.pos[1],
      z: state.pos[2],
      duration,
      ease,
      overwrite: "auto",
    });
    gsap.to(this.anchor.rotation, {
      x: state.rot[0],
      y: state.rot[1],
      z: state.rot[2],
      duration,
      ease: "power2.inOut",
      overwrite: "auto",
    });
    gsap.to(this.rocket.group.scale, {
      x: state.scale,
      y: state.scale,
      z: state.scale,
      duration: 0.85,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  /** Very small perpetual bob so the resting ship still feels alive. */
  private startIdle(): void {
    this.idleTween = gsap.to(this.rocket.group.position, {
      y: "+=0.1",
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  dispose(): void {
    this.idleTween?.kill();
    gsap.killTweensOf(this.anchor.position);
    gsap.killTweensOf(this.anchor.rotation);
    gsap.killTweensOf(this.rocket.group.scale);
    gsap.killTweensOf(this.rocket.group.position);
  }
}
