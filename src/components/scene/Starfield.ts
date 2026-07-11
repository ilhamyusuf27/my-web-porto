import * as THREE from "three";

const STAR_COLORS = [
  new THREE.Color("#cdd6f4"),
  new THREE.Color("#cba6f7"),
  new THREE.Color("#9399b2"),
];

/**
 * Layered starfield built from THREE.Points. Stars slowly drift downward to
 * imply forward flight, wrapping when they leave the volume.
 */
export class Starfield {
  public readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly bounds: number;
  private readonly count: number;

  constructor(count = 900, bounds = 60) {
    this.count = count;
    this.bounds = bounds;
    this.positions = new Float32Array(count * 3);

    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.positions[i3] = (Math.random() - 0.5) * bounds * 2;
      this.positions[i3 + 1] = (Math.random() - 0.5) * bounds * 2;
      this.positions[i3 + 2] = (Math.random() - 0.5) * bounds * 2;

      const color = STAR_COLORS[i % STAR_COLORS.length];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Small square sprite for a pixel look.
    const sprite = this.makeStarSprite();

    const material = new THREE.PointsMaterial({
      size: 0.55,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
  }

  /** Advance drift. dt in seconds, speed scales forward motion. */
  update(dt: number, speed = 1): void {
    const dy = dt * 1.6 * speed;
    const limit = this.bounds;
    for (let i = 0; i < this.count; i++) {
      const idx = i * 3 + 1;
      this.positions[idx] -= dy;
      if (this.positions[idx] < -limit) {
        this.positions[idx] = limit;
      }
    }
    this.points.geometry.getAttribute("position").needsUpdate = true;
  }

  private makeStarSprite(): THREE.Texture {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#ffffff";
    // Small square pixel point. Keep the starfield atmospheric, not ornamental.
    const c = size / 2;
    ctx.fillRect(c - 2, c - 2, 4, 4);
    ctx.globalAlpha = 0.35;
    ctx.fillRect(c - 1, c - 5, 2, 10);
    ctx.fillRect(c - 5, c - 1, 10, 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  dispose(): void {
    this.points.geometry.dispose();
    const mat = this.points.material as THREE.PointsMaterial;
    mat.map?.dispose();
    mat.dispose();
  }
}
