"use client";
/**
 * RoomScene
 * ─────────────────────────────────────────────────────────────────────────────
 * React Three Fiber scene that renders pokemonglb.glb.
 *
 * Game states:
 *   'title'/'menu' — slow orbital pan
 *   'dialogue'     — camera near bed, no controls
 *   'cutscene'     — GSAP fly bed → PC, calls onCutsceneComplete
 *   'pc_locked'    — camera locked at monitor close-up
 *   'exploring'    — FPS: PointerLockControls + WASD + collision (like original)
 */

import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";

// Suppress unhandled requestPointerLock errors (e.g. from rapid alt-tabbing)
if (typeof window !== "undefined" && typeof Element !== "undefined") {
  const originalRequestPointerLock = Element.prototype.requestPointerLock;
  Element.prototype.requestPointerLock = function (...args) {
    try {
      const promise = originalRequestPointerLock.apply(this, args);
      if (promise && promise.catch) {
        promise.catch((err) => console.warn("Pointer lock suppressed:", err));
      }
    } catch (err) {
      console.warn("Pointer lock suppressed (sync):", err);
    }
  };

  const originalConsoleError = console.error;
  console.error = function (...args) {
    if (typeof args[0] === "string" && args[0].includes("Unable to use Pointer Lock API")) {
      return; // Silently ignore to prevent Next.js dev overlay crash
    }
    originalConsoleError.apply(console, args);
  };
}
import { useGLTF, useProgress, Html, PointerLockControls, useTexture } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA POSITIONS — tweak these to adjust framing
// ─────────────────────────────────────────────────────────────────────────────
const TITLE_RADIUS = 1.5;
const TITLE_HEIGHT = 1.2;

const BED_POS  = { x:  1.5,   y: 0.4,  z:  1.5  };
const ROOM_POS = { x:  0,     y: 0.32, z:  3    }; // FPS spawn

// PC LOCKED — physically pulled back a bit from the original target
// Centered directly in front of the monitor.
const PC_POS = { x: -4.337, y: 0.310, z: -1.8 };


// ─────────────────────────────────────────────────────────────────────────────
useGLTF.preload("/assets/model/pokemonglb.glb");

