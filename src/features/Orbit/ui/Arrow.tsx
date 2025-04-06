import React, { useRef, useMemo } from "react";
import { Vector3 } from "three";
import * as THREE from "three";

interface ArrowProps {
  target: Vector3;
}

export const Arrow: React.FC<ArrowProps> = ({ target }) => {
  const groupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    return {
      cylinder: new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16),
      cone: new THREE.ConeGeometry(0.1, 0.5, 16),
    };
  }, []);

  const materials = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({ color: "red" });
    return material;
  }, []);

  const rotation = useMemo(() => {
    return new THREE.Euler(0, 0, Math.PI);
  }, []);

  return (
    <group ref={groupRef} position={[target.x, target.y, target.z]}>
      <mesh position={[0, 0.75, 0]} rotation={rotation}>
        <primitive object={geometries.cylinder} attach="geometry" />
        <primitive object={materials} attach="material" />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={rotation}>
        <primitive object={geometries.cone} attach="geometry" />
        <primitive object={materials} attach="material" />
      </mesh>
    </group>
  );
};
