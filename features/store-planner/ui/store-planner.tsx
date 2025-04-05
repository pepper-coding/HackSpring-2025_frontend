"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { StoreControls } from "./store-controls";
import { StoreFloor } from "./store-floor";
import { ShelfList } from "./shelf-list";
import { CustomerList } from "./customer-list";
import { AnalyticsPanel } from "@/features/analytics/ui/analytics-panel";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { useShelvesActions } from "@/entities/shelves";
import { Arrow } from "./arrow";
import { Orbit } from "./orbit";

export function StorePlanner() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: "100%",
    height: "100%",
  });
  const { selectShelf } = useShelvesActions();
  const storeSize = useAppSelector((state) => state.store);
  const shelves = useAppSelector((state) => state.shelves.items);
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

  const handleSavePreset = () => {
    const presetData = {
      storeSize,
      shelves: shelves.map((shelf) => ({
        id: shelf.id,
        type: shelf.type,
        position: shelf.position,
        rotation: shelf.rotation,
        size: shelf.size,
        interactions: shelf.interactions,
      })),
      createdAt: new Date().toISOString(),
    };

    console.log("Preset data:", presetData);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none bg-background p-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">3D Store Planner</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSavePreset}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Сохранить пресет
            </button>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        <div className="w-80 flex-none bg-muted p-4 overflow-y-auto">
          <StoreControls />
        </div>

        <div
          className="relative transition-all duration-300 ease-in-out"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Canvas
            shadows
            dpr={[0.5, 0.8]}
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
            <gridHelper
              args={[storeSize.width, storeSize.width / 2]}
              position={[0, 0.01, 0]}
            />
            <axesHelper args={[5]} />
          </Canvas>
        </div>

        {showAnalytics && (
          <div className="w-96 flex-none bg-muted p-4 overflow-y-auto">
            <AnalyticsPanel />
          </div>
        )}
      </div>
    </div>
  );
}
