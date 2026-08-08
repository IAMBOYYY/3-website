import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  Lightformer,
  ContactShadows,
  Html,
  PerformanceMonitor,
} from '@react-three/drei';
import * as THREE from 'three';
import { brainSections } from '../data/brainData';
import { scrollState } from '../scrollState';

const MODEL_URL = `${import.meta.env.BASE_URL}models/brain.glb`;
const WIRE_URL = `${import.meta.env.BASE_URL}models/brain-wire.glb`;
const DRACO_PATH = `${import.meta.env.BASE_URL}draco/`;

// Fully offline Draco decoding — no CDN.
useGLTF.setDecoderPath(DRACO_PATH);
// Warm the cache as early as possible (parallel with React mount).
useGLTF.preload(MODEL_URL);
useGLTF.preload(WIRE_URL);

const TARGET_SIZE = 2.6;
const ACCENT_DAMP = 3.4;
const POSE_DAMP = 4.2;
const SPIN_PER_SECTION = Math.PI * 0.62;
const XRAY_OPACITY = 0.34;
const XRAY_EMISSIVE = 0.62;
const WIRE_BASE_OPACITY = 0.07;
const WIRE_DEEP_OPACITY = 0.12;

const BASE_COLOR = new THREE.Color('#c2b8d6');
const SECTION_COLORS = brainSections.map((s) => new THREE.Color(s.accent));
const markerPositions = brainSections.map((s) => new THREE.Vector3(...s.marker));

// Where the camera starts (hero, before scrolling). The intro choreography
// pulls it forward to brainSections[0].camera (the frontal pose) as the user
// scrolls the hero — so the hero→frontal handoff is seamless, no fly-through.
const HERO_CAM_START: [number, number, number] = [0, 1.3, -6.8];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Shared scratch vector (no per-frame allocations).
const TMP_VEC = new THREE.Vector3();

/* --------------------------- model error boundary ------------------------- */

