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

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useCursor, useGLTF, useProgress, Html } from "@react-three/drei";
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
useGLTF.preload("/assets/model/computerglb.glb");

// 3D Model Component
const Model = ({ onMonitorClick, setMonitorPosition, setShowHint }) => {
    const { scene } = useGLTF("/assets/model/computerglb.glb", true);
    const [hovered, setHovered] = useState(false);
    const monitorRef = useRef(null);

    useCursor(hovered);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material.envMapIntensity = 1;
                child.material.metalness = 1;
                child.material.roughness = 0.1;
            }

            if (child.isMesh && child.name.includes("Monitor")) {
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

// Camera Controller
const CameraController = ({ zoomToMonitor, monitorPosition }) => {
    const { camera, scene, gl } = useThree();
    const isAnimating = useRef(false);
    const router = useRouter();
    
    // Store original camera position
    const defaultPosition = useRef({ x: 0.032, y: 0.121, z: 0.5 });
    const defaultRotation = useRef({ x: -0.521, y: 0.468, z: 0.253 });

    useEffect(() => {
        // Only set default position initially if NOT coming from shutdown
        if (!window.location.search.includes("from=shutdown")) {
            camera.position.set(defaultPosition.current.x, defaultPosition.current.y, defaultPosition.current.z);
            camera.rotation.set(defaultRotation.current.x, defaultRotation.current.y, defaultRotation.current.z);
        }
    }, [camera]);

    useEffect(() => {
        const loader = new RGBELoader();
        loader.load("/assets/hdri/studio_1k.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture;
            scene.background = null;
        });
    }, [scene]);

    useEffect(() => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
    }, [gl]);

    // Handle Zoom IN (Boot logic)
    useEffect(() => {
        if (zoomToMonitor && monitorPosition && !isAnimating.current) {
            isAnimating.current = true;

            const targetPosition = {
                x: monitorPosition.x + 0.11,
                y: monitorPosition.y,
                z: monitorPosition.z,
            };

            gsap.to(camera.position, {
                ...targetPosition,
                duration: 1.5,
                ease: "power2.inOut",
            });

            gsap.to(camera.rotation, {
                x: 0,
                y: 1.65,
                z: 0,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => {
                    router.push("/boot");
                },
            });
        }
    }, [zoomToMonitor, monitorPosition, camera, router]);

    // Handle Zoom OUT (Shutdown logic)
    useEffect(() => {
        if (monitorPosition && window.location.search.includes("from=shutdown") && !isAnimating.current) {
            isAnimating.current = true;

            // 1. Instantly snap to the monitor
            camera.position.set(
                monitorPosition.x + 0.11, 
                monitorPosition.y, 
                monitorPosition.z
            );
            camera.rotation.set(0, 1.65, 0);

            // 2. Clear URL so refresh doesn't replay animation
            window.history.replaceState({}, document.title, window.location.pathname);

            // 3. Animate back to default room view
            setTimeout(() => {
                gsap.to(camera.position, {
                    x: defaultPosition.current.x,
                    y: defaultPosition.current.y,
                    z: defaultPosition.current.z,
                    duration: 2.0,
                    ease: "power2.inOut",
                });
                gsap.to(camera.rotation, {
                    x: defaultRotation.current.x,
                    y: defaultRotation.current.y,
                    z: defaultRotation.current.z,
                    duration: 2.0,
                    ease: "power2.inOut",
                    onComplete: () => {
                        isAnimating.current = false;
                    }
                });
            }, 500); // slight delay before zooming out makes it feel natural
        }
    }, [monitorPosition, camera]);

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
                </Suspense>
            </Canvas>
        </div>
    );
};

export default LandingPage;