// ─────────────────────────────────────────────────────────────────────────────
// Loader overlay (shown while GLB streams in)
// ─────────────────────────────────────────────────────────────────────────────
const SceneLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          zIndex: 50,
          fontFamily: "var(--font-press-start), monospace",
          color: "#fff",
        }}
      >
        <p style={{ fontSize: 13, letterSpacing: 2 }}>LOADING...</p>
        <div style={{ width: 200, height: 14, border: "2px solid #fff", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#fff", width: `${progress}%`, transition: "width 0.3s" }} />
        </div>
        <p style={{ fontSize: 9, color: "#888" }}>{Math.floor(progress)}%</p>
      </div>
    </Html>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Room Model — loads GLB, exposes Computer node world position
// ─────────────────────────────────────────────────────────────────────────────
const RoomModel = ({ onMonitorReady }) => {
  const { scene } = useGLTF("/assets/model/pokemonglb.glb");
  const hasReported = useRef(false);

  useEffect(() => {
    if (hasReported.current) return;
    const foundNodes = [];
    scene.traverse((child) => {
      if (child.name) foundNodes.push(child.name);
      if (
        child.isMesh &&
        (child.name === "Computer" ||
          child.name.includes("Computer_fireRed") ||
          child.name.includes("Computer"))
      ) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        onMonitorReady(worldPos);
      }
    });
    console.group("🎮 pokemonglb.glb — named nodes:");
    [
      "bed", "chair", "Computer", "NES", "TV", "TV_stand",
      "bookShelf", "dresser", "stairs", "railing", "wall_picture",
      "carpet_A", "carpet_B", "tiles", "title", "base", "ambient_occlusion",
    ].forEach((target) => {
      const found = foundNodes.some((n) => n.toLowerCase().includes(target.toLowerCase()));
      console.log(`  ${found ? "✅" : "❌"} ${target}`);
    });
    console.log("\nAll node names:", foundNodes);
    console.groupEnd();
    hasReported.current = true;
  }, [scene, onMonitorReady]);

  return <primitive object={scene} position={[0, -1, 0]} scale={[1, 1, 1]} dispose={null} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// KushalModel — low-poly seated 3D character built from box geometries
// Colors sampled from the sprite pixel art. Faces the monitor (negative X).
// ─────────────────────────────────────────────────────────────────────────────
const KushalModel = () => {
  const SKIN  = "#c8956c";
  const HAIR  = "#1a1008";
  const SUIT  = "#1c1c24";
  const CHAIN = "#c8a84b";
  const SHOE  = "#2a1a0a";
  const PANT  = "#111118";

  // Root sits at the chair: slightly in front of desk, at seat height.
  // Facing negative X (toward the monitor) via rotation.y = -PI/2.
  return (
    <group position={[-4.35, -0.6, -1.3]} rotation={[0, -(Math.PI * 0.99), 0]} scale={[1.8, 1.8, 1.8]}>
      {/* Hair top */}
      <mesh position={[0, 0.60, 0]}>
        <boxGeometry args={[0.19, 0.07, 0.19]} />
        <meshLambertMaterial color={HAIR} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.49, 0]}>
        <boxGeometry args={[0.17, 0.15, 0.17]} />
        <meshLambertMaterial color={SKIN} />
      </mesh>
      {/* Hair back */}
      <mesh position={[0, 0.52, -0.07]}>
        <boxGeometry args={[0.19, 0.13, 0.04]} />
        <meshLambertMaterial color={HAIR} />
      </mesh>
      {/* Torso — made taller */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[0.19, 0.30, 0.13]} />
        <meshLambertMaterial color={SUIT} />
      </mesh>
      {/* Gold chain */}
      <mesh position={[0, 0.30, 0.065]}>
        <boxGeometry args={[0.05, 0.03, 0.01]} />
        <meshLambertMaterial color={CHAIN} />
      </mesh>
      {/* Left arm (angled toward keyboard) */}
      <mesh position={[-0.12, 0.28, 0.09]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.065, 0.22, 0.065]} />
        <meshLambertMaterial color={SUIT} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.12, 0.28, 0.09]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.065, 0.22, 0.065]} />
        <meshLambertMaterial color={SUIT} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-0.12, 0.20, 0.17]}>
        <boxGeometry args={[0.055, 0.055, 0.055]} />
        <meshLambertMaterial color={SKIN} />
      </mesh>
      {/* Right hand */}
      <mesh position={[0.12, 0.20, 0.17]}>
        <boxGeometry args={[0.055, 0.055, 0.055]} />
        <meshLambertMaterial color={SKIN} />
      </mesh>
      {/* Upper legs (horizontal — seated) */}
      <mesh position={[-0.055, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.09, 0.25, 0.09]} />
        <meshLambertMaterial color={PANT} />
      </mesh>
      <mesh position={[0.055, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.09, 0.25, 0.09]} />
        <meshLambertMaterial color={PANT} />
      </mesh>
      {/* Lower legs (hanging down) */}
      <mesh position={[-0.055, -0.10, 0.19]}>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshLambertMaterial color={PANT} />
      </mesh>
      <mesh position={[0.055, -0.10, 0.19]}>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshLambertMaterial color={PANT} />
      </mesh>
      {/* Shoes */}
      <mesh position={[-0.055, -0.205, 0.21]}>
        <boxGeometry args={[0.09, 0.055, 0.11]} />
        <meshLambertMaterial color={SHOE} />
      </mesh>
      <mesh position={[0.055, -0.205, 0.21]}>
        <boxGeometry args={[0.09, 0.055, 0.11]} />
        <meshLambertMaterial color={SHOE} />
      </mesh>
    </group>

  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WASD hook — same logic as original LandingPage
// ─────────────────────────────────────────────────────────────────────────────
const usePlayerControls = () => {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false });
  useEffect(() => {
    const dn = (e) => {
      switch (e.key.toLowerCase()) {
        case "w": setMovement((m) => ({ ...m, forward:  true })); break;
        case "s": setMovement((m) => ({ ...m, backward: true })); break;
        case "a": setMovement((m) => ({ ...m, left:     true })); break;
        case "d": setMovement((m) => ({ ...m, right:    true })); break;
      }
    };
    const up = (e) => {
      switch (e.key.toLowerCase()) {
        case "w": setMovement((m) => ({ ...m, forward:  false })); break;
        case "s": setMovement((m) => ({ ...m, backward: false })); break;
        case "a": setMovement((m) => ({ ...m, left:     false })); break;
        case "d": setMovement((m) => ({ ...m, right:    false })); break;
      }
    };
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);
  return movement;
};