class ModelBoundary extends Component<
  { onError?: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ---------------------------------- model --------------------------------- */

interface BrainModelProps {
  activeSection: number;
  retryKey: number;
  onLoad?: () => void;
  onNavigate?: (index: number) => void;
}

function BrainModel({ activeSection, retryKey, onLoad, onNavigate }: BrainModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const introRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const wireMatsRef = useRef<THREE.MeshBasicMaterial[]>([]);
  const glow = useRef({ color: SECTION_COLORS[0].clone(), strength: 0.12 });
  const reported = useRef(false);
  const lastActive = useRef(-1);

  const url = retryKey > 0 ? `${MODEL_URL}?r=${retryKey}` : MODEL_URL;
  const { scene } = useGLTF(url);
  const { scene: wireScene } = useGLTF(retryKey > 0 ? `${WIRE_URL}?r=${retryKey}` : WIRE_URL);

  // Normalize scale + center once, build premium materials for both meshes.
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z);

    const mats: THREE.MeshPhysicalMaterial[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mat = new THREE.MeshPhysicalMaterial({
          color: BASE_COLOR,
          roughness: 0.42,
          metalness: 0.06,
          clearcoat: 0.32,
          clearcoatRoughness: 0.6,
          envMapIntensity: 0.9,
          emissive: glow.current.color,
          emissiveIntensity: glow.current.strength,
          transparent: true,
          opacity: 1,
        });
        mesh.material = mat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mats.push(mat);
      }
    });
    materialsRef.current = mats;

    // Wireframe hologram shell (decimated model, ~10k tris).
    const wMats: THREE.MeshBasicMaterial[] = [];
    wireScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const mat = new THREE.MeshBasicMaterial({
          color: '#8fd0ff',
          wireframe: true,
          transparent: true,
          opacity: WIRE_BASE_OPACITY,
          depthWrite: false,
        });
        mesh.material = mat;
        wMats.push(mat);
      }
    });
    wireMatsRef.current = wMats;

    // Both meshes share one transform (same source bounds).
    const m = modelRef.current;
    if (m) {
      m.scale.setScalar(scale);
      m.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    }
    // Wire shell sits a hair outside so lines never z-fight the solid.
    wireScene.scale.setScalar(1.012);

    if (!reported.current) {
      reported.current = true;
      onLoad?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, wireScene]);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;
    const t = state.clock.elapsedTime;

    // Scroll-driven rotation (target written by CameraRig), idle spin in hero.
    const targetRot =
      scrollState.active === 0 ? root.rotation.y + delta * 0.14 : scrollState.rotY;
    root.rotation.y = THREE.MathUtils.damp(root.rotation.y, targetRot, POSE_DAMP, delta);

    // Gentle float.
    root.position.y = -0.05 + Math.sin(t * 0.7) * 0.04;

    // Hero entrance: brain flies in from far + small → full size as you scroll
    // through the first viewport.
    const intro =
      scrollState.active === 0 ? THREE.MathUtils.clamp(scrollState.local, 0, 1) : 1;
    const introRefCurrent = introRef.current;
    if (introRefCurrent) {
      const target = 0.82 + 0.18 * intro;
      introRefCurrent.scale.setScalar(
        THREE.MathUtils.damp(introRefCurrent.scale.x, target, 2.6, delta),
      );
    }

    // scrollState.active is the DOM section index (0 hero, 1..12 regions, 13 finale);
    // map to a brainSections index for glow + x-ray.
    const domActive = Math.min(Math.max(scrollState.active, 0), brainSections.length);
    const active = domActive === 0 ? 0 : domActive - 1;
    const section = brainSections[active];
    const deep = domActive > 0 && !!section?.deep;
    const targetColor = SECTION_COLORS[active];
    const targetStrength = deep ? XRAY_EMISSIVE : active === 0 ? 0.12 : 0.4;
    const col = glow.current.color;
    col.r = THREE.MathUtils.damp(col.r, targetColor.r, ACCENT_DAMP, delta);
    col.g = THREE.MathUtils.damp(col.g, targetColor.g, ACCENT_DAMP, delta);
    col.b = THREE.MathUtils.damp(col.b, targetColor.b, ACCENT_DAMP, delta);
    glow.current.strength = THREE.MathUtils.damp(glow.current.strength, targetStrength, ACCENT_DAMP, delta);

    const targetOpacity = deep ? XRAY_OPACITY : 1;
    for (const m of materialsRef.current) {
      m.emissive.copy(col);
      m.emissiveIntensity = glow.current.strength;
      m.opacity = THREE.MathUtils.damp(m.opacity, targetOpacity, 3.2, delta);
    }
    const wireOpacity = deep ? WIRE_DEEP_OPACITY : WIRE_BASE_OPACITY + Math.sin(t * 0.8) * 0.015;
    for (const w of wireMatsRef.current) {
      w.opacity = THREE.MathUtils.damp(w.opacity, wireOpacity, 2.5, delta);
    }

    // Cheap debug hook used by smoke tests (only written when it changes).
    if (lastActive.current !== scrollState.active) {
      lastActive.current = scrollState.active;
      (window as unknown as { __scrollActive?: number }).__scrollActive = scrollState.active;
    }
  });

  return (
    <group ref={rootRef}>
      <group ref={introRef}>
        <group ref={modelRef}>
          <primitive object={scene} />
          <primitive object={wireScene} />
        </group>
        <RegionMarkers activeSection={activeSection} onNavigate={onNavigate} />
      </group>
      <Connectome activeSection={activeSection} />
      <SignalTrail activeSection={activeSection} />
      <ScanPulse activeSection={activeSection} />
    </group>
  );
}

/* -------------------------------- connectome ------------------------------ */

