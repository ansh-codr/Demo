import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import { Float, Sphere, Box, Torus } from '@react-three/drei';

interface FloatingElementProps {
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
  shape: 'sphere' | 'box' | 'torus';
}

const FloatingElement = ({ position, color, size, speed, shape }: FloatingElementProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
      meshRef.current.rotation.x += speed * 0.5;
    }
  });

  const ShapeComponent = shape === 'sphere' ? Sphere : shape === 'box' ? Box : Torus;
  const args = shape === 'torus' ? [size, size * 0.3, 8, 16] : [size, size, size];

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      position={position}
    >
      <ShapeComponent ref={meshRef} args={args as any}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.7}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </ShapeComponent>
    </Float>
  );
};

export const FloatingElements = ({ className }: { className?: string }) => {
  const elements = useMemo(() => [
    {
      position: [-4, 2, -2] as [number, number, number],
      color: '#60a5fa',
      size: 0.5,
      speed: 0.01,
      shape: 'sphere' as const
    },
    {
      position: [3, -1, -1] as [number, number, number],
      color: '#a855f7',
      size: 0.3,
      speed: 0.015,
      shape: 'box' as const
    },
    {
      position: [-2, -3, 1] as [number, number, number],
      color: '#ec4899',
      size: 0.4,
      speed: 0.008,
      shape: 'torus' as const
    },
    {
      position: [4, 3, 0] as [number, number, number],
      color: '#06b6d4',
      size: 0.35,
      speed: 0.012,
      shape: 'sphere' as const
    },
    {
      position: [0, 4, -3] as [number, number, number],
      color: '#8b5cf6',
      size: 0.25,
      speed: 0.02,
      shape: 'box' as const
    }
  ], []);

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#60a5fa" />
        <pointLight position={[-5, -5, 5]} intensity={0.8} color="#a855f7" />
        
        {elements.map((element, index) => (
          <FloatingElement
            key={index}
            {...element}
          />
        ))}
      </Canvas>
    </div>
  );
};