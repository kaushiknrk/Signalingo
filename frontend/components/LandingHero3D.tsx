"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface LandingHero3DProps {
  stage?: "hand" | "title" | "landing";
  isIntro?: boolean;
  mousePosition?: { x: number; y: number };
}

export default function LandingHero3D({ stage = "landing", isIntro = false, mousePosition }: LandingHero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const handGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00A896, 3); // Turquoise Light
    dirLight1.position.set(10, 12, 10);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0xFFB703, 3.5, 40); // Yellow/Gold Light
    pointLight.position.set(-8, -6, 8);
    scene.add(pointLight);

    // 3. Build Stylized 3D ASL Hand Model
    const handGroup = new THREE.Group();
    handGroupRef.current = handGroup;

    // Materials
    const turquoiseGlowMat = new THREE.MeshStandardMaterial({
      color: 0x00A896,
      roughness: 0.25,
      metalness: 0.6,
      emissive: 0x004D40,
      emissiveIntensity: 0.4,
    });

    const yellowAccentMat = new THREE.MeshStandardMaterial({
      color: 0xFFB703,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x7A5200,
      emissiveIntensity: 0.5,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x02C39A,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // Palm / Hand Base
    const palmGeo = new THREE.BoxGeometry(3.6, 4.2, 1.2);
    const palmMesh = new THREE.Mesh(palmGeo, turquoiseGlowMat);
    palmMesh.position.set(0, 0, 0);
    handGroup.add(palmMesh);

    const palmWire = new THREE.Mesh(palmGeo, wireMat);
    palmMesh.add(palmWire);

    // Wrist Base
    const wristGeo = new THREE.CylinderGeometry(1.5, 1.7, 2.2, 16);
    const wristMesh = new THREE.Mesh(wristGeo, turquoiseGlowMat);
    wristMesh.position.set(0, -3, 0);
    handGroup.add(wristMesh);

    // Helper to create articulated finger with knuckles
    const createFinger = (
      offsetX: number,
      length: number,
      width: number,
      isThumb = false,
      initialRotation = 0
    ) => {
      const fingerGroup = new THREE.Group();
      fingerGroup.position.set(offsetX, 2.1, 0);

      // Knuckle sphere
      const knuckleGeo = new THREE.SphereGeometry(width * 0.7, 16, 16);
      const knuckle = new THREE.Mesh(knuckleGeo, yellowAccentMat);
      fingerGroup.add(knuckle);

      // Phalanx Segment 1
      const p1Geo = new THREE.CylinderGeometry(width * 0.55, width * 0.65, length * 0.55, 12);
      const p1 = new THREE.Mesh(p1Geo, turquoiseGlowMat);
      p1.position.set(0, length * 0.28, 0);
      fingerGroup.add(p1);

      // Middle Knuckle
      const midKnuckle = new THREE.Mesh(knuckleGeo, yellowAccentMat);
      midKnuckle.position.set(0, length * 0.55, 0);
      midKnuckle.scale.set(0.85, 0.85, 0.85);
      fingerGroup.add(midKnuckle);

      // Tip Segment
      const p2Geo = new THREE.CylinderGeometry(width * 0.45, width * 0.55, length * 0.45, 12);
      const p2 = new THREE.Mesh(p2Geo, turquoiseGlowMat);
      p2.position.set(0, length * 0.8, 0);
      fingerGroup.add(p2);

      // Fingertip Glowing Sphere
      const tipGeo = new THREE.SphereGeometry(width * 0.5, 16, 16);
      const tip = new THREE.Mesh(tipGeo, yellowAccentMat);
      tip.position.set(0, length * 1.05, 0);
      fingerGroup.add(tip);

      if (isThumb) {
        fingerGroup.position.set(-2.0, -0.4, 0.2);
        fingerGroup.rotation.z = Math.PI / 4;
        fingerGroup.rotation.x = 0.2;
      } else {
        fingerGroup.rotation.z = initialRotation;
      }

      return fingerGroup;
    };

    // Add 5 fingers (Thumb, Index, Middle, Ring, Pinky - forming ASL "I Love You" / "Peace" dynamic hand posture)
    const thumb = createFinger(-2.0, 2.4, 0.75, true);
    const indexFinger = createFinger(-1.2, 3.4, 0.65, false, -0.05); // Extended
    const middleFinger = createFinger(-0.4, 3.8, 0.68, false, 0.0);  // Extended / slightly curled
    const ringFinger = createFinger(0.4, 3.5, 0.65, false, 0.05);    // Curled in ASL shape
    const pinkyFinger = createFinger(1.2, 2.8, 0.55, false, 0.1);    // Extended in "I Love You" sign

    handGroup.add(thumb);
    handGroup.add(indexFinger);
    handGroup.add(middleFinger);
    handGroup.add(ringFinger);
    handGroup.add(pinkyFinger);

    // Initial position & scale
    handGroup.position.set(0, 0, 0);
    handGroup.rotation.x = 0.15;
    handGroup.rotation.y = -0.2;
    scene.add(handGroup);

    // 4. Background Orbiting Particle Constellation
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    const cTurquoise = new THREE.Color(0x00A896);
    const cYellow = new THREE.Color(0xFFB703);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 35;
      posArray[i + 1] = (Math.random() - 0.5) * 25;
      posArray[i + 2] = (Math.random() - 0.5) * 20;

      const chosenColor = Math.random() > 0.4 ? cTurquoise : cYellow;
      colorArray[i] = chosenColor.r;
      colorArray[i + 1] = chosenColor.g;
      colorArray[i + 2] = chosenColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // 5. Floating Geometric Energy Rings
    const ringGeo1 = new THREE.TorusGeometry(6.5, 0.08, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00A896, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(8.5, 0.06, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xFFB703, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    scene.add(ring2);

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Hand Animation: Intro Gesture Sequence vs Standard Hover
      if (handGroup) {
        if (isIntro) {
          if (elapsed < 1.5) {
            // Phase 1a (0 to 1.5s): Hand enters center and performs sign-inspired greeting motion
            const t = Math.min(elapsed / 1.1, 1.0);
            const easeOut = Math.sin((t * Math.PI) / 2);
            handGroup.position.z = -12 + 12 * easeOut;
            handGroup.position.y = -2 + 2 * easeOut;
            // Sign-inspired wave gesture
            handGroup.rotation.z = Math.sin(elapsed * 4.5) * 0.15;
            handGroup.rotation.y = -0.2 + Math.sin(elapsed * 2.5) * 0.2;
            indexFinger.rotation.x = Math.sin(elapsed * 3.5) * 0.22;
            middleFinger.rotation.x = Math.sin(elapsed * 3.5 + 0.3) * 0.22;
            pinkyFinger.rotation.x = Math.sin(elapsed * 3.5 + 0.6) * 0.18;
          } else if (elapsed <= 2.2) {
            // Phase 1b (1.5 to 2.2s): Brief hold of the sign posture
            handGroup.position.z = 0;
            handGroup.position.y = 0;
            handGroup.rotation.z = 0;
            handGroup.rotation.y = -0.15;
            indexFinger.rotation.x = 0;
            middleFinger.rotation.x = 0;
            pinkyFinger.rotation.x = 0;
          } else {
            // Standard subtle motion
            handGroup.position.y = Math.sin(elapsed * 1.6) * 0.3;
            handGroup.rotation.y = -0.15 + Math.sin(elapsed * 0.8) * 0.15;
          }
        } else {
          // Standard ambient hover in hero canvas
          handGroup.position.y = Math.sin(elapsed * 1.6) * 0.4;
          handGroup.rotation.y = -0.2 + Math.sin(elapsed * 0.8) * 0.25;
          handGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.08;

          // Subtle finger flexing/signing motion
          indexFinger.rotation.x = Math.sin(elapsed * 2.0) * 0.15;
          pinkyFinger.rotation.x = Math.cos(elapsed * 2.0) * 0.15;
          thumb.rotation.y = Math.sin(elapsed * 1.5) * 0.2;
        }
      }

      // Rotate particle field & rings
      if (particles) {
        particles.rotation.y = elapsed * 0.05;
        particles.rotation.x = elapsed * 0.02;
      }
      ring1.rotation.z = elapsed * 0.15;
      ring2.rotation.x = elapsed * 0.1;

      // Mouse Parallax Influence
      if (mousePosition && cameraRef.current) {
        const targetX = (mousePosition.x - 0.5) * 4;
        const targetY = -(mousePosition.y - 0.5) * 3;
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Responsive Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mousePosition]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full absolute inset-0 pointer-events-none z-0"
    />
  );
}
