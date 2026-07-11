import * as THREE from "three";
import {
  getActiveSection,
  onActiveSection,
  onSectionTransition,
} from "../../scripts/sectionStore";

type AmbientSystemSceneOptions = {
  canvas: HTMLCanvasElement;
};

type Point2 = readonly [x: number, z: number];
type Point3 = readonly [x: number, y: number, z: number];
type NodePair = readonly [from: number, to: number];

type WireframeState = {
  nodes: readonly Point3[];
  rotation: Point3;
  scale: number;
  lineOpacity: number;
  nodeOpacity: number;
  signalRoute: readonly number[];
};

type SectionMode = {
  camera: Point3;
  target: Point3;
  grid: {
    extent: number;
    spacing: number;
    rotation: number;
    opacity: number;
  };
  wireframe: WireframeState;
  signalOpacity: number;
  pulseOpacity: number;
  signalDuration: number;
  drift: Point2;
  activeMotion: {
    linePulse: number;
    nodePulse: number;
    sway: Point3;
    speed: number;
    signalScale: number;
  };
  transitionSignalBoost?: number;
  transitionPulseBoost?: number;
};

const NODE_COUNT = 18;
const GRID_SEGMENT_COUNT = 48;
const TRANSITION_DURATION = 0.62;

const NODE_LINKS: readonly NodePair[] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [1, 5],
  [5, 6],
  [6, 2],
  [2, 7],
  [7, 8],
  [8, 3],
  [0, 9],
  [9, 10],
  [10, 5],
  [4, 11],
  [11, 12],
  [12, 8],
  [5, 13],
  [13, 14],
  [14, 7],
  [6, 15],
  [15, 16],
  [16, 8],
  [10, 13],
  [14, 16],
  [11, 17],
  [17, 12],
];

const BASE_NODES: readonly Point3[] = [
  [-2.4, 0.2, 0.2],
  [-1.4, 0.48, -0.45],
  [-0.35, 0.76, 0],
  [0.9, 0.6, -0.35],
  [2.05, 0.36, 0.15],
  [-1.35, 1.3, -0.95],
  [-0.25, 1.52, -1.02],
  [-0.2, 0.25, 0.95],
  [0.85, 0.36, 0.92],
  [-2.18, 0.95, 0.82],
  [-1.55, 1.55, 0.55],
  [2.0, 1.05, -0.72],
  [1.2, 1.5, -0.85],
  [-0.95, 1.98, 0.05],
  [0.18, 1.82, 0.52],
  [0.32, 2.2, -1.3],
  [1.22, 1.95, -0.05],
  [2.55, 0.8, 0.65],
];

const easeInOut = (value: number) => value * value * (3 - 2 * value);
const v3 = ([x, y, z]: Point3) => new THREE.Vector3(x, y, z);
const lerpPoint3 = (from: Point3, to: Point3, progress: number): Point3 => [
  THREE.MathUtils.lerp(from[0], to[0], progress),
  THREE.MathUtils.lerp(from[1], to[1], progress),
  THREE.MathUtils.lerp(from[2], to[2], progress),
];

function makeNodes(
  transform: (node: Point3, index: number) => Point3
): readonly Point3[] {
  return BASE_NODES.map(transform);
}

