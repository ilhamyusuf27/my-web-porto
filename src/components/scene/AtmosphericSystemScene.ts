import * as THREE from "three";
import { getActiveSection, onActiveSection, onSectionTransition } from "../../scripts/sectionStore";

type SceneOptions = { canvas: HTMLCanvasElement };
type Atmosphere = {
  focus: [number, number];
  energy: number;
  hue: number;
  view: [number, number, number, number];
  shape: [number, number, number];
  mode: number;
};

const STATES: Record<string, Atmosphere> = {
  hero: { focus: [0.66, 0.44], energy: .9, hue: .02, view: [1, 0, 0, 0], shape: [1, .82, 1], mode: 0 },
  about: { focus: [0.66, 0.44], energy: .78, hue: -.02, view: [1.1, -.045, -.08, .035], shape: [.72, 1.22, .78], mode: 1 },
  skills: { focus: [0.66, 0.44], energy: .86, hue: .04, view: [.88, .065, .07, -.04], shape: [1.38, .7, 1.32], mode: 2 },
  experience: { focus: [0.66, 0.44], energy: .82, hue: .005, view: [1.16, .025, -.11, -.02], shape: [.92, 1.42, .9], mode: 3 },
  projects: { focus: [0.66, 0.44], energy: .9, hue: -.03, view: [.84, -.06, .12, .045], shape: [1.52, .62, 1.18], mode: 4 },
  experimental: { focus: [0.66, 0.44], energy: .95, hue: .055, view: [1.2, .08, .04, -.07], shape: [1.16, 1.58, 1.42], mode: 5 },
  education: { focus: [0.66, 0.44], energy: .76, hue: -.02, view: [.96, -.075, -.08, .06], shape: [.66, .86, .72], mode: 6 },
  contact: { focus: [0.66, 0.44], energy: 1, hue: .035, view: [1.08, .015, .09, 0], shape: [1.28, 1.08, 1.08], mode: 0 },
};

