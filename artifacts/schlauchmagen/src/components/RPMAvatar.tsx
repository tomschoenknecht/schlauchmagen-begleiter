import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import type { ReactNode, RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import type { MorphTarget } from "@/hooks/useAvatarSpeech";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ── Viseme → facecap ARKit blend-shape mapping ─────────────────────────────
// facecap.glb uses _L/_R suffixes (not Left/Right).
const VISEME_TO_ARKIT: Record<string, Record<string, number>> = {
  viseme_sil: { mouthClose: 0.65 },
  viseme_PP:  { mouthClose: 1.0, mouthPress_L: 0.3, mouthPress_R: 0.3 },
  viseme_FF:  { mouthLowerDown_L: 0.3, mouthLowerDown_R: 0.3 },
  viseme_TH:  { jawOpen: 0.1, mouthLowerDown_L: 0.15, mouthLowerDown_R: 0.15 },
  viseme_DD:  { jawOpen: 0.25, mouthFunnel: 0.1 },
  viseme_kk:  { jawOpen: 0.3 },
  viseme_CH:  { mouthFunnel: 0.5, mouthStretch_L: 0.2, mouthStretch_R: 0.2, jawOpen: 0.12 },
  viseme_SS:  { mouthStretch_L: 0.2, mouthStretch_R: 0.2, mouthClose: 0.1 },
  viseme_nn:  { mouthClose: 0.55 },
  viseme_RR:  { mouthFunnel: 0.3, mouthPucker: 0.25, jawOpen: 0.1 },
  viseme_aa:  { jawOpen: 0.88, mouthLowerDown_L: 0.38, mouthLowerDown_R: 0.38 },
  viseme_E:   { mouthSmile_L: 0.42, mouthSmile_R: 0.42, jawOpen: 0.3 },
  viseme_I:   { mouthSmile_L: 0.58, mouthSmile_R: 0.58, jawOpen: 0.13 },
  viseme_O:   { jawOpen: 0.55, mouthFunnel: 0.68, mouthPucker: 0.1 },
  viseme_U:   { mouthPucker: 0.78, mouthFunnel: 0.3, jawOpen: 0.08 },
};

function visemesToArkit(visemes: MorphTarget): MorphTarget {
  const out: MorphTarget = {};
  for (const [vis, val] of Object.entries(visemes)) {
    if (val <= 0.001) continue;
    const map = VISEME_TO_ARKIT[vis];
    if (!map) continue;
    for (const [name, weight] of Object.entries(map)) {
      out[name] = Math.min(1, (out[name] ?? 0) + val * weight);
    }
  }
  return out;
}

// ── Procedural head (fallback for network failures) ────────────────────────
function ProceduralHead({ morphRef }: { morphRef: RefObject<MorphTarget> }) {
  const jawRef    = useRef<THREE.Mesh>(null!);
  const leftEye   = useRef<THREE.Mesh>(null!);
  const rightEye  = useRef<THREE.Mesh>(null!);
  const clock     = useRef(0);

  useFrame((_, delta) => {
    clock.current += delta;
    const mt = morphRef.current ?? {};
    const open = (mt["viseme_aa"] ?? 0) * 0.8 + (mt["viseme_O"] ?? 0) * 0.4;
    if (jawRef.current) {
      jawRef.current.position.y = THREE.MathUtils.lerp(
        jawRef.current.position.y, -0.075 - open * 0.04, 0.4,
      );
    }
    const blink = Math.sin(clock.current * 0.85) > 0.97 ? 0.15 : 1;
    if (leftEye.current)  leftEye.current.scale.y  = blink;
    if (rightEye.current) rightEye.current.scale.y = blink;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.18, 48, 48]} />
        <meshStandardMaterial color="#e8c4a2" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.14, 24]} />
        <meshStandardMaterial color="#e0b898" roughness={0.6} />
      </mesh>
      <mesh ref={leftEye} position={[-0.065, 0.05, 0.165]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#2a1f1a" />
      </mesh>
      <mesh ref={rightEye} position={[0.065, 0.05, 0.165]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#2a1f1a" />
      </mesh>
      <mesh position={[-0.065, 0.09, 0.165]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.055, 0.008, 0.005]} />
        <meshStandardMaterial color="#6b4226" />
      </mesh>
      <mesh position={[0.065, 0.09, 0.165]} rotation={[0, 0, -0.1]}>
        <boxGeometry args={[0.055, 0.008, 0.005]} />
        <meshStandardMaterial color="#6b4226" />
      </mesh>
      <mesh position={[0, -0.055, 0.175]}>
        <boxGeometry args={[0.08, 0.013, 0.01]} />
        <meshStandardMaterial color="#c07878" />
      </mesh>
      <mesh ref={jawRef} position={[0, -0.075, 0.175]}>
        <boxGeometry args={[0.08, 0.013, 0.01]} />
        <meshStandardMaterial color="#c07878" />
      </mesh>
    </group>
  );
}

