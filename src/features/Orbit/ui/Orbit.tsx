import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Arrow } from "./Arrow";
import { useAppSelector } from "@/shared/hooks/useAppSelector";

interface OrbitProps {
  selectedShelfId: string | null;
}

export const Orbit: React.FC<OrbitProps> = ({ selectedShelfId }) => {
  const viewTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [, forceUpdate] = useState<number>(0);
  const orbitRef = useRef(null);

  const { height, width } = useAppSelector((state) => state.store);

  const tempVector = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const storeBounds = useMemo(
    () => ({
      minX: -width / 2,
      maxX: width / 2,
      minZ: -height / 2,
      maxZ: height / 2,
    }),
    [width, height]
  );

  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (selectedShelfId) return;

    let hasChanged = false;
    const moveSpeed = 5 * delta;

    if (keysPressed.current["w"]) {
      tempVector.set(0, 0, -moveSpeed);
      viewTargetRef.current.add(tempVector);
      hasChanged = true;
    }
    if (keysPressed.current["a"]) {
      tempVector.set(-moveSpeed, 0, 0);
      viewTargetRef.current.add(tempVector);
      hasChanged = true;
    }
    if (keysPressed.current["s"]) {
      tempVector.set(0, 0, moveSpeed);
      viewTargetRef.current.add(tempVector);
      hasChanged = true;
    }
    if (keysPressed.current["d"]) {
      tempVector.set(moveSpeed, 0, 0);
      viewTargetRef.current.add(tempVector);
      hasChanged = true;
    }

    if (hasChanged) {
      console.log(orbitRef.current);
      // @ts-ignore
      orbitRef.current!.target.x = viewTargetRef.current.x;

      // @ts-ignore
      orbitRef.current!.target.z = viewTargetRef.current.z;

      forceUpdate((prev) => prev + 1);
    }
  });

  const controlsConfig = useMemo(
    () => ({
      enableRotate: !selectedShelfId,
      enablePan: !selectedShelfId,
      enableZoom: !selectedShelfId,
    }),
    [selectedShelfId]
  );

  return (
    <>
      <OrbitControls
        ref={orbitRef}
        zoom0={1}
        zoomSpeed={0.5}
        maxZoom={2}
        minZoom={0.5}
        enableDamping={true}
        dampingFactor={0.1}
        {...controlsConfig}
      />
      {/* @ts-ignore */}
      <Arrow target={orbitRef.current?.target || new THREE.Vector3(0, 0, 0)} />
    </>
  );
};