const vertexShader = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uEnergy;
  uniform float uHue;
  uniform vec2 uFocus;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform vec4 uView;
  uniform vec3 uShape;
  uniform float uMode;
  uniform vec2 uResolution;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.; float a = .5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 2.4); a *= .5; }
    return v;
  }
  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.);
    vec2 p = vec2((uv.x - .5) * aspect, uv.y - .5);
    float viewCos = cos(uView.y);
    float viewSin = sin(uView.y);
    mat2 viewRotation = mat2(viewCos, -viewSin, viewSin, viewCos);
    p = viewRotation * (p + uView.zw) * uView.x;
    vec2 pointer = vec2((uPointer.x - .5) * aspect, uPointer.y - .5);
    pointer = viewRotation * (pointer + uView.zw) * uView.x;
    vec2 pointerDelta = p - pointer;
    float pointerBloom = exp(-length(pointerDelta) * 3.4) * uPointerStrength;
    p += normalize(pointerDelta + .0001) * pointerBloom * .018;
    vec2 focus = vec2((uFocus.x - .5) * aspect, uFocus.y - .5);
    float t = uTime * .035;
    float a = fbm(p * 2.05 + vec2(t, -t * .7));
    float b = fbm(p * 3.1 + vec2(-t * .55, t) + a * .7);
    float veil = smoothstep(.25, .92, a * .62 + b * .54);
    float bloom = exp(-length(p - focus) * 1.72);
    float distantMist = fbm(p * 1.15 + vec2(-t * .34, t * .22));
    float metalWarp = fbm(vec2(p.x * 1.35, p.y * .62) + vec2(t * .22, -t * .08));
    float metalPhase = p.x * 7.2 + sin(p.y * 2.8 - t * 1.25) * 1.15 + metalWarp * 2.6;
    float metalFold = .5 + .5 * sin(metalPhase);
    float metalRidge = pow(abs(sin(metalPhase)), 18.);
    float metalBody = smoothstep(.18, .92, metalFold) * (.45 + .55 * metalWarp);
    float cyanEdge = pow(abs(sin(metalPhase + .12)), 24.);
    float warmEdge = pow(abs(sin(metalPhase - .1)), 25.);
    float w0 = exp(-pow((uMode - 0.) * 1.8, 2.));
    float w1 = exp(-pow((uMode - 1.) * 1.8, 2.));
    float w2 = exp(-pow((uMode - 2.) * 1.8, 2.));
    float w3 = exp(-pow((uMode - 3.) * 1.8, 2.));
    float w4 = exp(-pow((uMode - 4.) * 1.8, 2.));
    float w5 = exp(-pow((uMode - 5.) * 1.8, 2.));
    float w6 = exp(-pow((uMode - 6.) * 1.8, 2.));
    float weightSum = max(.001, w0 + w1 + w2 + w3 + w4 + w5 + w6);
    w0 /= weightSum; w1 /= weightSum; w2 /= weightSum; w3 /= weightSum;
    w4 /= weightSum; w5 /= weightSum; w6 /= weightSum;

    // A suspended chrome-fabric bloom with an asymmetric silhouette, internal
    // folds, and a dark cut-through. It reads as one sculptural moving object.
    vec2 formCenter = vec2(.39 + sin(t * .82) * .07, .055 + cos(t * 1.04) * .052);
    formCenter += (pointer - formCenter) * uPointerStrength * .065;
    vec2 formUv = p - formCenter;
    float formAngle = -.32 + sin(t * .68) * .09;
    mat2 formRotation = mat2(cos(formAngle), -sin(formAngle), sin(formAngle), cos(formAngle));
    formUv = formRotation * formUv;
    vec2 formShape = vec2(formUv.x * 1.04, formUv.y * .76);
    float formRadius = length(formShape);
    float formTheta = atan(formShape.y, formShape.x);
    float formBoundary = .315;
    formBoundary += sin(formTheta * 3. + t * 1.25) * .065;
    formBoundary += sin(formTheta * 5. - t * .82 + 1.4) * .038;
    formBoundary += sin(formTheta * 2. + formRadius * 8. - t) * .025;
    float formBody = smoothstep(formBoundary + .018, formBoundary - .035, formRadius);
    float formEdge = exp(-abs(formRadius - formBoundary) * 58.);
    float formCutPath = formShape.y - sin(formShape.x * 7. - t * 1.8) * .075 + .018;
    float formCutLength = smoothstep(.34, .13, abs(formShape.x));
    float formCut = exp(-abs(formCutPath) * 24.) * formCutLength * formBody;
    formBody *= 1. - formCut * .82;
    float formFoldA = pow(.5 + .5 * sin(formTheta * 4. + formRadius * 24. - t * 2.2), 8.) * formBody;
    float formFoldB = pow(.5 + .5 * cos(formTheta * 7. - formRadius * 17. + t * 1.45), 12.) * formBody;
    float formSheen = (.5 + .5 * sin(formTheta * 2. - formRadius * 15. + t * 1.4)) * formBody;
    float formInnerShadow = smoothstep(.3, .03, formRadius) * (1. - formSheen) * formBody;
    float formShadow = exp(-formRadius * 3.6) * (1. - formBody * .35);
    float formCyanEdge = exp(-abs(formRadius - formBoundary - .012) * 75.);
    float formWarmEdge = exp(-abs(formRadius - formBoundary + .014) * 82.);
    vec3 base = vec3(.038, .046, .066);
    vec3 violet = vec3(.3 + uHue, .26, .43 + uHue * .25);
    vec3 blue = vec3(.1, .24 - uHue * .2, .42);
    vec3 silver = vec3(.46, .49, .56);
    vec3 color = base;
    color += silver * metalBody * .045;
    color += silver * metalRidge * .055;
    color += vec3(.05, .28, .48) * cyanEdge * .025;
    color += vec3(.42, .2, .07) * warmEdge * .012;
    color += violet * bloom * (.1 + veil * .14) * uEnergy;
    color += silver * pow(veil, 2.5) * .09;
    color += mix(blue, violet, .58) * pointerBloom * (.16 + veil * .22);
    color = mix(color, color * .56, formShadow * .22 * w0);
    color += mix(blue, violet, .46) * formBody * (.095 + formSheen * .13) * w0;
    color = mix(color, color * .42, formInnerShadow * .42 * w0);
    color += silver * formEdge * .19 * w0;
    color += mix(violet, silver, .8) * formFoldA * .145 * w0;
    color += vec3(.18, .34, .52) * formFoldB * .11 * w0;
    color += vec3(.08, .4, .62) * formCyanEdge * .055 * w0;
    color += vec3(.46, .18, .08) * formWarmEdge * .025 * w0;
    color = mix(color, color * .22, formCut * .78 * w0);

    // Profile: a quiet portrait-like vertical pool of light.
    float profileLight = exp(-length(vec2((p.x + .28) * .68, p.y - .03)) * 1.9);
    color += mix(silver, violet, .38) * profileLight * (.15 + veil * .13) * w1;

    // Capabilities: soft vertical spectral columns, more ordered than organic.
    float columns = pow(.5 + .5 * cos((p.x + t * .18) * 9.5), 10.);
    columns *= smoothstep(.62, -.42, abs(p.y));
    color += mix(blue, silver, .42) * columns * (.13 + veil * .08) * w2;

    // Experience: a broad diagonal delivery sweep.
    float delivery = exp(-abs(p.y + p.x * .32 - .08) * 3.7);
    float deliveryEcho = exp(-abs(p.y + p.x * .32 + .28) * 6.2);
    color += mix(violet, silver, .35) * (delivery * .17 + deliveryEcho * .08) * w3;

    // Work: two cinematic pools that frame image-led case studies.
    float workA = exp(-length(p - vec2(-.46, .19)) * 2.25);
    float workB = exp(-length(p - vec2(.48, -.2)) * 2.4);
    color += (blue * workA * .18 + violet * workB * .16) * w4;

    // Experiments: denser turbulent light with no ordered ribbon.
    float researchCloud = pow(smoothstep(.22, .88, a * .45 + b * .7), 1.35);
    color += mix(blue, violet, b) * researchCloud * .24 * w5;

    // Learning: calm horizontal archive glow.
    float archiveBand = exp(-abs(p.y - .18) * 5.2) + exp(-abs(p.y + .25) * 7.) * .45;
    color += mix(silver, blue, .42) * archiveBand * (.07 + distantMist * .055) * w6;
    color *= .9 + uv.y * .12;
    gl_FragColor = vec4(color, 1.);
  }