// ── Inner error boundary (safety net inside Canvas) ────────────────────────
interface BoundaryState { hasError: boolean }
class MeshErrorBoundary extends Component<
  { children: ReactNode; morphRef: RefObject<MorphTarget>; resetKey: string },
  BoundaryState
> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState { return { hasError: true }; }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  componentDidCatch(err: Error) {
    console.warn("[RPMAvatar] render error:", err.message);
  }
  render() {
    return this.state.hasError
      ? <ProceduralHead morphRef={this.props.morphRef} />
      : this.props.children;
  }
}

// ── GLB mesh ───────────────────────────────────────────────────────────────
type MorphMode = "rpm" | "arkit" | null;

function AvatarMesh({
  url,
  morphRef,
  isFaceModel,
}: {
  url: string;
  morphRef: RefObject<MorphTarget>;
  isFaceModel: boolean;
}) {
  const { gl } = useThree();
  const meshRefs  = useRef<THREE.SkinnedMesh[]>([]);
  const allMeshes = useRef<THREE.Mesh[]>([]);
  const modeRef   = useRef<MorphMode>(null);
  const clock     = useRef(0);

  // KTX2 loader — configured once per GL context, memoised per url group
  const extendLoader = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loader: any) => {
      const ktx2 = new KTX2Loader()
        .setTranscoderPath(`${BASE}/basis/`)
        .detectSupport(gl);
      loader.setKTX2Loader(ktx2);
    },
    // gl is stable for the lifetime of the Canvas
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gl],
  );

  const { scene } = useGLTF(url, true, true, extendLoader);

  useEffect(() => {
    const skinned: THREE.SkinnedMesh[] = [];
    const all: THREE.Mesh[] = [];
    scene.traverse((obj) => {
      const mesh = obj as THREE.SkinnedMesh;
      if ((mesh as THREE.Mesh).isMesh && mesh.morphTargetDictionary) {
        all.push(mesh as THREE.Mesh);
      }
      if (mesh.isSkinnedMesh && mesh.morphTargetDictionary) {
        skinned.push(mesh);
      }
    });
    meshRefs.current  = skinned;
    allMeshes.current = all;
    modeRef.current   = null; // reset on model change
  }, [scene]);

  useFrame((_, delta) => {
    clock.current += delta;

    const visemes = morphRef.current ?? {};
    const meshList = allMeshes.current.length ? allMeshes.current : meshRefs.current;
    if (!meshList.length) return;

    // Auto-detect morph target naming on first frame
    if (!modeRef.current) {
      const dict = meshList[0].morphTargetDictionary ?? {};
      modeRef.current = "viseme_aa" in dict ? "rpm" : "arkit";
    }

    const targets: MorphTarget =
      modeRef.current === "rpm" ? visemes : visemesToArkit(visemes);

    // Auto eye-blink for ARKit models
    if (modeRef.current === "arkit") {
      const blink = Math.sin(clock.current * 0.9) > 0.97 ? 0.85 : 0;
      targets["eyeBlink_L"] = blink;
      targets["eyeBlink_R"] = blink;
    }

    for (const mesh of meshList) {
      const dict   = mesh.morphTargetDictionary;
      const inf    = mesh.morphTargetInfluences;
      if (!dict || !inf) continue;
      for (const [name, value] of Object.entries(targets)) {
        const idx = dict[name];
        if (idx !== undefined) {
          inf[idx] = THREE.MathUtils.lerp(inf[idx] ?? 0, value, 0.35);
        }
      }
      // Decay targets not in current frame back to 0
      for (const [name, idx] of Object.entries(dict)) {
        if (!(name in targets) && inf[idx] > 0.001) {
          inf[idx] = THREE.MathUtils.lerp(inf[idx], 0, 0.35);
        }
      }
    }
  });

  // Face-only model: centred at origin (no Y offset needed)
  // Full-body RPM: must be offset to show the bust
  return (
    <primitive
      object={scene}
      position={isFaceModel ? [0, -0.12, 0] : [0, -1.6, 0]}
      scale={isFaceModel ? 1.0 : 1.0}
    />
  );
}

