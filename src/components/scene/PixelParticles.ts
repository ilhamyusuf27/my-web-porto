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
 * ship). Cheap CPU simulation over a fixed pool rendered as a single
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
    this.warm = new THREE.Color("#89b4fa");
    this.cool = new THREE.Color("#cba6f7");

    // Park all particles offscreen until emitted.
    for (let i = 0; i < count; i++) {
      this.positions[i * 3 + 1] = -9999;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.28,
      map: this.makeSprite(),
      transparent: true,
      opacity: 0.22,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geometry, material);
  }

  /** Emit from a world position and drift away along the supplied direction. */
  emit(worldPos: THREE.Vector3, intensity = 1, direction = new THREE.Vector3(0, -1, 0)): void {
    const toSpawn = Math.ceil(intensity * 2);
    const dir = direction.clone().normalize();
    for (let s = 0; s < toSpawn; s++) {
      const p = this.particles.find((pt) => pt.life <= 0);
      if (!p) return;
      const speed = 0.55 + Math.random() * 0.45;
      p.x = worldPos.x + (Math.random() - 0.5) * 0.06;
      p.y = worldPos.y + (Math.random() - 0.5) * 0.04;
      p.z = worldPos.z + (Math.random() - 0.5) * 0.06;
      p.vx = dir.x * speed + (Math.random() - 0.5) * 0.16;
      p.vy = dir.y * speed + (Math.random() - 0.5) * 0.12;
      p.vz = dir.z * speed + (Math.random() - 0.5) * 0.16;
      p.maxLife = 0.28 + Math.random() * 0.24;
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
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.vz *= 0.98;

      this.positions[i3] = p.x;
      this.positions[i3 + 1] = p.y;
      this.positions[i3 + 2] = p.z;

      const t = Math.max(0, p.life / p.maxLife);
      const color = this.cool.clone().lerp(this.warm, t);
      const fade = t * 0.78;
      this.colors[i3] = color.r * fade;
      this.colors[i3 + 1] = color.g * fade;
      this.colors[i3 + 2] = color.b * fade;
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
