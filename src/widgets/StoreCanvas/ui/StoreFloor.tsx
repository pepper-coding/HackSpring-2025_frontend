"use client";

import { useAppSelector } from "@/shared/hooks/useAppSelector";

export function StoreFloor() {
  const { width, length } = useAppSelector((state) => state.store);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  );
}
