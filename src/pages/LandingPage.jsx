// import React, { Suspense, useEffect, useRef, useState } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { useCursor, useGLTF } from "@react-three/drei";
// import { gsap } from "gsap";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";
//
// const Model = ({ onMonitorClick, setMonitorPosition }) => {
//     const { scene } = useGLTF("/assets/model/computerglb.glb");
//     const [hovered, setHovered] = useState(false);
//     const monitorRef = useRef(null);
//
//     useCursor(hovered);
//
//     useEffect(() => {
//         scene.traverse((child) => {
//             if (child.isMesh && child.name.includes("Monitor")) {
//                 monitorRef.current = child;
//                 child.userData.clickable = true;
//
//                 // ✅ Get Monitor's Exact Position in World Space
//                 const worldPosition = new THREE.Vector3();
//                 child.getWorldPosition(worldPosition);
//
//                 // ✅ Update state with monitor's position
//                 setMonitorPosition(worldPosition);
//             }
//         });
//     }, [scene, setMonitorPosition]);
//
//     return (
//         <primitive
//             object={scene}
//             onPointerOver={(e) => {
//                 if (e.object.userData.clickable) setHovered(true);
//             }}
//             onPointerOut={() => setHovered(false)}
//             onClick={(e) => {
//                 if (e.object.userData.clickable) {
//                     onMonitorClick();
//                 }
//             }}
//             scale={[1, 1, 1]}
//             position={[0, -1, 0]}
//         />
//     );
// };
//
// const CameraController = ({ zoomToMonitor, monitorPosition }) => {
//     const { camera } = useThree();
//     const isAnimating = useRef(false);
//     const navigate = useNavigate(); // ✅ React Router navigation
//
//     useEffect(() => {
//         // ✅ Set the initial fixed camera position (side view)
//         camera.position.set(2.891, 4.259, -7.097);
//         camera.rotation.set(-2.756, 0.860, 2.843);
//     }, [camera]);
//
//     useEffect(() => {
//         if (zoomToMonitor && monitorPosition && !isAnimating.current) {
//             isAnimating.current = true;
//             console.log("📷 Adjusting camera to monitor...");
//
//             // ✅ Corrected Target Position: Move up & right to match the monitor screen
//             const targetPosition = {
//                 x: monitorPosition.x - 7, // Slightly more to the right
//                 y: monitorPosition.y + 5.5, // Higher to align with monitor
//                 z: monitorPosition.z, // Forward towards the screen
//             };
//
//             // ✅ Animate camera to zoom in smoothly
//             gsap.to(camera.position, {
//                 ...targetPosition,
//                 duration: 1.5,
//                 ease: "power2.inOut",
//             });
//
//             // ✅ Rotate camera along Y-axis to face directly at the monitor
//             gsap.to(camera.rotation, {
//                 y: 1.4, // Flat-facing towards user
//                 duration: 1.5,
//                 ease: "power2.inOut",
//                 onComplete: () => {
//                     console.log("✅ Camera aligned, starting boot sequence...");
//                     navigate("/boot"); // ✅ Use React Router navigation
//                 },
//             });
//         }
//     }, [zoomToMonitor, monitorPosition, camera, navigate]);
//
//     return null;
// };
//
// const LandingPage = () => {
//     const [zoomToMonitor, setZoomToMonitor] = useState(false);
//     const [monitorPosition, setMonitorPosition] = useState(null);
//
//     return (
//         <div className="h-screen w-screen bg-zinc-800">
//             <Canvas shadows>
//                 <CameraController zoomToMonitor={zoomToMonitor} monitorPosition={monitorPosition} />
//
//                 {/* 🔆 Enhanced Lighting */}
//                 <ambientLight intensity={1.5} />
//                 <directionalLight position={[5, 10, 5]} intensity={3} castShadow />
//
//                 <Suspense fallback={null}>
//                     <Model onMonitorClick={() => setZoomToMonitor(true)} setMonitorPosition={setMonitorPosition} />
//                 </Suspense>
//             </Canvas>
//         </div>
//     );
// };
//
// export default LandingPage;

