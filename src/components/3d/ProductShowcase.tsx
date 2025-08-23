import { Canvas } from '@react-three/fiber';
import { Float, RoundedBox, Text, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';

const ProductModel = () => {
  const meshRef = useRef<Mesh>(null);

  return (
    <group>
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={1}
      >
        {/* Main product box */}
        <RoundedBox
          ref={meshRef}
          args={[2, 1.2, 0.8]}
          radius={0.1}
          smoothness={4}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial 
            color="hsl(262, 83%, 58%)" 
            transparent
            opacity={0.9}
            roughness={0.2}
            metalness={0.8}
          />
        </RoundedBox>
        
        {/* Screen effect */}
        <RoundedBox
          args={[1.6, 0.9, 0.01]}
          radius={0.05}
          smoothness={4}
          position={[0, 0, 0.41]}
        >
          <meshStandardMaterial 
            color="hsl(222, 87%, 67%)" 
            transparent
            opacity={0.8}
            emissive="hsl(222, 87%, 67%)"
            emissiveIntensity={0.2}
          />
        </RoundedBox>

        {/* Floating text */}
        <Text
          position={[0, -2, 0]}
          fontSize={0.5}
          color="hsl(262, 83%, 58%)"
          anchorX="center"
          anchorY="middle"
        >
          EcomScribe Pro
        </Text>
      </Float>
    </group>
  );
};

export const ProductShowcase = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [4, 2, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} />
        
        <ProductModel />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};