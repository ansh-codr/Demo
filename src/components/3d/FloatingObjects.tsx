import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Sphere, Box, Torus } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

const FloatingObject = ({ position, color, shape = 'sphere' }: { 
  position: [number, number, number]; 
  color: string; 
  shape?: 'sphere' | 'box' | 'torus';
}) => {
  const meshRef = useRef<Mesh>(null);

  const renderShape = () => {
    switch (shape) {
      case 'box':
        return <Box ref={meshRef} scale={0.8} />;
      case 'torus':
        return <Torus ref={meshRef} scale={0.6} args={[1, 0.3, 8, 16]} />;
      default:
        return <Sphere ref={meshRef} scale={0.8} />;
    }
  };

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      position={position}
    >
      <mesh>
        {renderShape()}
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.7}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

export const FloatingObjects = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />
        
        {/* Floating objects with theme colors */}
        <FloatingObject position={[-2, 1, 0]} color="hsl(262, 83%, 58%)" shape="sphere" />
        <FloatingObject position={[2, -1, -1]} color="hsl(242, 76%, 62%)" shape="box" />
        <FloatingObject position={[0, 2, -2]} color="hsl(222, 87%, 67%)" shape="torus" />
        <FloatingObject position={[-1, -2, 1]} color="hsl(262, 100%, 70%)" shape="sphere" />
        <FloatingObject position={[3, 0, 0]} color="hsl(242, 76%, 62%)" shape="box" />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};