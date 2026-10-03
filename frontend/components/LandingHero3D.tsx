"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface LandingHero3DProps {
  isIntro?: boolean;
  introPhase?: number; // 1 to 7
  mousePosition?: { x: number; y: number };
  settled?: boolean;
}

export default function LandingHero3D({
  isIntro = false,
  introPhase = 7,
  mousePosition,
  settled = false,
}: LandingHero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // References for animation manipulation
  const animStateRef = useRef({
    introPhase,
    settled,
    mousePos: mousePosition || { x: 0.5, y: 0.5 },
  });

  useEffect(() => {
    animStateRef.current.introPhase = introPhase;
    animStateRef.current.settled = settled;
    if (mousePosition) {
      animStateRef.current.mousePos = mousePosition;
    }
  }, [introPhase, settled, mousePosition]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting System (Signalingo Theme: Dark Blue + Turquoise + Sunburst Yellow)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    // Turquoise directional light from top-left
    const turquoiseDirLight = new THREE.DirectionalLight(0x00a896, 3.2);
    turquoiseDirLight.position.set(-8, 10, 8);
    scene.add(turquoiseDirLight);

    // Secondary turquoise rim light from right
    const turquoiseRimLight = new THREE.DirectionalLight(0x02c39a, 2.0);
    turquoiseRimLight.position.set(8, -6, 6);
    scene.add(turquoiseRimLight);

    // Central Warm Sunburst Yellow PointLight (#FFB703) — The Hope / Hearth Light
    const yellowCenterLight = new THREE.PointLight(0xffb703, settled ? 4.5 : 0.5, 35);
    yellowCenterLight.position.set(0, 0.5, 2);
    scene.add(yellowCenterLight);

    // Soft yellow floor/underglow
    const yellowUnderLight = new THREE.PointLight(0xffb703, 1.8, 25);
    yellowUnderLight.position.set(0, -5, 4);
    scene.add(yellowUnderLight);

    // 3. Materials
    const turquoiseSkinMat = new THREE.MeshStandardMaterial({
      color: 0x00a896,
      roughness: 0.32,
      metalness: 0.18,
      emissive: 0x002e26,
      emissiveIntensity: 0.35,
    });

    const yellowAccentMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      roughness: 0.22,
      metalness: 0.65,
      emissive: 0x664400,
      emissiveIntensity: 0.65,
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x02c39a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    // 4. Stylized Hand Builder Function (Creates Left or Right Hand)
    const createStylizedHand = (isLeft: boolean) => {
      const handGroup = new THREE.Group();
      const mirror = isLeft ? -1 : 1;

      // --- Palm Base (Smooth rounded look) ---
      const palmGeo = new THREE.BoxGeometry(2.4, 3.0, 0.85);
      const palmMesh = new THREE.Mesh(palmGeo, turquoiseSkinMat);
      palmMesh.position.set(0, 0, 0);
      handGroup.add(palmMesh);

      // Delicate wireframe accent overlay
      const palmWire = new THREE.Mesh(palmGeo, wireframeMat);
      palmMesh.add(palmWire);

      // --- Wrist / Forearm Base ---
      const wristGeo = new THREE.CylinderGeometry(1.0, 1.25, 2.2, 18);
      const wristMesh = new THREE.Mesh(wristGeo, turquoiseSkinMat);
      wristMesh.position.set(0, -2.2, -0.15);
      wristMesh.rotation.x = -0.1;
      handGroup.add(wristMesh);

      // Wrist golden bracelet ring
      const wristRingGeo = new THREE.TorusGeometry(1.18, 0.08, 16, 32);
      const wristRing = new THREE.Mesh(wristRingGeo, yellowAccentMat);
      wristRing.position.set(0, -1.8, -0.1);
      wristRing.rotation.x = Math.PI / 2;
      handGroup.add(wristRing);

      // --- Finger Creation Helper ---
      const fingerRefs: Array<{
        group: THREE.Group;
        knuckle: THREE.Mesh;
        midJoint: THREE.Mesh;
        tip: THREE.Mesh;
      }> = [];

      const createFinger = (
        posX: number,
        posY: number,
        length: number,
        width: number,
        isThumb: boolean = false
      ) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.position.set(posX, posY, 0.05);

        // Root Knuckle Sphere
        const knuckleGeo = new THREE.SphereGeometry(width * 0.72, 16, 16);
        const knuckle = new THREE.Mesh(knuckleGeo, yellowAccentMat);
        fingerGroup.add(knuckle);

        // Phalanx 1 (Proximal)
        const p1Geo = new THREE.CylinderGeometry(
          width * 0.58,
          width * 0.68,
          length * 0.52,
          14
        );
        const p1 = new THREE.Mesh(p1Geo, turquoiseSkinMat);
        p1.position.set(0, length * 0.26, 0);
        fingerGroup.add(p1);

        // Mid Knuckle Sphere
        const midJointGeo = new THREE.SphereGeometry(width * 0.6, 14, 14);
        const midJoint = new THREE.Mesh(midJointGeo, yellowAccentMat);
        midJoint.position.set(0, length * 0.52, 0);
        fingerGroup.add(midJoint);

        // Phalanx 2 (Distal / Tip segment)
        const p2Geo = new THREE.CylinderGeometry(
          width * 0.45,
          width * 0.56,
          length * 0.44,
          14
        );
        const p2 = new THREE.Mesh(p2Geo, turquoiseSkinMat);
        p2.position.set(0, length * 0.74, 0);
        fingerGroup.add(p2);

        // Fingertip Glowing Sphere
        const tipGeo = new THREE.SphereGeometry(width * 0.52, 16, 16);
        const tip = new THREE.Mesh(tipGeo, yellowAccentMat);
        tip.position.set(0, length * 0.98, 0);
        fingerGroup.add(tip);

        if (isThumb) {
          fingerGroup.position.set(mirror * -1.45, -0.2, 0.15);
          fingerGroup.rotation.z = mirror * (Math.PI / 4.2);
          fingerGroup.rotation.x = -0.25;
          fingerGroup.rotation.y = mirror * 0.3;
        }

        handGroup.add(fingerGroup);
        fingerRefs.push({ group: fingerGroup, knuckle, midJoint, tip });
        return fingerGroup;
      };

      // 5 Fingers (Thumb, Index, Middle, Ring, Pinky)
      const thumb = createFinger(0, 0, 1.8, 0.58, true);
      const indexF = createFinger(mirror * -0.78, 1.5, 2.5, 0.48);
      const middleF = createFinger(mirror * -0.26, 1.55, 2.8, 0.5);
      const ringF = createFinger(mirror * 0.28, 1.5, 2.55, 0.48);
      const pinkyF = createFinger(mirror * 0.78, 1.4, 2.0, 0.42);

      // Welcoming gesture natural curve
      // Open hand, fingers gently curving outward and forward
      indexF.rotation.x = -0.15;
      middleF.rotation.x = -0.1;
      ringF.rotation.x = -0.18;
      pinkyF.rotation.x = -0.25;

      return {
        group: handGroup,
        thumb,
        indexF,
        middleF,
        ringF,
        pinkyF,
        fingerRefs,
      };
    };

    // Create Left and Right Hands for the Welcoming Connection
    const leftHand = createStylizedHand(true);
    const rightHand = createStylizedHand(false);

    // Two-hand master group
    const handsMasterGroup = new THREE.Group();
    handsMasterGroup.add(leftHand.group);
    handsMasterGroup.add(rightHand.group);
    scene.add(handsMasterGroup);

    // Initial hand poses
    // Left Hand Position
    leftHand.group.position.set(-2.8, 0, 0);
    leftHand.group.rotation.set(-0.15, 0.25, -0.12);

    // Right Hand Position
    rightHand.group.position.set(2.8, 0, 0);
    rightHand.group.rotation.set(-0.15, -0.25, 0.12);

    // 5. Subtle Turquoise & Sunburst Yellow Particle Constellation
    const particleCount = prefersReducedMotion ? 60 : 200;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const cTurquoise = new THREE.Color(0x00a896);
    const cYellow = new THREE.Color(0xffb703);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Dispersed in an organic spherical halo around hands
      const radius = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi) - 2;

      // 60% Sunburst Yellow for high warmth and hope, 40% Turquoise
      const chosenColor = Math.random() > 0.4 ? cYellow : cTurquoise;
      colorArray[i] = chosenColor.r;
      colorArray[i + 1] = chosenColor.g;
      colorArray[i + 2] = chosenColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Warm Radiant Orbital Energy Rings
    const ringGeo1 = new THREE.TorusGeometry(6.2, 0.05, 16, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xffb703,
      transparent: true,
      opacity: 0.35,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.8;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(7.8, 0.04, 16, 90);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00a896,
      transparent: true,
      opacity: 0.25,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3.4;
    scene.add(ring2);

    // 7. Animation Loop & Story Phase Timing
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const currentMouse = animStateRef.current.mousePos;
      const isSettled = animStateRef.current.settled;

      // Calculate Mouse Parallax Targets
      const mouseFactorX = (currentMouse.x - 0.5) * 2;
      const mouseFactorY = (currentMouse.y - 0.5) * 2;

      // Parallax smooth interpolation on Camera
      if (!prefersReducedMotion) {
        const targetCamX = mouseFactorX * 1.8;
        const targetCamY = -mouseFactorY * 1.2;
        camera.position.x += (targetCamX - camera.position.x) * 0.04;
        camera.position.y += (targetCamY - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
      }

      // Story Sequence Execution
      if (!isSettled && isIntro && !prefersReducedMotion) {
        // --- CINEMATIC 7-PHASE INTRO STORY ---
        if (elapsed < 1.0) {
          // Phase 1 (0 to 1.0s): Darkness -> Soft Warm Yellow Glow
          const t = elapsed / 1.0;
          yellowCenterLight.intensity = 0.5 + t * 2.0;
          particleMat.opacity = 0.1 + t * 0.3;
          handsMasterGroup.position.z = -14;
          handsMasterGroup.scale.set(0.6, 0.6, 0.6);
        } else if (elapsed < 2.2) {
          // Phase 2 & 3 (1.0 to 2.2s): Particles expand & Two Stylized Hands emerge from darkness
          const t = Math.min((elapsed - 1.0) / 1.2, 1.0);
          const easeOut = Math.sin((t * Math.PI) / 2);

          yellowCenterLight.intensity = 2.5 + easeOut * 2.5;
          particleMat.opacity = 0.4 + easeOut * 0.4;

          handsMasterGroup.position.z = -14 + 14 * easeOut;
          const s = 0.6 + 0.4 * easeOut;
          handsMasterGroup.scale.set(s, s, s);

          // Hands move into welcoming gesture
          leftHand.group.position.x = -4.5 + (1 - easeOut) * -2;
          rightHand.group.position.x = 4.5 + (1 - easeOut) * 2;
          leftHand.group.rotation.y = 0.25 * easeOut;
          rightHand.group.rotation.y = -0.25 * easeOut;
        } else if (elapsed < 3.5) {
          // Phase 4 & 5 (2.2 to 3.5s): Welcoming Gesture holds and light radiates
          yellowCenterLight.intensity = 5.0 + Math.sin(elapsed * 2.5) * 0.6;
          yellowUnderLight.intensity = 2.0 + Math.sin(elapsed * 2.5) * 0.4;

          // Gentle welcoming wave / breathing gesture
          leftHand.group.position.y = Math.sin(elapsed * 1.5) * 0.2;
          rightHand.group.position.y = Math.sin(elapsed * 1.5) * 0.2;

          leftHand.indexF.rotation.x = -0.15 + Math.sin(elapsed * 2.0) * 0.08;
          rightHand.indexF.rotation.x = -0.15 + Math.sin(elapsed * 2.0) * 0.08;
          leftHand.pinkyF.rotation.x = -0.25 + Math.cos(elapsed * 2.0) * 0.08;
          rightHand.pinkyF.rotation.x = -0.25 + Math.cos(elapsed * 2.0) * 0.08;
        } else {
          // Phase 6 & 7 (3.5s+): Settle hands into background framing position
          const t = Math.min((elapsed - 3.5) / 1.2, 1.0);
          const ease = Math.sin((t * Math.PI) / 2);

          // Hands softly glide apart to frame the hero content
          leftHand.group.position.x = -4.5 - ease * 1.8;
          rightHand.group.position.x = 4.5 + ease * 1.8;
          handsMasterGroup.position.z = -2 * ease;

          // Breathing ambient hover
          const hover = Math.sin(elapsed * 1.2) * 0.25;
          leftHand.group.position.y = hover;
          rightHand.group.position.y = hover;
        }
      } else {
        // --- SETTLED STATE (Landing page main interactive hero mode) ---
        yellowCenterLight.intensity = 4.2 + Math.sin(elapsed * 1.5) * 0.5;

        // Hands frame the hero text on left and right with responsive spacing
        const screenWidth = width;
        const xOffset = screenWidth < 768 ? 3.2 : screenWidth < 1024 ? 4.6 : 5.8;

        const breathe = Math.sin(elapsed * 1.2) * 0.2;
        leftHand.group.position.x = -xOffset;
        rightHand.group.position.x = xOffset;
        leftHand.group.position.y = breathe;
        rightHand.group.position.y = breathe;

        // Subtle interactive mouse tilt
        if (!prefersReducedMotion) {
          leftHand.group.rotation.y = 0.28 + mouseFactorX * 0.08;
          rightHand.group.rotation.y = -0.28 + mouseFactorX * 0.08;
          leftHand.group.rotation.x = -0.12 - mouseFactorY * 0.08;
          rightHand.group.rotation.x = -0.12 - mouseFactorY * 0.08;
        }

        // Gentle finger articulation (open, friendly, alive)
        leftHand.indexF.rotation.x = -0.15 + Math.sin(elapsed * 1.6) * 0.05;
        rightHand.indexF.rotation.x = -0.15 + Math.sin(elapsed * 1.6) * 0.05;
        leftHand.middleF.rotation.x = -0.1 + Math.sin(elapsed * 1.6 + 0.3) * 0.05;
        rightHand.middleF.rotation.x = -0.1 + Math.sin(elapsed * 1.6 + 0.3) * 0.05;
        leftHand.thumb.rotation.y = -0.3 + Math.cos(elapsed * 1.4) * 0.06;
        rightHand.thumb.rotation.y = 0.3 - Math.cos(elapsed * 1.4) * 0.06;
      }

      // Rotate particle cloud & rings smoothly
      if (particles) {
        particles.rotation.y = elapsed * 0.03;
        particles.rotation.x = elapsed * 0.015;
      }
      ring1.rotation.z = elapsed * 0.08;
      ring2.rotation.x = elapsed * 0.06;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 9. Cleanup & Memory Disposal
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose Geometries and Materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      particleGeo.dispose();
      particleMat.dispose();

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isIntro, settled]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
