"use client";

import { SQUARE_SIZE } from "@/entities/Shelves";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useMemo } from "react";

const size = SQUARE_SIZE;

export function StoreFloor() {
  const { width, length } = useAppSelector((state) => state.store);
  const squares = useMemo(() => {
    const squares = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        squares.push([
          size * i - (width * size) / 2,
          size * j - (length * size) / 2,
        ]);
      }
    }
    return squares;
  }, [width, length]);

  return (
    <group>
      {squares.map((square) => (
        <mesh
          key={square.join("-")}
          position={[square[0], 0, square[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial
            color={
              (square[0] / size + square[1] / size) % 2 === 0
                ? "#e7e0d8"
                : "#e6dfca "
            }
          />
        </mesh>
      ))}
    </group>
  );
}