// import React, { Suspense, useEffect, useRef, useState } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { useCursor, useGLTF } from "@react-three/drei";
// import { gsap } from "gsap";
// import * as THREE from "three";
// import { useNavigate } from "react-router-dom";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
//
// const Model = ({ onMonitorClick, setMonitorPosition }) => {
//     const { scene } = useGLTF("/assets/model/computerglb.glb");
//     const [hovered, setHovered] = useState(false);
//     const monitorRef = useRef(null);
//
//     useCursor(hovered);
//
//     useEffect(() => {
//         scene.traverse((child) => {
//             if (child.isMesh) {
//                 child.material.envMapIntensity = 1;
//                 child.material.metalness = 1;
//                 child.material.roughness = 0.1;
//             }
//
//             if (child.isMesh && child.name.includes("Monitor")) {
//                 monitorRef.current = child;
//                 child.userData.clickable = true;
//
//                 // ✅ Get Monitor's Exact Position in World Space
//                 const worldPosition = new THREE.Vector3();
//                 child.getWorldPosition(worldPosition);
//
//                 // ✅ Update state with monitor's position
//                 setMonitorPosition(worldPosition);
//             }
//         });
//     }, [scene, setMonitorPosition]);
//
//     return (
//         <primitive
//             object={scene}
//             onPointerOver={(e) => {
//                 if (e.object.userData.clickable) setHovered(true);
//             }}
//             onPointerOut={() => setHovered(false)}
//             onClick={(e) => {
//                 if (e.object.userData.clickable) {
//                     onMonitorClick();
//                 }
//             }}
//             scale={[1, 1, 1]}
//             position={[0, -1, 0]}
//         />
//     );
// };
//
// const CameraController = ({ zoomToMonitor, monitorPosition }) => {
//     const { camera, scene, gl } = useThree();
//     const isAnimating = useRef(false);
//     const navigate = useNavigate(); // ✅ React Router navigation
//
//     useEffect(() => {
//         // ✅ Set the initial fixed camera position (side view)
//         camera.position.set(0.032, 0.121, 0.5);
//         camera.rotation.set(-0.521, 0.468, 0.253);
//     }, [camera]);
//
//     useEffect(() => {
//         // ✅ Load HDRI for realistic reflections
//         const loader = new RGBELoader();
//         loader.load("/assets/hdri/studio_1k.hdr", (texture) => {
//             texture.mapping = THREE.EquirectangularReflectionMapping;
//             scene.environment = texture;
//             scene.background = null; // Keeps the background transparent while applying reflections
//         });
//     }, [scene]);
//
//     useEffect(() => {
//         // ✅ Enable proper tone mapping
//         gl.toneMapping = THREE.ACESFilmicToneMapping;
//         gl.toneMappingExposure = 1.2;
//     }, [gl]);
//
//     useEffect(() => {
//         if (zoomToMonitor && monitorPosition && !isAnimating.current) {
//             isAnimating.current = true;
//             console.log("📷 Adjusting camera to monitor...");
//
//             const targetPosition = {
//                 x: monitorPosition.x + 0.11,
//                 y: monitorPosition.y,
//                 z: monitorPosition.z,
//             };
//
//             gsap.to(camera.position, {
//                 ...targetPosition,
//                 duration: 1.5,
//                 ease: "power2.inOut",
//             });
//
//             gsap.to(camera.rotation, {
//                 x: 0,
//                 y: 1.65,
//                 z: 0,
//                 duration: 1.5,
//                 ease: "power2.inOut",
//                 onComplete: () => {
//                     console.log("✅ Camera aligned, starting boot sequence...");
//                     navigate("/boot");
//                 },
//             });
//         }
//     }, [zoomToMonitor, monitorPosition, camera, navigate]);
//
//     return null;
// };
//
// const LandingPage = () => {
//     const [zoomToMonitor, setZoomToMonitor] = useState(false);
//     const [monitorPosition, setMonitorPosition] = useState(null);
//
//     return (
//         <div className="h-screen w-screen bg-zinc-800">
//             <Canvas shadows>
//                 <CameraController zoomToMonitor={zoomToMonitor} monitorPosition={monitorPosition} />
//
//                 {/* 🔆 Enhanced Lighting */}
//                 <ambientLight intensity={1.5} />
//                 <directionalLight position={[5, 10, 5]} intensity={3} castShadow />
//
//                 <Suspense fallback={null}>
//                     <Model onMonitorClick={() => setZoomToMonitor(true)} setMonitorPosition={setMonitorPosition} />
//                 </Suspense>
//             </Canvas>
//         </div>
//     );
// };
//
// export default LandingPage;