function buildWireframeState(id: string): WireframeState {
  if (id === "about") {
    return {
      nodes: makeNodes(([x, y, z], index) => {
        const core = index > 4 ? 0.9 : 1;
        return [x * core * 0.78, y * 1.12 + 0.06, z * core * 0.72];
      }),
      rotation: [0.03, -0.12, 0],
      scale: 1.02,
      lineOpacity: 0.28,
      nodeOpacity: 0.38,
      signalRoute: [9, 10, 13, 14, 16, 8],
    };
  }

  if (id === "skills") {
    return {
      nodes: makeNodes(([, y], index) => {
        const column = index % 6;
        const row = Math.floor(index / 6);
        return [
          -2.25 + column * 0.9,
          0.36 + row * 0.66 + (column % 2) * 0.06 + y * 0.04,
          -0.95 + row * 0.82,
        ];
      }),
      rotation: [-0.02, 0.08, 0.015],
      scale: 1.04,
      lineOpacity: 0.3,
      nodeOpacity: 0.36,
      signalRoute: [0, 1, 5, 6, 2, 7, 8, 3, 4],
    };
  }

  if (id === "experience") {
    return {
      nodes: makeNodes(([x, y, z], index) => [
        x * 1.15,
        0.34 + index * 0.075 + y * 0.18,
        z * 0.42 + Math.sin(index * 0.9) * 0.28,
      ]),
      rotation: [0.02, -0.18, 0.01],
      scale: 1.05,
      lineOpacity: 0.32,
      nodeOpacity: 0.34,
      signalRoute: [0, 1, 2, 3, 4, 11, 17],
    };
  }

  if (id === "projects") {
    return {
      nodes: makeNodes(([, y], index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        return [
          -1.35 + column * 1.22,
          0.3 + row * 0.34 + y * 0.05,
          -1.35 + row * 0.46,
        ];
      }),
      rotation: [0, 0.02, 0],
      scale: 0.96,
      lineOpacity: 0.18,
      nodeOpacity: 0.2,
      signalRoute: [0, 1, 2, 3, 4],
    };
  }

  if (id === "experimental") {
    return {
      nodes: makeNodes(([x, y, z], index) => {
        const branch = index % 3 === 0 ? 0.52 : index % 3 === 1 ? -0.34 : 0.12;
        return [
          x * 1.08 + branch,
          y * 1.04 + (index % 4) * 0.08,
          z * 1.05 + Math.sin(index * 1.7) * 0.28,
        ];
      }),
      rotation: [0.04, 0.16, -0.025],
      scale: 1.03,
      lineOpacity: 0.31,
      nodeOpacity: 0.34,
      signalRoute: [9, 10, 13, 5, 6, 15, 16, 8, 17],
    };
  }

  if (id === "ongoing") {
    return {
      nodes: makeNodes(([x, y, z], index) => {
        const lane = index % 3;
        return [
          x * 1.05,
          y * 0.74 + lane * 0.16,
          -1.05 + lane * 0.82 + Math.floor(index / 6) * 0.14 + z * 0.12,
        ];
      }),
      rotation: [0.012, -0.1, 0],
      scale: 1.02,
      lineOpacity: 0.25,
      nodeOpacity: 0.27,
      signalRoute: [0, 9, 10, 13, 14, 16, 8, 3, 4],
    };
  }

  if (id === "education") {
    return {
      nodes: makeNodes(([, y], index) => {
        const layer = Math.floor(index / 6);
        const slot = index % 6;
        const depth = layer * 0.78;
        const shelfOffset = layer === 1 ? 0.18 : layer === 2 ? -0.12 : 0;
        return [
          -1.95 + slot * 0.78 + shelfOffset,
          0.28 + layer * 0.46 + y * 0.16 + (slot % 2) * 0.035,
          -1.45 + depth + Math.sin(slot * 0.8) * 0.08,
        ];
      }),
      rotation: [0.08, -0.18, 0.015],
      scale: 1.06,
      lineOpacity: 0.31,
      nodeOpacity: 0.3,
      signalRoute: [0, 1, 2, 8, 14, 15, 16, 17],
    };
  }

  if (id === "contact") {
    return {
      nodes: makeNodes(([x, y, z], index) => {
        const side = x < 0 ? -1 : 1;
        const resolve = Math.abs(x) < 0.5 ? 0.58 : 1;
        return [x * resolve + side * 0.12, y * 0.88 + 0.12, z * 0.58];
      }),
      rotation: [0.02, 0, 0],
      scale: 0.97,
      lineOpacity: 0.34,
      nodeOpacity: 0.42,
      signalRoute: [0, 1, 2, 3, 4],
    };
  }

  return {
    nodes: makeNodes(([x, y, z], index) => [
      x * 0.82 + 0.34,
      y * 0.78 + (index > 8 ? 0.12 : 0),
      z * 0.64 - 0.08,
    ]),
    rotation: [0.02, -0.12, 0],
    scale: 0.94,
    lineOpacity: 0.2,
    nodeOpacity: 0.22,
    signalRoute: [0, 1, 2, 3, 4],
  };
}

