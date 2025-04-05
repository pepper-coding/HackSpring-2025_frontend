"use client";

import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { group } from "console";
import { useMemo } from "react";

const size = 1;

export function StoreFloor() {
  const { width, length } = useAppSelector((state) => state.store);
  const squares = useMemo(() => {
    const squares = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        squares.push([size * i - width / 2, size * j - length / 2]);
      }
    }
    return squares;
  }, [width, length]);

  return (
    <group>
      {squares.map((square) => (
        <mesh
          position={[square[0], 0, square[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial
            color={(square[0] + square[1]) % 2 === 0 ? "#f0f0f0" : "#000"}
          />
        </mesh>
      ))}
    </group>
  );
}
