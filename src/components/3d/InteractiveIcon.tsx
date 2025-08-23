import { Canvas } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import { useState } from 'react';

interface InteractiveIconProps {
  icon: string;
  size?: number;
  className?: string;
}

const Icon3D = ({ icon, hovered }: { icon: string; hovered: boolean }) => {
  return (
    <Float
      speed={hovered ? 4 : 2}
      rotationIntensity={hovered ? 2 : 1}
      floatIntensity={hovered ? 3 : 1}
    >
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          {icon}
          <meshStandardMaterial 
            color="hsl(262, 83%, 58%)" 
            transparent
            opacity={hovered ? 1 : 0.8}
            roughness={0.1}
            metalness={0.6}
          />
        </Text3D>
      </Center>
    </Float>
  );
};

export const InteractiveIcon = ({ icon, size = 60, className }: InteractiveIconProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className={className}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Icon3D icon={icon} hovered={hovered} />
      </Canvas>
    </div>
  );
};