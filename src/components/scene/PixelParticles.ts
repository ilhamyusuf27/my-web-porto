import * as THREE from "three";

type Particle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
};

/**
 * Recycled thruster-trail particles emitted behind a moving point (the
 * rocket). Cheap CPU simulation over a fixed pool rendered as a single
 * THREE.Points cloud.
 */
export class PixelParticles {
  public readonly points: THREE.Points;
  private readonly particles: Particle[];
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly count: number;
  private readonly warm: THREE.Color;
  private readonly cool: THREE.Color;

  constructor(count = 80) {
    this.count = count;
    this.particles = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: -1,
      maxLife: 1,
    }));

    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.warm = new THREE.Color("#cdd6f4");
    this.cool = new THREE.Color("#cba6f7");

    // Park all particles offscreen until emitted.
    for (let i = 0; i < count; i++) {
      this.positions[i * 3 + 1] = -9999;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.4,
      map: this.makeSprite(),
      transparent: true,
      opacity: 0.38,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geometry, material);
  }

  /** Emit from a world position (the rocket nozzle). */
  emit(worldPos: THREE.Vector3, intensity = 1): void {
    const toSpawn = Math.ceil(intensity * 2);
    for (let s = 0; s < toSpawn; s++) {
      const p = this.particles.find((pt) => pt.life <= 0);
      if (!p) return;
      p.x = worldPos.x + (Math.random() - 0.5) * 0.1;
      p.y = worldPos.y;
      p.z = worldPos.z + (Math.random() - 0.5) * 0.1;
      p.vx = (Math.random() - 0.5) * 0.4;
      p.vy = -1.4 - Math.random() * 1.2;
      p.vz = (Math.random() - 0.5) * 0.4;
      p.maxLife = 0.5 + Math.random() * 0.4;
      p.life = p.maxLife;
    }
  }

  update(dt: number): void {
    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i];
      const i3 = i * 3;
      if (p.life <= 0) {
        this.positions[i3 + 1] = -9999;
        continue;
      }
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vy *= 0.96;

      this.positions[i3] = p.x;
      this.positions[i3 + 1] = p.y;
      this.positions[i3 + 2] = p.z;

      const t = Math.max(0, p.life / p.maxLife);
      const color = this.cool.clone().lerp(this.warm, t);
      this.colors[i3] = color.r * t;
      this.colors[i3 + 1] = color.g * t;
      this.colors[i3 + 2] = color.b * t;
    }
    this.points.geometry.getAttribute("position").needsUpdate = true;
    this.points.geometry.getAttribute("color").needsUpdate = true;
  }

  private makeSprite(): THREE.Texture {
    const size = 16;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
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