/** Faint neural web between region markers; edges of the active region light up. */
function Connectome({ activeSection }: { activeSection: number }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const colorAttr = useRef<THREE.BufferAttribute | null>(null);

  const { edges, baseColor, tmpColor } = useMemo(() => {
    // Nearest-2 neighbours per marker, deduped.
    const pairs = new Set<string>();
    for (let i = 0; i < markerPositions.length; i++) {
      const dists = markerPositions
        .map((p, j) => ({ j, d: markerPositions[i].distanceTo(p) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d);
      for (const o of dists.slice(0, 2)) {
        const key = i < o.j ? `${i}-${o.j}` : `${o.j}-${i}`;
        pairs.add(key);
      }
    }
    const edges = Array.from(pairs).map((k) => k.split('-').map(Number));
    return {
      edges,
      baseColor: new THREE.Color('#55628f'),
      tmpColor: new THREE.Color(),
    };
  }, []);

  const geometry = useMemo(() => {
    const pos = new Float32Array(edges.length * 2 * 3);
    edges.forEach(([a, b], i) => {
      pos.set(markerPositions[a].toArray(), i * 6);
      pos.set(markerPositions[b].toArray(), i * 6 + 3);
    });
    const col = new Float32Array(edges.length * 2 * 3).fill(0.25, 0);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [edges]);

  useEffect(() => {
    colorAttr.current = geometry.attributes.color as THREE.BufferAttribute;
  }, [geometry]);

  useFrame((state) => {
    const line = lineRef.current;
    const attr = colorAttr.current;
    if (!line || !attr) return;
    const t = state.clock.elapsedTime;
    const activeIdx = activeSection >= 1 && activeSection <= brainSections.length ? activeSection - 1 : -1;
    const accent = activeIdx >= 0 ? SECTION_COLORS[activeIdx] : null;
    const pulse = 0.7 + 0.3 * Math.sin(t * 3);

    edges.forEach(([a, b], i) => {
      const on = a === activeIdx || b === activeIdx;
      if (on && accent) {
        tmpColor.copy(accent).multiplyScalar(0.85 + 0.3 * pulse);
      } else {
        tmpColor.copy(baseColor).multiplyScalar(0.72 + 0.28 * pulse);
      }
      attr.setXYZ(i * 2, tmpColor.r, tmpColor.g, tmpColor.b);
      attr.setXYZ(i * 2 + 1, tmpColor.r, tmpColor.g, tmpColor.b);
    });
    attr.needsUpdate = true;
    (line.material as THREE.LineBasicMaterial).opacity = 0.5 + (accent ? 0.25 : 0);
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ------------------------------- signal trail ----------------------------- */

/** A neural pulse that travels from the previous marker to the current one. */
function SignalTrail({ activeSection }: { activeSection: number }) {
  const headRef = useRef<THREE.Points>(null);
  const bodyRef = useRef<THREE.Points>(null);
  const stateRef = useRef({
    curve: null as THREE.QuadraticBezierCurve3 | null,
    progress: 0,
    fade: 1,
    animating: false,
    color: new THREE.Color('#7be8ff'),
  });
  const prev = useRef<number | null>(null);

  const COUNT = 18;
  const bodyGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    return g;
  }, []);
  const headGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    return g;
  }, []);

  useEffect(() => {
    if (prev.current === null) {
      prev.current = activeSection;
      return;
    }
    const fromDom = prev.current;
    const toDom = activeSection;
    prev.current = activeSection;

    const inRange = (d: number) => d >= 1 && d <= brainSections.length;
    if (!inRange(toDom)) return;

    const from =
      inRange(fromDom) && fromDom !== toDom ? markerPositions[fromDom - 1] : new THREE.Vector3(0, 0, 0);
    const to = markerPositions[toDom - 1];
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y += 0.55;

    const s = stateRef.current;
    s.curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    s.color.copy(SECTION_COLORS[toDom - 1]);
    s.progress = 0;
    s.fade = 1;
    s.animating = true;
  }, [activeSection]);

  useFrame((_, delta) => {
    const s = stateRef.current;
    const head = headRef.current;
    const body = bodyRef.current;
    if (!head || !body || !s.curve) return;
    if (!s.animating) return;

    s.progress += delta / 1.6;
    if (s.progress >= 1.15) {
      s.fade -= delta * 2.2;
      if (s.fade <= 0) {
        s.animating = false;
        s.curve = null;
        (head.material as THREE.PointsMaterial).opacity = 0;
        (body.material as THREE.PointsMaterial).opacity = 0;
        return;
      }
    }

    const t = easeInOut(Math.min(s.progress, 1));
    const posAttr = bodyGeo.attributes.position as THREE.BufferAttribute;
    const headAttr = headGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const tt = t - i * 0.032;
      if (tt <= 0) {
        posAttr.setXYZ(i, 0, -99, 0); // hidden below the scene
      } else {
        s.curve.getPoint(Math.min(tt, 1), TMP_VEC);
        posAttr.setXYZ(i, TMP_VEC.x, TMP_VEC.y, TMP_VEC.z);
      }
    }
    posAttr.needsUpdate = true;
    s.curve.getPoint(t, TMP_VEC);
    headAttr.setXYZ(0, TMP_VEC.x, TMP_VEC.y, TMP_VEC.z);
    headAttr.needsUpdate = true;

    const headMat = head.material as THREE.PointsMaterial;
    const bodyMat = body.material as THREE.PointsMaterial;
    headMat.color.copy(s.color).lerp(new THREE.Color('#ffffff'), 0.35);
    bodyMat.color.copy(s.color);
    headMat.opacity = s.fade * 0.95;
    bodyMat.opacity = s.fade * 0.6;
  });

  return (
    <group>
      <points ref={bodyRef} geometry={bodyGeo}>
        <pointsMaterial
          size={0.045}
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <points ref={headRef} geometry={headGeo}>
        <pointsMaterial
          size={0.14}
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/* -------------------------------- scan pulse ------------------------------- */

/** A diagnostic ring sweeping through the brain while a deep section is active. */
function ScanPulse({ activeSection }: { activeSection: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const sweep = useRef(0);

  useFrame((state, delta) => {
    const ring = ringRef.current;
    if (!ring) return;
    const isDeep =
      activeSection >= 1 &&
      activeSection <= brainSections.length &&
      !!brainSections[activeSection - 1].deep;
    if (!isDeep) {
      ring.visible = false;
      return;
    }
    ring.visible = true;
    sweep.current = (sweep.current + delta / 1.4) % 1;
    const phase = Math.sin(Math.PI * sweep.current);
    ring.position.y = 1.35 - 2.7 * sweep.current;
    const mat = ring.material as THREE.MeshBasicMaterial;
    mat.opacity = phase * 0.5;
    mat.color.copy(SECTION_COLORS[activeSection - 1]);
    ring.rotation.z = state.clock.elapsedTime * 0.6;
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} visible={false}>
      <torusGeometry args={[0.95, 0.007, 8, 72]} />
      <meshBasicMaterial
        color="#7be8ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------- region markers ---------------------------- */

interface RegionMarkersProps {
  activeSection: number;
  onNavigate?: (index: number) => void;
}

/** Small clickable dots on every region — click to jump straight to that section. */
function ExplorationDots({ activeSection, onNavigate }: RegionMarkersProps) {
  return (
    <group>
      {brainSections.map((s, i) => {
        const isActive = activeSection === i + 1;
        return (
          <group key={s.id} position={markerPositions[i]}>
            {/* larger invisible hit target so dots are easy to click */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(i + 1);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[isActive ? 0.032 : 0.024, 16, 16]} />
              <meshBasicMaterial
                color={isActive ? s.accent : '#59617f'}
                transparent
                opacity={isActive ? 1 : 0.45}
                depthTest={false}
                depthWrite={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Pulsing marker + 3D label for the section currently being viewed. */
function ActiveMarker({ activeSection }: { activeSection: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.75 + 0.25 * Math.sin(t * 4.2);
    if (ringRef.current) {
      ringRef.current.scale.setScalar(pulse);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.35 + 0.35 * (1 - pulse);
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + (pulse - 0.75) * 0.6);
    }
    if (innerRef.current) {
      innerRef.current.rotation.z += 0.02;
      innerRef.current.scale.setScalar(0.8 + 0.2 * Math.sin(t * 2.4));
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.6) * 0.045;
    }
  });

  if (activeSection < 1 || activeSection > brainSections.length) return null;

  const section = brainSections[activeSection - 1];
  const pos = markerPositions[activeSection - 1];
  const accent = section.accent;
  const deep = !!section.deep;

  return (
    <group position={pos} ref={groupRef}>
      {/* invisible hit target for easy clicking */}
      <mesh visible={false}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial />
      </mesh>
      {/* x-ray halo visible through the brain */}
      <mesh>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.26}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.13, 48]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          depthTest={!deep}
        />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshBasicMaterial color={accent} depthTest={!deep} depthWrite={false} />
      </mesh>
      <mesh ref={innerRef} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.12, 0.006, 12, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} depthTest={!deep} />
      </mesh>
      <pointLight color={accent} intensity={deep ? 10 : 6} distance={2.2} decay={2} />

      {/* 3D label */}
      <Html
        position={[0, deep ? 0.42 : 0.5, 0]}
        center
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        zIndexRange={[40, 0]}
      >
        <div
          className="flex flex-col items-center gap-1"
          style={{
            transform: 'translateY(-4px)',
            filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
          }}
        >
          <span
            className="mono rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] whitespace-nowrap"
            style={{
              color: accent,
              borderColor: accent,
              background: 'rgba(5,6,11,0.72)',
            }}
          >
            {section.eyebrow}
          </span>
          <span
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold tracking-wide text-white"
            style={{ background: 'rgba(8,10,18,0.88)' }}
          >
            {section.title}
          </span>
          {deep && (
            <span
              className="mono whitespace-nowrap text-[9px] uppercase tracking-[0.24em]"
              style={{ color: accent, opacity: 0.85 }}
            >
              ◇ deep structure
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

function RegionMarkers({ activeSection, onNavigate }: RegionMarkersProps) {
  return (
    <>
      <ExplorationDots activeSection={activeSection} onNavigate={onNavigate} />
      <ActiveMarker activeSection={activeSection} />
    </>
  );
}

/* --------------------------------- camera rig ------------------------------ */

function CameraRig() {
  const current = useRef({ pos: new THREE.Vector3(...HERO_CAM_START), rotY: 0 });
  const target = useRef({ pos: new THREE.Vector3(...HERO_CAM_START), rotY: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const s = scrollState;
    const domIdx = Math.min(Math.max(s.active, 0), brainSections.length);
    const idx = domIdx === 0 ? 0 : domIdx - 1;
    const section = brainSections[idx];

    if (domIdx === 0) {
      // Hero entrance: camera approaches the brain from afar as you scroll,
      // ending exactly on the frontal pose for a seamless handoff.
      const intro = THREE.MathUtils.clamp(s.local, 0, 1);
      target.current.pos.set(0, 1.3 - 0.1 * intro, -6.8 + 1.4 * intro);
    } else {
      target.current.pos.fromArray(section.camera);
    }
    target.current.rotY = section.rotY + s.local * SPIN_PER_SECTION;

    const c = current.current;
    c.pos.x = THREE.MathUtils.damp(c.pos.x, target.current.pos.x, POSE_DAMP, delta);
    c.pos.y = THREE.MathUtils.damp(c.pos.y, target.current.pos.y, POSE_DAMP, delta);
    c.pos.z = THREE.MathUtils.damp(c.pos.z, target.current.pos.z, POSE_DAMP, delta);
    c.rotY = THREE.MathUtils.damp(c.rotY, target.current.rotY, POSE_DAMP, delta);

    s.rotY = c.rotY;
    camera.position.copy(c.pos);
    camera.lookAt(tmp.set(0, -0.05, 0));
  });

  return null;
}

/* --------------------------------- particles ------------------------------- */

function StarField() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 520;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const palette = [
      new THREE.Color('#6f7fae'),
      new THREE.Color('#9fb0d8'),
      new THREE.Color('#4c5a85'),
      new THREE.Color('#7be8ff'),
    ];
    for (let i = 0; i < count; i++) {
      const r = 3.4 + rand() * 2.6;
      const theta = Math.acos(2 * rand() - 1);
      const phi = rand() * Math.PI * 2;
      pos[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.cos(theta) * 0.75;
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
      const c = palette[Math.floor(rand() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.026}
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ---------------------------- adaptive quality ----------------------------- */

/** Degrades render resolution automatically when the GPU struggles. */
function AdaptiveQuality() {
  const setDpr = useThree((s) => s.setDpr);
  return (
    <PerformanceMonitor
      onIncline={() => setDpr(1.75)}
      onDecline={() => setDpr(1.25)}
      onFallback={() => setDpr(1)}
    />
  );
}

/* ----------------------------------- scene --------------------------------- */

interface BrainSceneProps {
  activeSection: number;
  retryKey: number;
  onModelLoad?: () => void;
  onModelError?: () => void;
  onNavigate?: (index: number) => void;
}

export function BrainScene({
  activeSection,
  retryKey,
  onModelLoad,
  onModelError,
  onNavigate,
}: BrainSceneProps) {
  useEffect(() => {
    scrollState.active = activeSection;
  }, [activeSection]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: HERO_CAM_START, fov: 42, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#05060b', 10, 24]} />

        <AdaptiveQuality />

        <CameraRig />

        <ambientLight intensity={0.32} />
        <directionalLight position={[4, 6, -5]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-5, -2, 5]} intensity={0.7} color="#8fa8ff" />
        <pointLight position={[0, 3.4, 0]} intensity={1.8} color="#ffe9f0" />

        <ModelBoundary key={retryKey} onError={onModelError}>
          <Suspense fallback={null}>
            <BrainModel
              activeSection={activeSection}
              retryKey={retryKey}
              onLoad={onModelLoad}
              onNavigate={onNavigate}
            />
          </Suspense>
        </ModelBoundary>

        <StarField />
        <ContactShadows
          position={[0, -1.38, 0]}
          opacity={0.35}
          scale={7}
          blur={2.4}
          far={2.2}
          color="#0b0c1a"
          frames={1}
        />

        <Environment resolution={128}>
          <Lightformer intensity={2} position={[0, 5, -6]} scale={[12, 4, 1]} color="#e8e6ff" />
          <Lightformer
            intensity={1.3}
            position={[-6, 1, 3]}
            rotation-y={Math.PI / 2}
            scale={[8, 3, 1]}
            color="#cfe4ff"
          />
          <Lightformer
            intensity={1}
            position={[6, -1, 2]}
            rotation-y={-Math.PI / 2}
            scale={[8, 3, 1]}
            color="#d9e6ff"
          />
          <Lightformer intensity={0.6} position={[0, -4, 4]} scale={[10, 3, 1]} color="#aebcff" />
        </Environment>
      </Canvas>
    </div>
  );
}
