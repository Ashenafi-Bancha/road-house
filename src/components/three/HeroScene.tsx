"use client";
/**
 * HERO 3D SCENE — "The Jebena at Dusk"
 * A procedurally modelled clay jebena (no model download), resting on a woven ring,
 * with shader steam rising from the spout and ember particles drifting up.
 * Tilts toward the mouse (desktop) or with device orientation (phones).
 *
 * This file is lazy-loaded (next/dynamic, ssr:false) only on capable devices.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Tier = "full" | "lite";

/* ───────────── Shaders ───────────── */
const noiseGLSL = /* glsl */ `
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

const steamVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    vec3 p = position;
    // Curl the plume more as it rises
    float rise = uv.y * uv.y;
    p.x += sin(uv.y * 3.5 - uTime * 0.9 + uSeed) * 0.18 * rise;
    p.x += sin(uTime * 0.45 + uSeed * 2.0) * 0.12 * rise;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const steamFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uOpacity;
  varying vec2 vUv;
  ${noiseGLSL}
  void main(){
    vec2 uv = vUv;
    vec2 q = vec2(uv.x * 1.6 + uSeed, uv.y * 1.2 - uTime * 0.32);
    float n = fbm(q * 2.4 + vec2(fbm(q * 1.3 + uTime * 0.05), 0.0));
    float smoke = smoothstep(0.42, 0.95, n);
    // Soft plume shape: narrow at the spout, wider and fading higher up
    float width = mix(0.12, 0.5, uv.y);
    smoke *= 1.0 - smoothstep(width * 0.4, width, abs(uv.x - 0.5));
    smoke *= smoothstep(0.0, 0.12, uv.y) * (1.0 - smoothstep(0.55, 1.0, uv.y));
    vec3 col = mix(vec3(1.0, 0.82, 0.62), vec3(0.96, 0.92, 0.86), uv.y);
    gl_FragColor = vec4(col, smoke * uOpacity);
  }
`;

const emberVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aPhase;
  attribute float aSpeed;
  varying float vAlpha;
  void main(){
    vec3 p = position;
    float t = fract(uTime * aSpeed + aPhase);
    p.y += t * 3.6;
    p.x += sin(t * 6.2831 + aPhase * 12.0) * 0.25;
    p.z += cos(t * 6.2831 + aPhase * 7.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (26.0 * uPixelRatio / -mv.z) * (1.0 - t * 0.6);
    vAlpha = smoothstep(0.0, 0.12, t) * (1.0 - t);
  }
`;

const emberFragment = /* glsl */ `
  varying float vAlpha;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(1.0, 0.55 + 0.25 * (1.0 - d * 2.0), 0.22, a);
  }
