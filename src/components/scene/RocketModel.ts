import * as THREE from "three";

export type Rocket = {
  group: THREE.Group;
  /** Engine glow mesh; the scene pulses it subtly. */
  flame: THREE.Mesh;
};

// Restrained palette: dark neutral hull + one mauve accent + a dim sky engine
// glow. No bright window, no red fins, no cartoon flame (per AUDIT.md #3).
const HULL = 0x313244; // surface-0
const HULL_LIGHT = 0x45475a; // surface-1
const PANEL = 0x181825; // mantle (recessed)
const ACCENT = 0xcba6f7; // mauve
const GLOW = 0x89dceb; // sky

function metal(color: number, opts: { metalness?: number; roughness?: number } = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metalness ?? 0.45,
    roughness: opts.roughness ?? 0.55,
    flatShading: true,
  });
}

/**
 * Angular compact exploration shuttle assembled from low-segment primitives
 * (faceted low-poly). Used until a real `public/assets/models/rocket.glb` is
 * dropped in; loadRocketGlb() auto-swaps when one is present.
 */
export function createRocket(): Rocket {
  const group = new THREE.Group();

  // Fuselage — hexagonal prism, narrowing toward the nose.
  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.58, 2.3, 6),
    metal(HULL)
  );
  group.add(fuselage);

  // Nose cone.
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.05, 6), metal(HULL_LIGHT));
  nose.position.y = 1.67;
  group.add(nose);

  // Single mauve accent band near the nose.
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.41, 0.41, 0.16, 6),
    new THREE.MeshStandardMaterial({
      color: ACCENT,
      emissive: ACCENT,
      emissiveIntensity: 0.35,
      metalness: 0.3,
      roughness: 0.4,
      flatShading: true,
    })
  );
  band.position.y = 1.0;
  group.add(band);

  // Cockpit viewport — dark faceted inset with a faint sky rim (not a bright window).
  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 6, 5),
    new THREE.MeshStandardMaterial({
      color: PANEL,
      emissive: GLOW,
      emissiveIntensity: 0.18,
      metalness: 0.5,
      roughness: 0.3,
      flatShading: true,
    })
  );
  cockpit.position.set(0, 0.7, 0.3);
  cockpit.scale.set(1, 0.8, 0.6);
  group.add(cockpit);

  // Delta wing — one angular horizontal wing spanning the hull.
  const wing = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.7), metal(HULL_LIGHT));
  wing.position.y = -0.35;
  group.add(wing);

  // Wing tip accents (thin mauve edge strips).
  const tipGeo = new THREE.BoxGeometry(0.08, 0.12, 0.72);
  const tipMat = new THREE.MeshStandardMaterial({
    color: ACCENT,
    emissive: ACCENT,
    emissiveIntensity: 0.3,
    metalness: 0.3,
    roughness: 0.4,
    flatShading: true,
  });
  const tipL = new THREE.Mesh(tipGeo, tipMat);
  tipL.position.set(-1.0, -0.35, 0);
  group.add(tipL);
  const tipR = new THREE.Mesh(tipGeo, tipMat);
  tipR.position.set(1.0, -0.35, 0);
  group.add(tipR);

  // Vertical stabilizer.
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.6), metal(HULL));
  fin.position.set(0, 0.25, -0.05);
  group.add(fin);

  // Engine nacelle.
  const nacelle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.26, 0.5, 6),
    metal(PANEL, { metalness: 0.6, roughness: 0.4 })
  );
  nacelle.position.y = -1.35;
  group.add(nacelle);

  // Engine glow (the "flame" reference) — dim, additive, technical.
  const glow = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.55, 6),
    new THREE.MeshBasicMaterial({
      color: GLOW,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  glow.rotation.x = Math.PI; // point down
  glow.position.y = -1.72;
  group.add(glow);

  return { group, flame: glow };
}

/**
 * Attempt to load a real GLB model. Resolves null if the file is missing or
 * the loader fails, so callers can fall back to the procedural shuttle.
 *
 * NOTE: only call this when a GLB is actually shipped (gate at the call site),
 * otherwise the dynamic GLTFLoader import is pulled in for nothing.
 */
export async function loadRocketGlb(url: string): Promise<THREE.Group | null> {
  try {
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    return gltf.scene;
  } catch {
    return null;
  }
}