// import React, { Suspense, useRef } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useCursor, useGLTF } from "@react-three/drei";
// import { useNavigate } from "react-router-dom";
//
// const Model = () => {
//     const { scene } = useGLTF("/assets/model/computerglb.glb");
//     const navigate = useNavigate();
//     const [hovered, setHovered] = React.useState(false);
//
//     useCursor(hovered);
//
//     scene.traverse((child) => {
//         if (child.isMesh && child.name === "Monitor_27'_Curved") {
//             child.userData.clickable = true;
//         }
//     });
//
//     return (
//         <primitive
//             object={scene}
//             onPointerOver={(e) => {
//                 if (e.object.userData.clickable) setHovered(true);
//             }}
//             onPointerOut={() => setHovered(false)}
//             onClick={(e) => {
//                 if (e.object.userData.clickable) {
//                     navigate("/boot");
//                 }
//             }}
//             scale={[1, 1, 1]}
//             position={[0, -1, 0]}
//         />
//     );
// };
//
// const CameraLogger = () => {
//     const { camera } = useThree();
//     const cameraRef = useRef(camera);
//
//     useThree(({ camera }) => {
//         cameraRef.current = camera;
//         console.log("Camera Position:", camera.position);
//         console.log("Camera Rotation:", camera.rotation);
//     });
//
//     return null;
// };
//
// const LandingPage = () => {
//     return (
//         <div className="h-screen w-screen">
//             <Canvas shadows camera={{ position: [-5, 2, 3], fov: 50 }}>
//                 <ambientLight intensity={0.6} />
//                 <directionalLight position={[3, 5, 2]} castShadow />
//                 <Suspense fallback={null}>
//                     <Model />
//                 </Suspense>
//                 <OrbitControls />
//                 <CameraLogger />
//             </Canvas>
//         </div>
//     );
// };
//
// export default LandingPage;

import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useCursor, useGLTF, useProgress, Html, PointerLockControls } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// Loader Overlay with percentage and skip option
const LoaderOverlay = () => {
    const { progress } = useProgress();
    const router = useRouter();
    const isFromShutdown = typeof window !== "undefined" && window.location.search.includes("from=shutdown");

    const handleSkip = () => {
        router.push('/boot');
    };

    if (isFromShutdown) {
        return (
            <Html center>
                <div className="fixed inset-0 bg-black z-50"></div>
            </Html>
        );
    }

    return (
        <Html center>
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-900 z-50">
                <div className="text-center text-white">
                    <p className="text-xl font-semibold mb-2">Loading 3D Environment...</p>
                    <p className="text-lg">{Math.floor(progress)}%</p>
                    <progress className="progress w-56 mt-2" value={progress} max="100" />
                    <div className="mt-8 text-md text-gray-400">
                        Taking too long?
                    </div>
                    <button
                        onClick={handleSkip}
                        className="mt-2 px-6 py-2 text-lg font-small text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer touch-action-manipulation active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Skip to classic boot
                    </button>
                </div>
            </div>
        </Html>
    );
};

// Hint Message Overlay
const HintOverlay = () => (
    <Html center>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-4 rounded-xl shadow-lg w-80 h-20 flex items-center justify-center text-center text-sm font-medium">
            💡 Hint: Click on the laptop display to continue
        </div>
    </Html>
);


// Preload the model
useGLTF.preload("/assets/model/pokemonglb.glb");

// 3D Model Component
const Model = ({ onMonitorClick, setMonitorPosition, setShowHint }) => {
    const { scene } = useGLTF("/assets/model/pokemonglb.glb", true);
    const [hovered, setHovered] = useState(false);
    const monitorRef = useRef(null);

    useCursor(hovered);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                // Removed forced reflection properties
            }

            if (child.isMesh && (child.name.includes("Computer_fireRed_material") || child.name.includes("Computer"))) {
                monitorRef.current = child;
                child.userData.clickable = true;

                const worldPosition = new THREE.Vector3();
                child.getWorldPosition(worldPosition);
                setMonitorPosition(worldPosition);
                setShowHint(true); // Show the hint once monitor is positioned
            }
        });
    }, [scene, setMonitorPosition, setShowHint]);

    return (
        <primitive
            object={scene}
            onPointerOver={(e) => e.object.userData.clickable && setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
                if (e.object.userData.clickable) {
                    setShowHint(false); // Hide hint on click
                    onMonitorClick();
                }
            }}
            scale={[1, 1, 1]}
            position={[0, -1, 0]}
        />
    );
};

