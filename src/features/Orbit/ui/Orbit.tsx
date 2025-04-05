import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useState } from "react";
import { Vector3 } from "three";
import { Arrow } from "./Arrow";
import { useAppSelector } from "@/shared/hooks/useAppSelector";

export const Orbit = ({
  selectedShelfId,
}: {
  selectedShelfId: string | null;
}) => {
  const [viewTarget, setViewTarget] = useState<Vector3>(new Vector3(0, 0, 0));
  const { height, width } = useAppSelector((state) => state.store);

  useFrame((_, delta) => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const step = 7.5;
      let newViewTarget = new Vector3(viewTarget.x, viewTarget.y, viewTarget.z);

      switch (event.key.toLowerCase()) {
        case "w":
          newViewTarget = newViewTarget.addScaledVector(
            new Vector3(0, 0, -step * delta),
            1
          );
          break;
        case "a":
          newViewTarget = newViewTarget.addScaledVector(
            new Vector3(-step * delta, 0, 0),
            1
          );
          break;
        case "s":
          newViewTarget = newViewTarget.addScaledVector(
            new Vector3(0, 0, step * delta),
            1
          );
          break;
        case "d":
          newViewTarget = newViewTarget.addScaledVector(
            new Vector3(step * delta, 0, 0),
            1
          );
          break;
      }

      if (newViewTarget.x > width / 2) {
        newViewTarget.x = width / 2;
      } else if (newViewTarget.x < -width / 2) {
        newViewTarget.x = -width / 2;
      }

      if (newViewTarget.y > height / 2) {
        newViewTarget.y = height / 2;
      } else if (newViewTarget.y < -height / 2) {
        newViewTarget.y = -height / 2;
      }

      setViewTarget(newViewTarget);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  return (
    <>
      <OrbitControls
        zoom0={1}
        zoomSpeed={0.5}
        maxZoom={2}
        minZoom={0.5}
        target={viewTarget}
        enableRotate={!selectedShelfId}
        enablePan={!selectedShelfId}
        enableZoom={!selectedShelfId}
      />
      <Arrow target={viewTarget} />
    </>
  );
};
