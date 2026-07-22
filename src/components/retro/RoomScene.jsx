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
import styles from "./retro.module.css";

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
const KushalModel = ({ pose = "IDLE", showExclamation = false }) => {
  const SKIN  = "#c8956c";
  const HAIR  = "#1a1008";
  const SUIT  = "#1c1c24";
  const CHAIN = "#c8a84b";
  const SHOE  = "#2a1a0a";
  const PANT  = "#111118";

  const groupRef = useRef();
  const rightArmRef = useRef();
  const rightHandRef = useRef();

  // Target values based on pose
  // Normal monitor view: rotation.y = Math.PI * 1.01 (+182 degrees, facing monitor at -X)
  // Turned to player: rotation.y = Math.PI * 0.45 (+81 degrees, short 90-degree right turn to camera)
  const targetRotY = (pose === "TALKING" || pose === "POINTING") ? Math.PI * 0.5 : Math.PI * 1.01;

  // Right arm angles (point forward/up along local +Z toward camera)
  const targetArmRotX = pose === "POINTING" ? -1.95 : -0.5;
  const targetArmRotZ = pose === "POINTING" ? -0.15 : 0;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 5
      );
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.x,
        targetArmRotX,
        delta * 6
      );
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightArmRef.current.rotation.z,
        targetArmRotZ,
        delta * 6
      );
    }
  });

  return (
    <group ref={groupRef} position={[-4.35, -0.6, -1.3]} rotation={[0, Math.PI * 1.01, 0]} scale={[1.8, 1.8, 1.8]}>
      {/* Pokémon Exclamation Bubble ("!") */}
      {showExclamation && (
        <Html position={[0, 0.78, 0]} center distanceFactor={7} zIndexRange={[100, 0]}>
          <div className={styles.exclamationBubble}>
            <span className={styles.exclamationMark}>!</span>
          </div>
        </Html>
      )}

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
      {/* Torso */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[0.19, 0.30, 0.13]} />
        <meshLambertMaterial color={SUIT} />
      </mesh>
      {/* Gold chain */}
      <mesh position={[0, 0.30, 0.065]}>
        <boxGeometry args={[0.05, 0.03, 0.01]} />
        <meshLambertMaterial color={CHAIN} />
      </mesh>
      {/* Left arm & hand group (pivot at top shoulder) */}
      <group position={[-0.12, 0.39, 0.04]} rotation={[-0.5, 0, 0]}>
        {/* Left sleeve */}
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[0.065, 0.18, 0.065]} />
          <meshLambertMaterial color={SUIT} />
        </mesh>
        {/* Left hand (extending cleanly from cuff) */}
        <mesh position={[0, -0.21, 0.01]}>
          <boxGeometry args={[0.055, 0.07, 0.055]} />
          <meshLambertMaterial color={SKIN} />
        </mesh>
      </group>
      {/* Right arm & hand group (pivot at top shoulder) */}
      <group ref={rightArmRef} position={[0.12, 0.39, 0.04]} rotation={[-0.5, 0, 0]}>
        {/* Right sleeve */}
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[0.065, 0.18, 0.065]} />
          <meshLambertMaterial color={SUIT} />
        </mesh>
        {/* Right hand (extending cleanly from cuff) */}
        <mesh position={[0, -0.21, 0.01]}>
          <boxGeometry args={[0.055, 0.07, 0.055]} />
          <meshLambertMaterial color={SKIN} />
        </mesh>
      </group>
      {/* Upper legs */}
      <mesh position={[-0.055, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.09, 0.25, 0.09]} />
        <meshLambertMaterial color={PANT} />
      </mesh>
      <mesh position={[0.055, 0.04, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.09, 0.25, 0.09]} />
        <meshLambertMaterial color={PANT} />
      </mesh>
      {/* Lower legs */}
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
const CameraController = ({ gameState, introPhase, monitorPosition, onCutsceneComplete, controlsRef, onInteractComputer }) => {
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

  // ── Path Recorder Mode ──────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const pathKeyframesRef = useRef([]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "p") {
        setIsRecording((prev) => {
          const next = !prev;
          if (next) {
            pathKeyframesRef.current = [];
            console.log("🔴 PATH RECORDING STARTED! Walk your exact desired path...");
          } else {
            console.log("⏹️ PATH RECORDING STOPPED!");
            console.log(JSON.stringify(pathKeyframesRef.current, null, 2));
            if (typeof window !== "undefined") {
              window.__RECORDED_PATH__ = pathKeyframesRef.current;
            }
            alert(`Recorded ${pathKeyframesRef.current.length} keyframes! Keyframes logged to DevTools console and window.__RECORDED_PATH__`);
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useFrame(() => {
    if (typeof window !== "undefined") {
      window.__RECORD_CAM__ = () => ({
        x: Number(camera.position.x.toFixed(3)),
        y: Number(camera.position.y.toFixed(3)),
        z: Number(camera.position.z.toFixed(3)),
        rotY: Number(camera.rotation.y.toFixed(3)),
      });
    }
  });

  // ── WASD FPS movement (exploring or recording) ─────────────────────────
  useFrame((_, delta) => {
    if (gameState !== "exploring" && !isRecording) return;
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

  // ── Dialogue: initial room entrance view or smooth walk to desk ───────────
  const hasWalkedRef = useRef(false);

  useEffect(() => {
    if (gameState !== "dialogue") {
      hasWalkedRef.current = false;
      return;
    }

    if (introPhase === "START" || !introPhase) {
      if (!hasWalkedRef.current) {
        killTimeline();
        camera.position.set(0, 0.32, 3);
        camera.lookAt(-1.0, 0.1, 0);
      }
    } else if (introPhase === "WALKING" && !hasWalkedRef.current) {
      hasWalkedRef.current = true;
      killTimeline();

      const RECORDED_KEYFRAMES = [
        { x: 0,      y: 0.32, z: 3.0,    rotY: 0 },
        { x: -0.244, y: 0.32, z: 2.567,  rotY: 0.568 },
        { x: -0.519, y: 0.32, z: 2.211,  rotY: 0.726 },
        { x: -0.97,  y: 0.32, z: 1.710,  rotY: 0.739 },
        { x: -1.437, y: 0.32, z: 1.223,  rotY: 0.768 },
        { x: -1.778, y: 0.32, z: 0.892,  rotY: 0.829 },
        { x: -1.895, y: 0.32, z: -0.019, rotY: 1.007 },
        { x: -2.305, y: 0.32, z: -0.716, rotY: 1.313 },
        { x: -2.866, y: 0.32, z: -1.287, rotY: 1.366 },
        { x: -3.181, y: 0.32, z: -1.361, rotY: 1.498 },
      ];

      // Calculate cumulative distances along keyframes for uniform, natural speed
      const waypoints = RECORDED_KEYFRAMES;
      const distances = [0];
      let totalLength = 0;

      for (let i = 1; i < waypoints.length; i++) {
        const p1 = new THREE.Vector3(waypoints[i - 1].x, waypoints[i - 1].y, waypoints[i - 1].z);
        const p2 = new THREE.Vector3(waypoints[i].x, waypoints[i].y, waypoints[i].z);
        totalLength += p1.distanceTo(p2);
        distances.push(totalLength);
      }

      // Reset camera
      camera.position.set(waypoints[0].x, waypoints[0].y, waypoints[0].z);
      camera.rotation.set(0, waypoints[0].rotY, 0);

      const proxy = { progress: 0 };
      const tl = gsap.timeline();

      tl.to(proxy, {
        progress: 1,
        duration: 3.5,
        ease: "power1.inOut",
        onUpdate: () => {
          const currentDist = proxy.progress * totalLength;

          // Find current segment
          let idx = 0;
          while (idx < distances.length - 2 && distances[idx + 1] < currentDist) {
            idx++;
          }

          const segStartDist = distances[idx];
          const segEndDist   = distances[idx + 1];
          const segLength    = segEndDist - segStartDist;
          const segT         = segLength > 0 ? (currentDist - segStartDist) / segLength : 0;

          const pStart = waypoints[idx];
          const pEnd   = waypoints[idx + 1];

          // Linear position interpolation along exact segment path (no overshooting curves!)
          camera.position.x = THREE.MathUtils.lerp(pStart.x, pEnd.x, segT);
          camera.position.y = THREE.MathUtils.lerp(pStart.y, pEnd.y, segT);
          camera.position.z = THREE.MathUtils.lerp(pStart.z, pEnd.z, segT);

          // Linear rotation interpolation
          camera.rotation.y = THREE.MathUtils.lerp(pStart.rotY, pEnd.rotY, segT);
        },
      });

      timelineRef.current = tl;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, introPhase]);

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
    
    const targetPos = lastStandPos.current || { x: 0, y: 0.32, z: 3.0 };
    camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    if (lastStandQuat.current) {
        camera.quaternion.copy(lastStandQuat.current);
    } else {
        camera.lookAt(0, 0.32, -100);
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
const RoomScene = ({ gameState, introPhase, kushalPose, showExclamation, onMonitorReady, onCutsceneComplete, onInteractComputer }) => {
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
        <KushalModel pose={kushalPose} showExclamation={showExclamation} />
        <CameraController
          gameState={gameState}
          introPhase={introPhase}
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
