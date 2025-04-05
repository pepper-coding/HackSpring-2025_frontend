import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Group } from "three";
import * as THREE from "three";

interface ArrowProps {
  target: Vector3;
}

export const Arrow: React.FC<ArrowProps> = ({ target }) => {
  return (
    <group position={target}>
      <mesh position={[0, 0.75, 0]} rotation={new THREE.Euler(0, 0, Math.PI)}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh position={[0, 0.25, 0]} rotation={new THREE.Euler(0, 0, Math.PI)}>
        <coneGeometry args={[0.1, 0.5, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};