const MODES: Record<string, SectionMode> = {
  hero: {
    camera: [0.26, 4.9, 6.35],
    target: [0.22, 0.82, 0.08],
    grid: { extent: 5.5, spacing: 0.55, rotation: -0.04, opacity: 0.14 },
    wireframe: buildWireframeState("hero"),
    signalOpacity: 0.2,
    pulseOpacity: 0.16,
    signalDuration: 5.8,
    drift: [0.025, 0.035],
    activeMotion: {
      linePulse: 0.12,
      nodePulse: 0.12,
      sway: [0.006, 0.012, 0],
      speed: 0.34,
      signalScale: 1.08,
    },
    transitionSignalBoost: 1.14,
    transitionPulseBoost: 1.14,
  },
  about: {
    camera: [0.15, 5.6, 5.2],
    target: [-0.1, 0.95, 0.08],
    grid: { extent: 4.7, spacing: 0.72, rotation: -0.08, opacity: 0.14 },
    wireframe: buildWireframeState("about"),
    signalOpacity: 0.23,
    pulseOpacity: 0.22,
    signalDuration: 6.4,
    drift: [0.018, 0.025],
    activeMotion: {
      linePulse: 0.1,
      nodePulse: 0.16,
      sway: [0.004, 0.008, 0],
      speed: 0.26,
      signalScale: 1.02,
    },
  },
  skills: {
    camera: [-0.35, 5.9, 5.35],
    target: [0.15, 1.0, 0.05],
    grid: { extent: 4.6, spacing: 0.46, rotation: 0.05, opacity: 0.17 },
    wireframe: buildWireframeState("skills"),
    signalOpacity: 0.25,
    pulseOpacity: 0.24,
    signalDuration: 7.2,
    drift: [0.015, 0.02],
    activeMotion: {
      linePulse: 0.13,
      nodePulse: 0.12,
      sway: [0.003, 0.01, 0.002],
      speed: 0.22,
      signalScale: 1.04,
    },
  },
  experience: {
    camera: [0.45, 4.4, 6.8],
    target: [0.15, 0.9, 0.25],
    grid: { extent: 5.2, spacing: 0.7, rotation: -0.12, opacity: 0.13 },
    wireframe: buildWireframeState("experience"),
    signalOpacity: 0.3,
    pulseOpacity: 0.27,
    signalDuration: 4.8,
    drift: [0.025, 0.015],
    activeMotion: {
      linePulse: 0.12,
      nodePulse: 0.12,
      sway: [0.004, 0.012, 0.001],
      speed: 0.3,
      signalScale: 1.06,
    },
  },
  projects: {
    camera: [0, 5.2, 6.1],
    target: [0, 0.82, 0.2],
    grid: { extent: 5, spacing: 0.9, rotation: 0, opacity: 0.085 },
    wireframe: buildWireframeState("projects"),
    signalOpacity: 0.14,
    pulseOpacity: 0.12,
    signalDuration: 8.5,
    drift: [0.012, 0.014],
    activeMotion: {
      linePulse: 0.06,
      nodePulse: 0.06,
      sway: [0.001, 0.004, 0],
      speed: 0.16,
      signalScale: 0.94,
    },
  },
  experimental: {
    camera: [-0.45, 4.9, 6.45],
    target: [0.12, 0.88, 0.18],
    grid: { extent: 5.1, spacing: 0.76, rotation: 0.1, opacity: 0.12 },
    wireframe: buildWireframeState("experimental"),
    signalOpacity: 0.27,
    pulseOpacity: 0.25,
    signalDuration: 5.4,
    drift: [0.03, 0.022],
    activeMotion: {
      linePulse: 0.15,
      nodePulse: 0.14,
      sway: [0.007, 0.016, 0.003],
      speed: 0.32,
      signalScale: 1.08,
    },
  },
  ongoing: {
    camera: [0.5, 4.65, 6.65],
    target: [-0.08, 0.88, 0.3],
    grid: { extent: 5.2, spacing: 0.72, rotation: -0.06, opacity: 0.11 },
    wireframe: buildWireframeState("ongoing"),
    signalOpacity: 0.25,
    pulseOpacity: 0.21,
    signalDuration: 5.2,
    drift: [0.022, 0.026],
    activeMotion: {
      linePulse: 0.1,
      nodePulse: 0.1,
      sway: [0.003, 0.012, 0],
      speed: 0.24,
      signalScale: 1.04,
    },
  },
  education: {
    camera: [0.36, 5.65, 6.05],
    target: [0.08, 1.02, -0.05],
    grid: { extent: 5.05, spacing: 0.72, rotation: -0.08, opacity: 0.14 },
    wireframe: buildWireframeState("education"),
    signalOpacity: 0.22,
    pulseOpacity: 0.16,
    signalDuration: 8.6,
    drift: [0.012, 0.02],
    activeMotion: {
      linePulse: 0.08,
      nodePulse: 0.08,
      sway: [0.006, 0.006, 0.001],
      speed: 0.18,
      signalScale: 0.98,
    },
  },
  contact: {
    camera: [0, 5.35, 5.75],
    target: [0, 0.9, 0.05],
    grid: { extent: 4.5, spacing: 0.85, rotation: 0, opacity: 0.12 },
    wireframe: buildWireframeState("contact"),
    signalOpacity: 0.32,
    pulseOpacity: 0.3,
    signalDuration: 4.6,
    drift: [0.012, 0.014],
    activeMotion: {
      linePulse: 0.14,
      nodePulse: 0.18,
      sway: [0.003, 0.008, 0],
      speed: 0.34,
      signalScale: 1.1,
    },
    transitionSignalBoost: 1.1,
    transitionPulseBoost: 1.18,
  },
};

