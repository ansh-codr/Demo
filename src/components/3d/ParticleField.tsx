
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { Points as ThreePoints } from 'three';
import * as random from 'maath/random';

const ParticleCloud = () => {
  const ref = useRef<ThreePoints>(null);
  
  const sphere = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    random.inSphere(positions, { radius: 8 });
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="hsl(262, 83%, 58%)"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

export const ParticleField = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'transparent' }}
      >
        <ParticleCloud />
      </Canvas>
    </div>
  );
};