`;

/* ───────────── Steam plume ───────────── */
function Steam({ position, seed, scale = 1, opacity = 0.55 }: { position: [number, number, number]; seed: number; scale?: number; opacity?: number }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSeed: { value: seed }, uOpacity: { value: opacity } }), [seed, opacity]);
  useFrame((_, dt) => { uniforms.uTime.value += dt; });
  return (
    <Billboard position={position} lockX lockZ>
      <mesh position={[0, 1.2 * scale, 0]} scale={scale}>
        <planeGeometry args={[0.9, 2.4, 1, 24]} />
        <shaderMaterial
          vertexShader={steamVertex}
          fragmentShader={steamFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Billboard>
  );
}

/* ───────────── Ember particles ───────────── */
function Embers({ count }: { count: number }) {
  const { gl } = useThree();
  const { geometry, uniforms } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 0.6 + Math.random() * 1.8;
      const a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r, -0.4 + Math.random() * 0.6, Math.sin(a) * r * 0.6], i * 3);
      phase[i] = Math.random();
      speed[i] = 0.06 + Math.random() * 0.1;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    return { geometry: g, uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) } } };
  }, [count, gl]);
  useFrame((_, dt) => { uniforms.uTime.value += dt; });
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points geometry={geometry}>
      <shaderMaterial
        vertexShader={emberVertex}
        fragmentShader={emberFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ───────────── The jebena ───────────── */
function Jebena({ tier }: { tier: Tier }) {
  const segs = tier === "full" ? 72 : 40;

  const body = useMemo(() => {
    // Profile (radius, height) revolved around Y → round gourd belly + long neck + lip
    const pts = [
      [0.0, 0.0], [0.32, 0.02], [0.6, 0.12], [0.8, 0.32], [0.87, 0.55], [0.82, 0.8],
      [0.66, 1.02], [0.44, 1.18], [0.26, 1.32], [0.2, 1.5], [0.185, 1.78], [0.2, 1.98],
      [0.26, 2.14], [0.31, 2.22], [0.29, 2.25], [0.22, 2.2],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, segs);
    g.computeVertexNormals();
    return g;
  }, [segs]);

  const spout = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.6, 0.72, 0), new THREE.Vector3(0.92, 1.0, 0),
      new THREE.Vector3(1.08, 1.4, 0), new THREE.Vector3(1.17, 1.74, 0),
    ]);
    return new THREE.TubeGeometry(c, 32, 0.075, tier === "full" ? 16 : 10, false);
  }, [tier]);

  const handle = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.17, 1.72, 0), new THREE.Vector3(-0.6, 1.66, 0),
      new THREE.Vector3(-0.86, 1.22, 0), new THREE.Vector3(-0.78, 0.82, 0),
    ]);
    return new THREE.TubeGeometry(c, 32, 0.06, tier === "full" ? 14 : 8, false);
  }, [tier]);

  useEffect(() => () => { body.dispose(); spout.dispose(); handle.dispose(); }, [body, spout, handle]);

  const clay = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5a2f1d", roughness: 0.55, metalness: 0.06 }),
    []
  );
  useEffect(() => () => clay.dispose(), [clay]);

  return (
    <group>
      <mesh geometry={body} material={clay} />
      <mesh geometry={spout} material={clay} />
      <mesh geometry={handle} material={clay} />
      {/* Wolaita textile colours as thin bands around the neck */}
      {[
        { y: 1.46, c: "#1f6b3a" },
        { y: 1.54, c: "#e8b530" },
        { y: 1.62, c: "#c8281e" },
      ].map((b) => (
        <mesh key={b.y} position={[0, b.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.198, 0.018, 8, segs]} />
          <meshStandardMaterial color={b.c} roughness={0.5} />
        </mesh>
      ))}
      {/* Woven straw stopper */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.22, 16]} />
        <meshStandardMaterial color="#b88a4e" roughness={0.95} />
      </mesh>
      {/* Woven ring stand */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.13, 14, segs]} />
        <meshStandardMaterial color="#7a2a1c" roughness={1} />
      </mesh>
    </group>
  );
}

/* ───────────── Rig: layout, tilt, lights ───────────── */
function Rig({ tier }: { tier: Tier }) {
  const group = useRef<THREE.Group>(null);
  const orient = useRef({ x: 0, y: 0 });
  const { viewport, size } = useThree();
  const wide = size.width / size.height > 1;

  // Device-orientation tilt on phones (no permission prompt; silently unavailable on iOS)
  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      orient.current.x = THREE.MathUtils.clamp(e.gamma / 30, -1, 1);
      orient.current.y = THREE.MathUtils.clamp((e.beta - 45) / 30, -1, 1);
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const px = state.pointer.x + orient.current.x;
    const py = state.pointer.y + orient.current.y;
    const targetY = -0.5 + px * 0.45 + Math.sin(t * 0.3) * 0.12;
    const targetX = -py * 0.12;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3, dt);
  });

  // Desktop: jebena sits right of the headline. Phone: centred in the upper half.
  const x = wide ? viewport.width * 0.27 : 0.15;
  const y = wide ? -1.05 : viewport.height * 0.08;
  const s = wide ? Math.min(0.85, viewport.height / 5.2) : Math.min(0.62, viewport.width / 4.6);

  return (
    <group position={[x, y, 0]} scale={s}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25} floatingRange={[-0.05, 0.05]}>
        <group ref={group}>
          <Jebena tier={tier} />
          <Steam position={[1.2, 1.78, 0]} seed={0.3} opacity={0.85} />
          {tier === "full" && <Steam position={[1.15, 1.85, 0.05]} seed={4.1} scale={1.3} opacity={0.5} />}
        </group>
      </Float>
      <Embers count={tier === "full" ? 70 : 28} />
      {/* Warm glow pool under the pot */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 48]} />
        <meshBasicMaterial color="#d9572b" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function HeroScene({ tier, active, onReady }: { tier: Tier; active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={tier === "full" ? [1, 1.5] : [1, 1.25]}
      camera={{ position: [0, 0.6, 7], fov: 35 }}
      gl={{ antialias: tier === "full", alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
      aria-hidden
    >
      <ambientLight intensity={0.25} color="#ffd9b0" />
      {/* Key: warm lamp from front-left */}
      <pointLight position={[-3, 3, 4]} intensity={2.4} color="#ffb070" decay={0} />
      {/* Rim: ember backlight */}
      <pointLight position={[3, 2.5, -3]} intensity={3.2} color="#ff6a2a" decay={0} />
      {/* Bounce from below */}
      <pointLight position={[0, -1, 2]} intensity={0.8} color="#d9572b" decay={0} />
      <Rig tier={tier} />
    </Canvas>
  );
}