// Player WASD Controller Hook
const usePlayerControls = () => {
    const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, up: false, down: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': setMovement(m => ({ ...m, forward: true })); break;
                case 's': setMovement(m => ({ ...m, backward: true })); break;
                case 'a': setMovement(m => ({ ...m, left: true })); break;
                case 'd': setMovement(m => ({ ...m, right: true })); break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': setMovement(m => ({ ...m, forward: false })); break;
                case 's': setMovement(m => ({ ...m, backward: false })); break;
                case 'a': setMovement(m => ({ ...m, left: false })); break;
                case 'd': setMovement(m => ({ ...m, right: false })); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return movement;
};

// Camera Controller
const CameraController = ({ zoomToMonitor, monitorPosition }) => {
    const { camera, scene, gl, controls } = useThree();
    const isAnimating = useRef(false);
    const router = useRouter();
    const raycaster = useMemo(() => new THREE.Raycaster(), []);

    // Store original camera position
    const defaultPosition = useRef({ x: 0, y: 0.32, z: 3 }); // Lower and further forward
    const defaultRotation = useRef({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        // Only set default position initially if NOT coming from shutdown
        if (!window.location.search.includes("from=shutdown")) {
            camera.position.set(defaultPosition.current.x, defaultPosition.current.y, defaultPosition.current.z);
            camera.rotation.set(defaultRotation.current.x, defaultRotation.current.y, defaultRotation.current.z);
        }
    }, [camera]);

    const movement = usePlayerControls();

    useFrame((state, delta) => {
        if (isAnimating.current) return;

        const speed = 1.5 * delta; // Reduced movement speed

        const targetMovement = new THREE.Vector3();

        // Calculate forward and right vectors, constrained to XZ plane
        const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        forwardVector.y = 0;
        if (forwardVector.lengthSq() > 0) forwardVector.normalize();

        const rightVector = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
        rightVector.y = 0;
        if (rightVector.lengthSq() > 0) rightVector.normalize();

        if (movement.forward) targetMovement.addScaledVector(forwardVector, speed);
        if (movement.backward) targetMovement.addScaledVector(forwardVector, -speed);
        if (movement.left) targetMovement.addScaledVector(rightVector, -speed);
        if (movement.right) targetMovement.addScaledVector(rightVector, speed);

        if (targetMovement.lengthSq() > 0) {
            const collisionDistance = 0.3;
            const origin = camera.position.clone();
            // Cast from knee/waist height (-0.5 world space) to hit furniture reliably
            origin.y = -0.5; 

            const checkCollision = (direction) => {
                if (direction.lengthSq() === 0) return false;
                
                // Heights to check: Knee, Waist, Chest (remember floor is at y=-1)
                const heights = [-0.8, -0.4, 0.1];
                
                // Angles to check: Center, slightly left, slightly right to give "width" to the player
                const angles = [0, 0.3, -0.3]; // ~17 degrees left and right
                
                const baseDir = direction.clone().normalize();

                for (let h of heights) {
                    const origin = camera.position.clone();
                    origin.y = h;
                    
                    for (let angle of angles) {
                        const dir = baseDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                        raycaster.set(origin, dir);
                        const intersects = raycaster.intersectObjects(scene.children, true);
                        
                        for (let i = 0; i < intersects.length; i++) {
                            const obj = intersects[i].object;
                            
                            // Allow walking through specific objects like the chair
                            if (obj.name && obj.name.toLowerCase().includes("chair")) continue;

                            // Ignore upward-facing normals (the floor) so we don't get stuck
                            if (intersects[i].face && intersects[i].face.normal.y > 0.8) continue;
                            
                            // Increased collision distance slightly for a better buffer
                            if (intersects[i].distance < 0.4) return true;
                        }
                    }
                }
                return false;
            };

            // Test X axis movement independently (allows sliding along walls)
            const moveX = new THREE.Vector3(targetMovement.x, 0, 0);
            if (moveX.lengthSq() > 0 && !checkCollision(moveX)) {
                camera.position.x += moveX.x;
            }

            // Test Z axis movement independently (allows sliding along walls)
            const moveZ = new THREE.Vector3(0, 0, targetMovement.z);
            if (moveZ.lengthSq() > 0 && !checkCollision(moveZ)) {
                camera.position.z += moveZ.z;
            }
        }
    });

    useEffect(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
    }, [gl]);

    // Debug tool to find the perfect computer position
    useEffect(() => {
        const handlePKey = (e) => {
            if (e.key.toLowerCase() === 'p') {
                console.log("=== PERFECT MONITOR POSITION ===");
                console.log("Camera Position: ", { x: camera.position.x, y: camera.position.y, z: camera.position.z });
                console.log("Target Position: ", { x: controls.target.x, y: controls.target.y, z: controls.target.z });
            }
        };
        window.addEventListener('keydown', handlePKey);
        return () => window.removeEventListener('keydown', handlePKey);
    }, [camera, controls]);

    // Handle Zoom IN (Boot logic)
    useEffect(() => {
        if (zoomToMonitor && monitorPosition && !isAnimating.current) {
            isAnimating.current = true;
            if (controls) controls.unlock();

            const targetPosition = {
                x: -4.337,
                y: 0.320,
                z: -1.907,
            };

            // Tweak these offsets to adjust exactly where the camera points!
            const lookTarget = new THREE.Vector3(
                monitorPosition.x,
                monitorPosition.y,
                monitorPosition.z - 100  // Tweak Z to turn LEFT or RIGHT!
            );

            // Calculate the final rotation needed
            const startPos = new THREE.Vector3().copy(camera.position);
            const startQuat = new THREE.Quaternion().copy(camera.quaternion);
            
            // Temporarily snap to the final state to grab the final rotation
            camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            camera.lookAt(lookTarget);
            const endQuat = new THREE.Quaternion().copy(camera.quaternion);
            
            // Restore back to starting state
            camera.position.copy(startPos);
            camera.quaternion.copy(startQuat);

            // Animate Position
            gsap.to(camera.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1.5,
                ease: "power2.inOut",
            });

            // Perfectly and naturally interpolate rotation using SLERP
            const proxy = { t: 0 };
            gsap.to(proxy, {
                t: 1,
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    camera.quaternion.slerpQuaternions(startQuat, endQuat, proxy.t);
                },
                onComplete: () => {
                    router.push("/boot");
                },
            });
        }
    }, [zoomToMonitor, monitorPosition, camera, router, controls]);

    // Handle Zoom OUT (Shutdown logic)
    useEffect(() => {
        if (monitorPosition && window.location.search.includes("from=shutdown") && !isAnimating.current) {
            isAnimating.current = true;

            // Match the same look target as above
            const lookTarget = new THREE.Vector3(
                monitorPosition.x,
                monitorPosition.y,
                monitorPosition.z - 0.5
            );

            // 1. Instantly snap to the monitor
            camera.position.set(
                -4.337,
                0.320,
                -1.907
            );
            camera.lookAt(lookTarget);

            // 2. Clear URL so refresh doesn't replay animation
            window.history.replaceState({}, document.title, window.location.pathname);

            // 3. Animate back to default room view
            setTimeout(() => {
                const proxy = { t: 0 };
                const startRot = new THREE.Euler().copy(camera.rotation);
                const endRot = new THREE.Euler(defaultRotation.current.x, defaultRotation.current.y, defaultRotation.current.z, "XYZ");

                // We animate the position directly
                gsap.to(camera.position, {
                    x: defaultPosition.current.x,
                    y: defaultPosition.current.y,
                    z: defaultPosition.current.z,
                    duration: 2.0,
                    ease: "power2.inOut",
                });

                // We animate a proxy value and slerp the rotation for smoother look
                gsap.to(proxy, {
                    t: 1,
                    duration: 2.0,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        const qStart = new THREE.Quaternion().setFromEuler(startRot);
                        const qEnd = new THREE.Quaternion().setFromEuler(endRot);
                        qStart.slerp(qEnd, proxy.t);
                        camera.quaternion.copy(qStart);
                    },
                    onComplete: () => {
                        isAnimating.current = false;
                    }
                });
            }, 500); // slight delay before zooming out makes it feel natural
        }
    }, [monitorPosition, camera, controls]);

    return null;
};

// Main Landing Page
const LandingPage = () => {
    const [zoomToMonitor, setZoomToMonitor] = useState(false);
    const [monitorPosition, setMonitorPosition] = useState(null);
    const [showHint, setShowHint] = useState(false);

    return (
        <div className="h-screen w-screen bg-zinc-800">
            <Canvas shadows>
                <Suspense fallback={<LoaderOverlay />}>
                    <CameraController
                        zoomToMonitor={zoomToMonitor}
                        monitorPosition={monitorPosition}
                    />
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 10, 5]} intensity={3} castShadow />
                    <Model
                        onMonitorClick={() => setZoomToMonitor(true)}
                        setMonitorPosition={setMonitorPosition}
                        setShowHint={setShowHint}
                    />
                    {showHint && <HintOverlay />}
                    <PointerLockControls makeDefault />
                </Suspense>
            </Canvas>
            
            {/* Center Crosshair for FPS mode */}
            {!zoomToMonitor && (
                <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-40">
                    <div className="w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