function buildGrid(mode: SectionMode): Float32Array {
  const positions = new Float32Array(GRID_SEGMENT_COUNT * 6);
  const { extent, spacing } = mode.grid;
  const lineCount = Math.min(
    Math.floor((extent * 2) / spacing) + 1,
    GRID_SEGMENT_COUNT / 2
  );
  let offset = 0;

  for (let index = 0; index < lineCount; index += 1) {
    const coordinate =
      -extent + index * ((extent * 2) / Math.max(1, lineCount - 1));
    positions.set([-extent, 0, coordinate, extent, 0, coordinate], offset);
    offset += 6;
    positions.set([coordinate, 0, -extent, coordinate, 0, extent], offset);
    offset += 6;
  }

  return positions;
}

function buildWireframeLines(nodes: readonly Point3[]): Float32Array {
  const positions = new Float32Array(NODE_LINKS.length * 6);
  NODE_LINKS.forEach(([fromIndex, toIndex], index) => {
    const from = nodes[fromIndex] ?? nodes[0];
    const to = nodes[toIndex] ?? nodes[0];
    positions.set([...from, ...to], index * 6);
  });
  return positions;
}

function buildNodePositions(nodes: readonly Point3[]): Float32Array {
  const positions = new Float32Array(NODE_COUNT * 3);
  nodes.slice(0, NODE_COUNT).forEach((node, index) => {
    positions.set(node, index * 3);
  });
  return positions;
}

function interpolateArray(
  target: ArrayLike<number>,
  from: ArrayLike<number>,
  to: ArrayLike<number>,
  progress: number
): void {
  for (let index = 0; index < target.length; index += 1) {
    target[index] = THREE.MathUtils.lerp(from[index] ?? 0, to[index] ?? 0, progress);
  }
}