// ── Public component ───────────────────────────────────────────────────────
interface RPMAvatarProps {
  url: string;    // "local:avatars/face.glb" or absolute https RPM url
  morphTargets: MorphTarget;
}

type GlbStatus = "probing" | "ready" | "failed";

export default function RPMAvatar({ url, morphTargets }: RPMAvatarProps) {
  const morphRef = useRef<MorphTarget>(morphTargets);
  morphRef.current = morphTargets;

  // Resolve "local:" prefix → absolute path
  const isLocal    = url.startsWith("local:");
  const resolvedUrl = isLocal ? `${BASE}/${url.slice(6)}` : url;
  const isFaceModel = isLocal;

  // Probe remote URLs before giving them to Three.js.
  // Local files are always available — skip the probe entirely.
  const [glbStatus, setGlbStatus] = useState<GlbStatus>(isLocal ? "ready" : "probing");

  useEffect(() => {
    if (isLocal) {
      setGlbStatus("ready");
      return;
    }
    setGlbStatus("probing");
    const ctrl    = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);

    // Use GET with Range (more reliable than HEAD against CDNs)
    fetch(resolvedUrl, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      signal: ctrl.signal,
      cache: "no-store",
    })
      .then((r) => {
        clearTimeout(timeout);
        if (!ctrl.signal.aborted) {
          setGlbStatus(r.ok || r.status === 206 || r.status === 416 ? "ready" : "failed");
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        if (!ctrl.signal.aborted) setGlbStatus("failed");
      });

    return () => { ctrl.abort(); clearTimeout(timeout); };
  }, [resolvedUrl, isLocal]);

  // Camera differs between face-only and full-body models
  const cam = useMemo(
    () => isFaceModel
      ? { position: [0, 0.04, 0.55] as [number, number, number], fov: 36 }
      : { position: [0, 0.05, 0.65] as [number, number, number], fov: 30 },
    [isFaceModel],
  );

  return (
    <Canvas
      camera={cam}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={1.0} />
      <directionalLight position={[1, 2, 2]}  intensity={1.4} />
      <directionalLight position={[-1, 0, -1]} intensity={0.35} color="#b0d0ff" />
      <pointLight       position={[0, 1, 1.5]} intensity={0.5}  color="#ffe4cc" />

      {glbStatus === "ready" ? (
        <MeshErrorBoundary morphRef={morphRef} resetKey={resolvedUrl}>
          <Suspense fallback={<ProceduralHead morphRef={morphRef} />}>
            <AvatarMesh
              key={resolvedUrl}
              url={resolvedUrl}
              morphRef={morphRef}
              isFaceModel={isFaceModel}
            />
          </Suspense>
        </MeshErrorBoundary>
      ) : (
        <ProceduralHead morphRef={morphRef} />
      )}
    </Canvas>
  );
}
