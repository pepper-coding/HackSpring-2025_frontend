"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { Customer as CustomerType } from "../model/types/Customer";

interface CustomerProps {
  customer: CustomerType;
}

export function Customer({ customer }: CustomerProps) {
  const { position, targetPosition } = customer;
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const walkCycle = useRef(0);
  const isWalking = useRef(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    isWalking.current = !(
      Math.abs(position.x - targetPosition.x) < 0.1 &&
      Math.abs(position.z - targetPosition.z) < 0.1
    );

    // Анимация ходьбы
    if (isWalking.current) {
      walkCycle.current += delta * 5;
      const legAngle = Math.sin(walkCycle.current) * 0.5;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
    } else {
      if (leftLegRef.current)
        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(
          leftLegRef.current.rotation.x,
          0,
          delta * 5
        );
      if (rightLegRef.current)
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(
          rightLegRef.current.rotation.x,
          0,
          delta * 5
        );
    }
  });

  return (
    <group ref={groupRef} position={[position.x, position.y + 0.9, position.z]}>
      {/* Тело */}
      <Box args={[0.4, 0.8, 0.3]} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#ff9e80" />
      </Box>

      {/* Голова (сфера) */}
      <Box args={[0.3, 0.3, 0.3]} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#ffcc80" />
      </Box>

      {/* Левая рука */}
      <group position={[-0.25, 0.2, 0]}>
        <Cylinder
          args={[0.05, 0.05, 0.5, 8]}
          rotation={[0, 0, 0]}
          position={[0, -0.25, 0]}
          castShadow
        >
          <meshStandardMaterial color="#ff9e80" />
        </Cylinder>
      </group>

      {/* Правая рука */}
      <group position={[0.25, 0.2, 0]}>
        <Cylinder
          args={[0.05, 0.05, 0.5, 8]}
          rotation={[0, 0, 0]}
          position={[0, -0.25, 0]}
          castShadow
        >
          <meshStandardMaterial color="#ff9e80" />
        </Cylinder>
      </group>

      {/* Левая нога */}
      <group ref={leftLegRef} position={[-0.1, -0.4, 0]}>
        <Cylinder
          args={[0.07, 0.07, 0.6, 8]}
          position={[0, -0.3, 0]}
          castShadow
        >
          <meshStandardMaterial color="#6d4c41" />
        </Cylinder>
      </group>

      {/* Правая нога */}
      <group ref={rightLegRef} position={[0.1, -0.4, 0]}>
        <Cylinder
          args={[0.07, 0.07, 0.6, 8]}
          position={[0, -0.3, 0]}
          castShadow
        >
          <meshStandardMaterial color="#6d4c41" />
        </Cylinder>
      </group>
    </group>
  );
}
