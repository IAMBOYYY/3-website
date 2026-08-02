import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BrainModelProps {
  scrollProgress: number;
}

const BrainModel = ({ scrollProgress }: BrainModelProps) => {
  const brainRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/brain.glb');
  const materialsRef = useRef<Map<string, THREE.Material>>(new Map());
  const lobesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mat = Array.isArray(child.material) ? child.material[0] : child.material;
          materialsRef.current.set(child.name || child.uuid, mat.clone());
          child.material = mat;
        }
        if (child.name && child.name.toLowerCase().includes('lobe')) {
          lobesRef.current.push(child);
        }
      }
    });
  }, [scene]);

  useFrame(() => {
    if (brainRef.current) {
      brainRef.current.rotation.y = scrollProgress * Math.PI * 2;
      
      const bounce = Math.sin(scrollProgress * Math.PI * 4) * 0.1;
      brainRef.current.position.y = bounce;
      
      brainRef.current.scale.setScalar(1 + Math.sin(scrollProgress * Math.PI * 2) * 0.05);
    }
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      lobesRef.current.forEach((lobe, i) => {
        const delay = i * 0.1;
        gsap.to(lobe.scale, {
          x: 1 + scrollProgress * 0.3,
          y: 1 + scrollProgress * 0.3,
          z: 1 + scrollProgress * 0.3,
          duration: 1,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.scroll-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
          },
        });
      });
    });
    return () => ctx.revert();
  }, [scrollProgress]);

  return (
    <group ref={brainRef} scale={0.5} position={[0, -1, 0]}>
      <primitive object={scene} dispose={null} />
    </group>
  );
};

const CameraRig = ({ scrollProgress }: { scrollProgress: number }) => {
  const cameraRef = useRef<THREE.Camera>(null);

  useFrame(({ camera }) => {
    if (cameraRef.current) {
      const radius = 8;
      const height = 3 - scrollProgress * 4;
      const angle = scrollProgress * Math.PI * 0.5;
      
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = height;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
};

const Labels = ({ scrollProgress }: { scrollProgress: number }) => {
  const labels = [
    { name: 'Frontal Lobe', position: [0, 1.5, 2], info: 'Decision making, planning, personality' },
    { name: 'Parietal Lobe', position: [0, 1.5, -1], info: 'Sensory processing, spatial awareness' },
    { name: 'Temporal Lobe', position: [-2, 0.5, 0], info: 'Memory, hearing, language' },
    { name: 'Occipital Lobe', position: [2, 0.5, 0], info: 'Visual processing' },
    { name: 'Cerebellum', position: [0, -1.5, 0], info: 'Balance, coordination, motor control' },
    { name: 'Brainstem', position: [0, -2.5, 0], info: 'Breathing, heart rate, consciousness' },
  ];

  return (
    <>
      {labels.map((label, i) => (
        <Html
          key={label.name}
          position={label.position as [number, number, number]}
          style={{
            opacity: 0.8 + 0.2 * Math.sin(scrollProgress * Math.PI * 2 + i),
            transform: `translate(-50%, -50%) scale(${0.8 + scrollProgress * 0.4})`,
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
          }}
          wrapperClass="brain-label"
        >
          <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-white/20">
            <div className="font-bold text-accent-400">{label.name}</div>
            <div className="text-xs text-gray-300 mt-1">{label.info}</div>
          </div>
        </Html>
      ))}
    </>
  );
};

export const BrainScene = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <Canvas
      camera={{ position: [0, 3, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      className="canvas-container"
    >
      <Suspense fallback={<Loading />}>
        <Environment preset="city" background={false} />
        <CameraRig scrollProgress={scrollProgress} />
        <BrainModel scrollProgress={scrollProgress} />
        <Labels scrollProgress={scrollProgress} />
        <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={10} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
    </Canvas>
  );
};

const Loading = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading Brain Model...</p>
    </div>
  </div>
);