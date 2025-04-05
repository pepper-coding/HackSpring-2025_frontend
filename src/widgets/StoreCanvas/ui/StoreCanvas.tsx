"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { StoreFloor } from "./StoreFloor";
import { ShelfList } from "@/entities/Shelves";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useShelvesActions } from "@/entities/Shelves";
import { CustomerList } from "@/entities/Customers";
import { Orbit } from "@/features/Orbit";

interface StoreCanvasProps {
  showAnalytics: boolean;
}

export function StoreCanvas({ showAnalytics }: StoreCanvasProps) {
  const [canvasSize, setCanvasSize] = useState({
    width: "100%",
    height: "100%",
  });
  const { selectShelf } = useShelvesActions();
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedShelfId = useAppSelector(
    (state) => state.shelves.selectedShelfId
  );

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (showAnalytics) {
          const newWidth = containerWidth * 0.6;
          setCanvasSize({
            width: `${newWidth}px`,
            height: "100%",
          });
        } else {
          setCanvasSize({
            width: "1300px",
            height: "800px",
          });
        }
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [showAnalytics]);

  const handleBackgroundClick = () => {
    if (selectedShelfId) {
      selectShelf(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative transition-all duration-300 ease-in-out"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        linear
        flat
        shadows
        dpr={[0.5, 1]}
        camera={{ position: [10, 10, 10], fov: 50 }}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
        onClick={handleBackgroundClick}
      >
        <color attach="background" args={["#f0f0f0"]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <StoreFloor />
        <ShelfList />
        <CustomerList />
        <Orbit selectedShelfId={selectedShelfId} />
        <Stats />
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
}