// ─────────────────────────────────────────────────────────────────────────────
// Camera Controller
// ─────────────────────────────────────────────────────────────────────────────
const CameraController = ({ gameState, monitorPosition, onCutsceneComplete, controlsRef, onInteractComputer }) => {
  const { camera, scene } = useThree();
  const timelineRef = useRef(null);
  const cutsceneStarted = useRef(false);
  const movement = usePlayerControls();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  
  const lastStandPos = useRef(null);
  const lastStandQuat = useRef(null);

  // ── Title/Menu: slow orbital pan ────────────────────────────────────────
  useFrame(({ clock }) => {
    if (gameState !== "title" && gameState !== "menu") return;
    const t = clock.getElapsedTime() * 0.07;
    // Offset the orbit to the center of the room (x: -1.5)
    camera.position.x = -1.5 + Math.sin(t) * TITLE_RADIUS;
    camera.position.z = Math.cos(t) * TITLE_RADIUS;
    camera.position.y = TITLE_HEIGHT + Math.sin(t * 0.4) * 0.1;
    camera.lookAt(-1.5, 0.5, 0);
  });

  // ── WASD FPS movement (exploring only) ──────────────────────────────────
  useFrame((_, delta) => {
    if (gameState !== "exploring") return;
    const speed = 1.5 * delta;
    const targetMovement = new THREE.Vector3();
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    fwd.y = 0;
    if (fwd.lengthSq() > 0) fwd.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    if (right.lengthSq() > 0) right.normalize();
    if (movement.forward)  targetMovement.addScaledVector(fwd,   speed);
    if (movement.backward) targetMovement.addScaledVector(fwd,  -speed);
    if (movement.left)     targetMovement.addScaledVector(right, -speed);
    if (movement.right)    targetMovement.addScaledVector(right,  speed);
    if (targetMovement.lengthSq() === 0) return;

    const checkCollision = (direction) => {
      if (direction.lengthSq() === 0) return false;
      const heights = [-0.8, -0.4, 0.1];
      const angles  = [0, 0.3, -0.3];
      const baseDir = direction.clone().normalize();
      for (const h of heights) {
        const origin = camera.position.clone();
        origin.y = h;
        for (const angle of angles) {
          const dir = baseDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
          raycaster.set(origin, dir);
          const hits = raycaster.intersectObjects(scene.children, true);
          for (const hit of hits) {
            if (hit.object.name?.toLowerCase().includes("chair")) continue;
            if (hit.face && hit.face.normal.y > 0.8) continue;
            if (hit.distance < 0.4) return true;
          }
        }
      }
      return false;
    };

    const moveX = new THREE.Vector3(targetMovement.x, 0, 0);
    if (moveX.lengthSq() > 0 && !checkCollision(moveX)) camera.position.x += moveX.x;
    const moveZ = new THREE.Vector3(0, 0, targetMovement.z);
    if (moveZ.lengthSq() > 0 && !checkCollision(moveZ)) camera.position.z += moveZ.z;
  });

  // ── Interact with Computer ───────────────────────────────────────────────
  useEffect(() => {
    const handleMouseClick = (e) => {
      // Must be exploring, and pointer must be locked to crosshair interact
      if (gameState !== "exploring" || !controlsRef.current?.isLocked) return;
      if (e.button !== 0) return; // only left click
      
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Find if we clicked on or near the computer
        // Mesh name from sketchfab might be "Computer" or a child node of it
        const hit = intersects.find(i => 
          i.object.name?.toLowerCase().includes("computer") ||
          i.object.parent?.name?.toLowerCase().includes("computer")
        );
        
        // Use intersections[0] distance to ensure it's not occluded
        if (hit && intersects[0].distance < 4.0 && hit.distance < 4.0) {
          lastStandPos.current = camera.position.clone();
          lastStandQuat.current = camera.quaternion.clone();
          if (document.pointerLockElement) {
             document.exitPointerLock();
          }
          // Rely on React unmounting PointerLockControls to unlock the pointer natively
          onInteractComputer?.();
        }
      }
    };
    window.addEventListener("mousedown", handleMouseClick);
    return () => window.removeEventListener("mousedown", handleMouseClick);
  }, [gameState, camera, scene, onInteractComputer]);

  // ── Dialogue: snap to bed ────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "dialogue") return;
    killTimeline();
    camera.position.set(BED_POS.x, BED_POS.y, BED_POS.z);
    camera.lookAt(0, 0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // ── Cutscene: fly bed → PC ───────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "cutscene" || cutsceneStarted.current) return;
    cutsceneStarted.current = true;
    killTimeline();
    const startPos  = camera.position.clone();
    const startQuat = camera.quaternion.clone();
    // Snap to end to capture final rotation, then restore
    camera.position.set(PC_POS.x, PC_POS.y, PC_POS.z);
    camera.lookAt(PC_POS.x, PC_POS.y, PC_POS.z - 100);
    const endQuat = camera.quaternion.clone();
    camera.position.copy(startPos);
    camera.quaternion.copy(startQuat);
    const proxy = { t: 0 };
    const tl = gsap.timeline({
      onComplete: () => { cutsceneStarted.current = false; onCutsceneComplete?.(); },
    });
    tl.to(camera.position, { ...PC_POS, duration: 2.6, ease: "power2.inOut" }, 0);
    tl.to(proxy, {
      t: 1, duration: 2.6, ease: "power2.inOut",
      onUpdate: () => camera.quaternion.slerpQuaternions(startQuat, endQuat, proxy.t),
    }, 0);
    timelineRef.current = tl;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // ── PC Locked: kill any animation, snap, unlock pointer ──────────
  useEffect(() => {
    if (gameState !== "pc_locked") return;
    killTimeline();
    cutsceneStarted.current = false;
    camera.position.set(PC_POS.x, PC_POS.y, PC_POS.z);
    camera.lookAt(PC_POS.x, PC_POS.y, PC_POS.z - 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, monitorPosition]);

  // ── Exploring: animate back to last position and unlock WASD ─────────────────
  useEffect(() => {
    if (gameState !== "exploring") return;
    killTimeline();
    cutsceneStarted.current = false;
    const startPos  = camera.position.clone();
    const startQuat = camera.quaternion.clone();
    
    const targetPos = lastStandPos.current || BED_POS;
    camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    if (lastStandQuat.current) {
        camera.quaternion.copy(lastStandQuat.current);
    } else {
        camera.lookAt(0, 0, 0);
    }
    const endQuat = camera.quaternion.clone();
    
    camera.position.copy(startPos);
    camera.quaternion.copy(startQuat);
    const proxy = { t: 0 };
    const tl = gsap.timeline();
    tl.to(camera.position, { ...targetPos, duration: 2.0, ease: "power2.inOut" }, 0);
    tl.to(proxy, {
      t: 1, duration: 2.0, ease: "power2.inOut",
      onUpdate: () => camera.quaternion.slerpQuaternions(startQuat, endQuat, proxy.t),
    }, 0);
    timelineRef.current = tl;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return null;

  function killTimeline() {
    if (timelineRef.current) { timelineRef.current.kill(); timelineRef.current = null; }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
const RoomScene = ({ gameState, onMonitorReady, onCutsceneComplete, onInteractComputer }) => {
  const [monitorPosition, setMonitorPosition] = useState(null);
  const controlsRef = useRef(null);

  const handleMonitorReady = useCallback(
    (pos) => { setMonitorPosition(pos); onMonitorReady?.(pos); },
    [onMonitorReady]
  );

  const isExploring = gameState === "exploring";

  return (
    <Canvas
      camera={{ position: [TITLE_RADIUS, TITLE_HEIGHT, 0], fov: 70 }}
      gl={{ antialias: true }}
      shadows
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 10, 5]} intensity={3} castShadow />
      <pointLight position={[-3, 2, -2]} intensity={1.2} color="#ffeedd" />
      <Suspense fallback={<SceneLoader />}>
        <RoomModel onMonitorReady={handleMonitorReady} />
        <KushalModel />
        <CameraController
          gameState={gameState}
          monitorPosition={monitorPosition}
          onCutsceneComplete={onCutsceneComplete}
          controlsRef={controlsRef}
          onInteractComputer={onInteractComputer}
        />
        {/* PointerLockControls — active ONLY in FPS exploring mode */}
        {isExploring && <PointerLockControls ref={controlsRef} makeDefault />}
      </Suspense>
    </Canvas>
  );
};

export default RoomScene;