`;

export class AtmosphericSystemScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private material: THREE.ShaderMaterial;
  private frame = 0;
  private lastFrame = 0;
  private targetFocus = new THREE.Vector2(.66, .44);
  private targetEnergy = .9;
  private targetHue = .02;
  private targetView = new THREE.Vector4(1, 0, 0, 0);
  private targetShape = new THREE.Vector3(1, .82, 1);
  private targetMode = 0;
  private targetPointer = new THREE.Vector2(.5, .5);
  private pointerStrength = 0;
  private targetPointerStrength = 0;
  private reduced = matchMedia("(prefers-reduced-motion: reduce)");
  private finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  private removeActive: () => void;
  private removeTransition: () => void;

  constructor({ canvas }: SceneOptions) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power" });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
    this.material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, depthWrite: false, depthTest: false,
      uniforms: {
        uTime: { value: 0 }, uEnergy: { value: .9 }, uHue: { value: .02 },
        uFocus: { value: new THREE.Vector2(.66, .44) },
        uPointer: { value: new THREE.Vector2(.5, .5) },
        uPointerStrength: { value: 0 },
        uView: { value: new THREE.Vector4(1, 0, 0, 0) },
        uShape: { value: new THREE.Vector3(1, .82, 1) },
        uMode: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
    });
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material));
    this.removeActive = onActiveSection(this.setState);
    this.removeTransition = onSectionTransition(this.setState);
    this.setState(getActiveSection() ?? "hero", true);
    this.resize();
    addEventListener("resize", this.resize, { passive: true });
    addEventListener("pointermove", this.handlePointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", this.handlePointerLeave);
    document.addEventListener("visibilitychange", this.sync);
    this.reduced.addEventListener("change", this.sync);
    this.sync();
  }

  private setState = (id: string, immediate = false) => {
    const state = STATES[id] ?? STATES.hero;
    this.targetFocus.set(...state.focus); this.targetEnergy = state.energy; this.targetHue = state.hue;
    this.targetView.set(...state.view);
    this.targetShape.set(...state.shape);
    this.targetMode = state.mode;
    if (immediate) {
      this.material.uniforms.uFocus.value.copy(this.targetFocus);
      this.material.uniforms.uEnergy.value = this.targetEnergy;
      this.material.uniforms.uHue.value = this.targetHue;
      this.material.uniforms.uView.value.copy(this.targetView);
      this.material.uniforms.uShape.value.copy(this.targetShape);
      this.material.uniforms.uMode.value = this.targetMode;
    }
  };

  private resize = () => {
    const canvas = this.renderer.domElement;
    const width = Math.max(1, canvas.clientWidth), height = Math.max(1, canvas.clientHeight);
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    this.render();
  };

  private handlePointer = (event: PointerEvent) => {
    if (!this.finePointer.matches || this.reduced.matches) return;
    this.targetPointer.set(event.clientX / innerWidth, 1 - event.clientY / innerHeight);
    this.targetPointerStrength = .9;
  };

  private handlePointerLeave = () => {
    this.targetPointerStrength = 0;
  };

  private sync = () => {
    cancelAnimationFrame(this.frame);
    if (document.hidden) return;
    if (this.reduced.matches) return this.render();
    this.lastFrame = 0; this.animate();
  };

  private animate = (time = performance.now()) => {
    if (document.hidden || this.reduced.matches) return;
    this.frame = requestAnimationFrame(this.animate);
    if (this.lastFrame && time - this.lastFrame < 33) return;
    this.lastFrame = time;
    const uniforms = this.material.uniforms;
    uniforms.uTime.value = time / 1000;
    uniforms.uFocus.value.lerp(this.targetFocus, .07);
    uniforms.uView.value.lerp(this.targetView, .055);
    uniforms.uShape.value.lerp(this.targetShape, .05);
    uniforms.uMode.value = THREE.MathUtils.lerp(uniforms.uMode.value, this.targetMode, .055);
    uniforms.uPointer.value.lerp(this.targetPointer, .09);
    this.pointerStrength = THREE.MathUtils.lerp(this.pointerStrength, this.targetPointerStrength, .075);
    uniforms.uPointerStrength.value = this.pointerStrength;
    uniforms.uEnergy.value = THREE.MathUtils.lerp(uniforms.uEnergy.value, this.targetEnergy, .065);
    uniforms.uHue.value = THREE.MathUtils.lerp(uniforms.uHue.value, this.targetHue, .065);
    this.render();
  };

  private render = () => this.renderer.render(this.scene, this.camera);
}
