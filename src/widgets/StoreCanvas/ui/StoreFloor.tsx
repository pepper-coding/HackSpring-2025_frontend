"use client";

import { SQUARE_SIZE } from "@/entities/Shelves";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";

const size = SQUARE_SIZE;

export function StoreFloor() {
  const { width, length } = useAppSelector((state) => state.store);
  const parquetTexture = useLoader(TextureLoader, "/textures/parquet.jpg");

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
          receiveShadow
        >
          <planeGeometry args={[size, size]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={parquetTexture} />
        </mesh>
      ))}
    </group>
  );
}
