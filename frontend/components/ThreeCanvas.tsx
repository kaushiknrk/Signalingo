"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00A896, 2.5);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xFFB703, 3, 50);
    pointLight.position.set(-10, -10, 5);
    scene.add(pointLight);

    // 3. Floating 3D Geometries (Turquoise & Yellow Theme)
    const shapes: THREE.Mesh[] = [];

    // Main Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3.5, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x00A896,
      roughness: 0.3,
      metalness: 0.4,
      wireframe: false,
    });
    const mainIco = new THREE.Mesh(icoGeo, icoMat);
    mainIco.position.set(0, 0, 0);
    scene.add(mainIco);
    shapes.push(mainIco);

    // Floating Torus Rings
    const ringGeo = new THREE.TorusGeometry(5, 0.2, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xFFB703,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0, 0);
    scene.add(ring);
    shapes.push(ring);

    // Small Floating Spheres & Octahedrons
    const turquoiseMat = new THREE.MeshStandardMaterial({ color: 0x02C39A });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xFFB703 });

    for (let i = 0; i < 15; i++) {
      const isSphere = i % 2 === 0;
      const geo = isSphere ? new THREE.SphereGeometry(0.4, 16, 16) : new THREE.OctahedronGeometry(0.6, 0);
      const mesh = new THREE.Mesh(geo, isSphere ? turquoiseMat : yellowMat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12
      );
      scene.add(mesh);
      shapes.push(mesh);
    }

    // 4. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate Main Icosahedron & Ring
      mainIco.rotation.x = elapsedTime * 0.3;
      mainIco.rotation.y = elapsedTime * 0.4;
      ring.rotation.x = elapsedTime * 0.2;
      ring.rotation.z = elapsedTime * 0.3;

      // Animate floating particles
      shapes.slice(2).forEach((mesh, index) => {
        mesh.position.y += Math.sin(elapsedTime * 1.5 + index) * 0.015;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.015;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 5. Responsive Resize
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
  }, []);

  return <div ref={mountRef} className="w-full h-full absolute inset-0 pointer-events-none opacity-60" />;
}
