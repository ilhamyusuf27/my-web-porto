import * as THREE from "three";
import { Starfield } from "./Starfield";
import { PixelParticles } from "./PixelParticles";
import { createRocket, type Rocket } from "./RocketModel";
import { RocketJourney } from "./RocketJourney";
import { onActiveSection, getActiveSection } from "../../scripts/sectionStore";

export type SpaceSceneOptions = {
  canvas: HTMLCanvasElement;
};

/**
 * Pixel-art space scene. The whole 3D world is rendered at a deliberately low
 * internal resolution and upscaled with nearest-neighbor filtering
 * (`image-rendering: pixelated`), which is what actually produces the pixel
 * look (low-poly alone does not, per AUDIT.md #4).
 *
 * Motion is event-driven: the RocketJourney tweens the ship to an authored
 * state whenever the active section changes (shared store), rather than
 * mapping it to raw scroll progress.
 */
export class SpaceScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();
  private readonly starfield: Starfield;
  private readonly particles: PixelParticles;
  private readonly pixelScale: number;

  private rocket: Rocket | null = null;
  private journey: RocketJourney | null = null;
  private unsubscribe: (() => void) | null = null;
  private rafId = 0;
  private disposed = false;

  private readonly isMobile: boolean;
  private readonly reducedMotion: boolean;
  private readonly nozzleWorld = new THREE.Vector3();

  constructor({ canvas }: SpaceSceneOptions) {
    this.isMobile = window.matchMedia("(max-width: 768px)").matches;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.pixelScale = this.isMobile ? 0.55 : 0.5;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false, // intentional: pixelation, not smooth edges
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(1); // low-res buffer is the pixelation source
    this.applyPixelSize();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x11111b, 12, 38);

    this.camera = new THREE.PerspectiveCamera(52, this.aspect(), 0.1, 120);
    this.camera.position.set(0, 0, 9);

    // Restrained lighting: cool ambient + one key + faint rim.
    this.scene.add(new THREE.AmbientLight(0xa6adc8, 0.7));
    const key = new THREE.DirectionalLight(0xe6e0ff, 1.0);
    key.position.set(4, 6, 6);
    this.scene.add(key);
    const rim = new THREE.PointLight(0x89b4fa, 0.8, 30);
    rim.position.set(-6, 2, 4);
    this.scene.add(rim);

    const starCount = this.isMobile ? 180 : 360;
    this.starfield = new Starfield(starCount, 32);
    this.scene.add(this.starfield.points);

    this.particles = new PixelParticles(this.isMobile ? 18 : 34);
    this.scene.add(this.particles.points);

    this.initRocket();

    window.addEventListener("resize", this.handleResize);
    document.addEventListener("visibilitychange", this.handleVisibility);
  }

  private initRocket(): void {
    // No GLB ships yet, so we use the procedural shuttle directly. To ship a
    // real model later: drop public/assets/models/rocket.glb, then dynamically
    // import loadRocketGlb() here (keeps GLTFLoader out of the default bundle).
    const rocket = createRocket();
    if (this.disposed) return;

    this.rocket = rocket;
    this.journey = new RocketJourney(rocket, this.scene, {
      isMobile: this.isMobile,
      reducedMotion: this.reducedMotion,
    });

    if (this.reducedMotion) {
      // Static, unobtrusive position; no section-driven motion or particles.
      this.journey.go("hero");
      this.renderOnce();
    } else {
      this.journey.go(getActiveSection() ?? "hero");
      this.unsubscribe = onActiveSection((id) => this.journey?.go(id));
      this.loop();
    }
  }

  // ---------- pixelation helpers ----------

  private aspect(): number {
    return window.innerWidth / window.innerHeight;
  }

  /** Size the drawing buffer to a fraction of the CSS pixels. */
  private applyPixelSize(): void {
    const w = Math.max(2, Math.floor(window.innerWidth * this.pixelScale));
    const h = Math.max(2, Math.floor(window.innerHeight * this.pixelScale));
    this.renderer.setSize(w, h, false); // false: don't override CSS size
  }

  private renderOnce(): void {
    this.renderer.render(this.scene, this.camera);
  }

  // ---------- main loop ----------

  private loop = (): void => {
    if (this.disposed) return;
    this.rafId = window.requestAnimationFrame(this.loop);

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;

    this.starfield.update(dt, 0.8);

    // Subtle engine-glow pulse (no cartoon flame).
    if (this.rocket) {
      const pulse = 0.34 + Math.sin(elapsed * 6) * 0.06;
      const mat = this.rocket.flame.material as THREE.MeshBasicMaterial;
      mat.opacity = pulse;
      this.rocket.flame.scale.setScalar(0.78 + Math.sin(elapsed * 6) * 0.04);

      // Thruster trail from the engine nozzle (world space).
      const offset = new THREE.Vector3(0, -1.9, 0);
      this.rocket.group.localToWorld(this.nozzleWorld.copy(offset));
      this.particles.emit(this.nozzleWorld, 0.35);
    }

    this.particles.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  private handleResize = (): void => {
    this.camera.aspect = this.aspect();
    this.camera.updateProjectionMatrix();
    this.applyPixelSize();
    if (this.reducedMotion) this.renderOnce();
  };

  private handleVisibility = (): void => {
    if (document.hidden) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    } else if (!this.reducedMotion && !this.disposed && this.rafId === 0) {
      this.clock.getDelta();
      this.loop();
    }
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.unsubscribe?.();
    this.journey?.dispose();
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.starfield.dispose();
    this.particles.dispose();
    this.rocket?.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      }
    });
    this.renderer.dispose();
  }
}
