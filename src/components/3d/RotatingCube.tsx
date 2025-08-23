import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Mesh } from 'three';
import { Box } from '@react-three/drei';

interface CubeProps {
  productData: {
    name: string;
    image?: string;
    category: string;
  };
}

const ProductCube = ({ productData }: CubeProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.scale.setScalar(hovered ? 1.1 : 1);
    }
  });

  return (
    <group>
      <Box
        ref={meshRef}
        args={[2, 2, 2]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#60a5fa" : "#3b82f6"}
          transparent
          opacity={0.8}
          wireframe={false}
        />
      </Box>
    </group>
  );
};

export const RotatingCube = ({ className, products }: { 
  className?: string; 
  products: CubeProps['productData'][];
}) => {
  const [currentProduct, setCurrentProduct] = useState(0);

  // Cycle through products every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <spotLight position={[0, 5, 5]} intensity={2} color="#ec4899" />
        
        <ProductCube productData={products[currentProduct]} />
      </Canvas>
    </div>
  );
};