export class AmbientSystemScene {
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(36, 1, 0.1, 80);
  private readonly root = new THREE.Group();
  private readonly wireframeRoot = new THREE.Group();
  private readonly clock = new THREE.Clock();
  private readonly reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  private readonly compactViewport = window.matchMedia("(max-width: 760px)");
  private readonly gridMaterial = new THREE.LineBasicMaterial({
    color: 0xa6adc8,
    transparent: true,
    depthWrite: false,
  });
  private readonly wireMaterial = new THREE.LineBasicMaterial({
    color: 0xa6adc8,
    transparent: true,
    depthWrite: false,
  });
  private readonly nodeMaterial = new THREE.PointsMaterial({
    color: 0xcba6f7,
    size: 0.035,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
  });
  private readonly signalMaterial = new THREE.MeshBasicMaterial({
    color: 0xcba6f7,
    transparent: true,
    depthWrite: false,
  });
  private readonly pulseMaterial = new THREE.MeshBasicMaterial({
    color: 0xcba6f7,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  private readonly gridGeometry = new THREE.BufferGeometry();
  private readonly wireGeometry = new THREE.BufferGeometry();
  private readonly nodeGeometry = new THREE.BufferGeometry();
  private readonly grid = new THREE.LineSegments(
    this.gridGeometry,
    this.gridMaterial
  );
  private readonly wireframe = new THREE.LineSegments(
    this.wireGeometry,
    this.wireMaterial
  );
  private readonly nodes = new THREE.Points(this.nodeGeometry, this.nodeMaterial);
  private readonly signal = new THREE.Mesh(
    new THREE.SphereGeometry(0.038, 10, 8),
    this.signalMaterial
  );
  private readonly pulse = new THREE.Mesh(
    new THREE.RingGeometry(0.055, 0.072, 24),
    this.pulseMaterial
  );
  private readonly removeActiveListener: () => void;
  private readonly removeTransitionListener: () => void;
  private readonly handleResize = () => this.resize();
  private readonly handleVisibility = () => this.renderOnce();
  private readonly handleMotionPreference = () => this.syncAnimationState();
  private animationFrame = 0;
  private disposed = false;
  private activeMode = MODES.hero;
  private transitionFrom = MODES.hero;
  private transitionTo = MODES.hero;
  private transitionAge = TRANSITION_DURATION;
  private signalProgress = 0;
  private pulseAge = 999;
  private readonly cameraFrom = v3(MODES.hero.camera);
  private readonly cameraTo = v3(MODES.hero.camera);
  private readonly targetFrom = v3(MODES.hero.target);
  private readonly targetTo = v3(MODES.hero.target);
  private readonly gridFrom = buildGrid(MODES.hero);
  private readonly gridTo = buildGrid(MODES.hero);
  private readonly wireFrom = buildWireframeLines(MODES.hero.wireframe.nodes);
  private readonly wireTo = buildWireframeLines(MODES.hero.wireframe.nodes);
  private readonly nodesFrom = buildNodePositions(MODES.hero.wireframe.nodes);
  private readonly nodesTo = buildNodePositions(MODES.hero.wireframe.nodes);
  private transitionSignalBoost = 1;
  private transitionPulseBoost = 1;

  constructor({ canvas }: AmbientSystemSceneOptions) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    this.gridGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buildGrid(MODES.hero), 3)
    );
    this.wireGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buildWireframeLines(MODES.hero.wireframe.nodes), 3)
    );
    this.nodeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(buildNodePositions(MODES.hero.wireframe.nodes), 3)
    );

    this.gridMaterial.opacity = MODES.hero.grid.opacity;
    this.wireMaterial.opacity = MODES.hero.wireframe.lineOpacity;
    this.nodeMaterial.opacity = MODES.hero.wireframe.nodeOpacity;
    this.signalMaterial.opacity = MODES.hero.signalOpacity;
    this.camera.position.copy(this.cameraTo);
    this.camera.lookAt(this.targetTo);

    this.wireframeRoot.add(this.wireframe, this.nodes, this.signal, this.pulse);
    this.root.add(this.grid, this.wireframeRoot);
    this.scene.add(this.root);

    this.applyWireframeTransform(MODES.hero.wireframe);
    this.resize();
    window.addEventListener("resize", this.handleResize, { passive: true });
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.reduceMotion.addEventListener("change", this.handleMotionPreference);
    this.compactViewport.addEventListener(
      "change",
      this.handleMotionPreference
    );

    this.removeActiveListener = onActiveSection((id) => this.setMode(id));
    this.removeTransitionListener = onSectionTransition((id) =>
      this.setMode(id)
    );
    this.setMode(getActiveSection() ?? "hero", true);
    this.syncAnimationState();
  }

  dispose(): void {
    this.disposed = true;
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    this.reduceMotion.removeEventListener(
      "change",
      this.handleMotionPreference
    );
    this.compactViewport.removeEventListener(
      "change",
      this.handleMotionPreference
    );
    this.removeActiveListener();
    this.removeTransitionListener();
    this.gridGeometry.dispose();
    this.wireGeometry.dispose();
    this.nodeGeometry.dispose();
    this.gridMaterial.dispose();
    this.wireMaterial.dispose();
    this.nodeMaterial.dispose();
    this.signal.geometry.dispose();
    this.signalMaterial.dispose();
    this.pulse.geometry.dispose();
    this.pulseMaterial.dispose();
    this.renderer.dispose();
  }

  private setMode(id: string, immediate = false): void {
    const next = MODES[id] ?? MODES.hero;
    if (next === this.transitionTo && !immediate) return;

    this.transitionFrom = this.activeMode;
    this.transitionTo = next;
    this.cameraFrom.copy(this.camera.position);
    this.cameraTo.copy(v3(next.camera));
    this.targetFrom.copy(v3(this.transitionFrom.target));
    this.targetTo.copy(v3(next.target));
    this.gridFrom.set(
      (this.gridGeometry.getAttribute("position") as THREE.BufferAttribute)
        .array
    );
    this.gridTo.set(buildGrid(next));
    this.wireFrom.set(
      (this.wireGeometry.getAttribute("position") as THREE.BufferAttribute)
        .array
    );
    this.wireTo.set(buildWireframeLines(next.wireframe.nodes));
    this.nodesFrom.set(
      (this.nodeGeometry.getAttribute("position") as THREE.BufferAttribute)
        .array
    );
    this.nodesTo.set(buildNodePositions(next.wireframe.nodes));
    this.transitionAge =
      immediate || this.reduceMotion.matches ? TRANSITION_DURATION : 0;
    this.transitionSignalBoost =
      immediate || this.reduceMotion.matches
        ? 1
        : next.transitionSignalBoost ?? 1;
    this.transitionPulseBoost =
      immediate || this.reduceMotion.matches
        ? 1
        : next.transitionPulseBoost ?? 1;
    this.signalProgress = 0;
    this.pulseAge = 0;
    this.moveSignalToRouteStart(next);

    if (immediate || this.reduceMotion.matches) {
      this.applyMode(next);
      this.renderOnce();
    }
  }

  private applyMode(mode: SectionMode): void {
    (
      this.gridGeometry.getAttribute("position") as THREE.BufferAttribute
    ).array.set(buildGrid(mode));
    (
      this.wireGeometry.getAttribute("position") as THREE.BufferAttribute
    ).array.set(buildWireframeLines(mode.wireframe.nodes));
    (
      this.nodeGeometry.getAttribute("position") as THREE.BufferAttribute
    ).array.set(buildNodePositions(mode.wireframe.nodes));
    this.gridGeometry.attributes.position.needsUpdate = true;
    this.wireGeometry.attributes.position.needsUpdate = true;
    this.nodeGeometry.attributes.position.needsUpdate = true;
    this.grid.rotation.y = mode.grid.rotation;
    this.gridMaterial.opacity = mode.grid.opacity;
    this.wireMaterial.opacity = mode.wireframe.lineOpacity;
    this.nodeMaterial.opacity = mode.wireframe.nodeOpacity;
    this.signalMaterial.opacity = mode.signalOpacity;
    this.applyWireframeTransform(mode.wireframe);
    this.camera.position.copy(v3(mode.camera));
    this.camera.lookAt(v3(mode.target));
    this.activeMode = mode;
  }

  private applyWireframeTransform(state: WireframeState): void {
    this.wireframeRoot.rotation.set(...state.rotation);
    this.wireframeRoot.scale.setScalar(state.scale);
  }

  private updateTransition(delta: number): void {
    if (this.transitionAge >= TRANSITION_DURATION) return;
    this.transitionAge = Math.min(
      TRANSITION_DURATION,
      this.transitionAge + delta
    );
    const progress = this.transitionAge / TRANSITION_DURATION;
    const eased = easeInOut(progress);

    this.camera.position.lerpVectors(this.cameraFrom, this.cameraTo, eased);
    const target = this.targetFrom.clone().lerp(this.targetTo, eased);
    this.camera.lookAt(target);
    this.grid.rotation.y = THREE.MathUtils.lerp(
      this.transitionFrom.grid.rotation,
      this.transitionTo.grid.rotation,
      eased
    );
    this.gridMaterial.opacity = THREE.MathUtils.lerp(
      this.transitionFrom.grid.opacity,
      this.transitionTo.grid.opacity,
      eased
    );
    this.wireMaterial.opacity = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.lineOpacity,
      this.transitionTo.wireframe.lineOpacity,
      eased
    );
    this.nodeMaterial.opacity = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.nodeOpacity,
      this.transitionTo.wireframe.nodeOpacity,
      eased
    );
    this.signalMaterial.opacity =
      THREE.MathUtils.lerp(
        this.transitionFrom.signalOpacity,
        this.transitionTo.signalOpacity,
        eased
      ) * THREE.MathUtils.lerp(this.transitionSignalBoost, 1, eased);

    this.wireframeRoot.rotation.x = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.rotation[0],
      this.transitionTo.wireframe.rotation[0],
      eased
    );
    this.wireframeRoot.rotation.y = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.rotation[1],
      this.transitionTo.wireframe.rotation[1],
      eased
    );
    this.wireframeRoot.rotation.z = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.rotation[2],
      this.transitionTo.wireframe.rotation[2],
      eased
    );
    this.wireframeRoot.scale.setScalar(
      THREE.MathUtils.lerp(
        this.transitionFrom.wireframe.scale,
        this.transitionTo.wireframe.scale,
        eased
      )
    );

    interpolateArray(
      (this.gridGeometry.getAttribute("position") as THREE.BufferAttribute)
        .array,
      this.gridFrom,
      this.gridTo,
      eased
    );
    interpolateArray(
      (this.wireGeometry.getAttribute("position") as THREE.BufferAttribute)
        .array,
      this.wireFrom,
      this.wireTo,
      eased
    );
    interpolateArray(
      (this.nodeGeometry.getAttribute("position") as THREE.BufferAttribute)
        .array,
      this.nodesFrom,
      this.nodesTo,
      eased
    );
    this.gridGeometry.attributes.position.needsUpdate = true;
    this.wireGeometry.attributes.position.needsUpdate = true;
    this.nodeGeometry.attributes.position.needsUpdate = true;

    if (progress === 1) this.activeMode = this.transitionTo;
  }

  private updateSignal(delta: number): void {
    const route = this.transitionTo.wireframe.signalRoute;
    if (route.length < 2) return;

    const previousProgress = this.signalProgress;
    this.signalProgress =
      (this.signalProgress + delta / this.transitionTo.signalDuration) % 1;
    if (this.signalProgress < previousProgress) this.pulseAge = 0;

    const scaled = this.signalProgress * (route.length - 1);
    const routeIndex = Math.min(Math.floor(scaled), route.length - 2);
    const localProgress = scaled - routeIndex;
    const from =
      this.transitionTo.wireframe.nodes[route[routeIndex]] ??
      this.transitionTo.wireframe.nodes[0];
    const to =
      this.transitionTo.wireframe.nodes[route[routeIndex + 1]] ??
      this.transitionTo.wireframe.nodes[0];

    this.signal.position.lerpVectors(v3(from), v3(to), localProgress);
    this.pulse.position.copy(this.signal.position);
    this.pulse.lookAt(this.camera.position);

    if (this.pulseAge < 1) {
      this.pulseAge += delta / 0.85;
      const progress = Math.min(this.pulseAge, 1);
      this.pulse.scale.setScalar(0.85 + progress * 1.45);
      this.pulseMaterial.opacity = Math.min(
        0.34,
        (1 - progress) *
          this.transitionTo.pulseOpacity *
          this.transitionPulseBoost
      );
    } else {
      this.pulseMaterial.opacity = 0;
    }
  }

  private getTransitionProgress(): number {
    if (this.transitionAge >= TRANSITION_DURATION) return 1;
    return easeInOut(this.transitionAge / TRANSITION_DURATION);
  }

  private updateActiveMotion(elapsed: number): void {
    const progress = this.getTransitionProgress();
    const mode = this.transitionTo;
    const motion = mode.activeMotion;
    const phase = elapsed * motion.speed;
    const slowPulse = (Math.sin(phase * Math.PI * 2) + 1) / 2;
    const offsetPulse = Math.sin(phase * Math.PI * 2 + Math.PI * 0.35);
    const baseLineOpacity = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.lineOpacity,
      this.transitionTo.wireframe.lineOpacity,
      progress
    );
    const baseNodeOpacity = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.nodeOpacity,
      this.transitionTo.wireframe.nodeOpacity,
      progress
    );
    const baseRotation = lerpPoint3(
      this.transitionFrom.wireframe.rotation,
      this.transitionTo.wireframe.rotation,
      progress
    );
    const baseScale = THREE.MathUtils.lerp(
      this.transitionFrom.wireframe.scale,
      this.transitionTo.wireframe.scale,
      progress
    );

    this.wireMaterial.opacity = Math.min(
      baseLineOpacity * (1 + slowPulse * motion.linePulse),
      0.42
    );
    this.nodeMaterial.opacity = Math.min(
      baseNodeOpacity * (1 + slowPulse * motion.nodePulse),
      0.5
    );
    this.nodeMaterial.size = 0.035 * (1 + slowPulse * motion.nodePulse * 0.5);
    this.signal.scale.setScalar(motion.signalScale);

    this.wireframeRoot.rotation.set(
      baseRotation[0] + offsetPulse * motion.sway[0],
      baseRotation[1] + Math.sin(phase * Math.PI * 1.6) * motion.sway[1],
      baseRotation[2] + offsetPulse * motion.sway[2]
    );
    this.wireframeRoot.scale.setScalar(
      baseScale * (1 + Math.sin(phase * Math.PI * 1.2) * 0.006)
    );
  }

  private moveSignalToRouteStart(mode: SectionMode): void {
    const firstNode =
      mode.wireframe.nodes[mode.wireframe.signalRoute[0] ?? 0] ??
      mode.wireframe.nodes[0];
    this.signal.position.copy(v3(firstNode));
    this.pulse.position.copy(v3(firstNode));
  }

  private syncAnimationState(): void {
    window.cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    if (
      this.disposed ||
      this.reduceMotion.matches ||
      this.compactViewport.matches
    ) {
      this.applyMode(this.transitionTo);
      this.signalMaterial.opacity = Math.min(
        this.transitionTo.signalOpacity,
        0.12
      );
      this.pulseMaterial.opacity = 0;
      this.renderOnce();
      return;
    }
    this.signalMaterial.opacity = this.transitionTo.signalOpacity;
    this.clock.start();
    this.animate();
  }

  private animate = (): void => {
    if (
      this.disposed ||
      this.reduceMotion.matches ||
      this.compactViewport.matches
    )
      return;
    this.animationFrame = window.requestAnimationFrame(this.animate);
    if (document.hidden) return;

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.elapsedTime;
    this.updateTransition(delta);
    this.updateSignal(delta);
    this.updateActiveMotion(elapsed);
    this.root.position.x =
      Math.sin(elapsed * 0.07) * this.transitionTo.drift[0];
    this.root.position.z =
      Math.cos(elapsed * 0.06) * this.transitionTo.drift[1];
    this.renderer.render(this.scene, this.camera);
  };

  private renderOnce(): void {
    if (!this.disposed) this.renderer.render(this.scene, this.camera);
  }

  private resize(): void {
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderOnce();
  }
}
