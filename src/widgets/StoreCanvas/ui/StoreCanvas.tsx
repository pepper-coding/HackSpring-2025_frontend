"use client";

import { useState, useRef, useEffect, useMemo, Suspense, JSX } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Stats,
  AdaptiveDpr,
  PerformanceMonitor,
  Preload,
  SoftShadows,
} from "@react-three/drei";
import { StoreFloor } from "./StoreFloor";
import { ShelfList, SQUARE_SIZE } from "@/entities/Shelves";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useShelvesActions } from "@/entities/Shelves";
import { CustomerList } from "@/entities/Customers";
import { Orbit } from "@/features/Orbit";
import { Simulation } from "@/features/Simulation";
import * as THREE from "three";

interface OptimizedSceneProps {
  showHelpers: boolean;
}

interface StoreCanvasProps {
  showAnalytics: boolean;
}

type PerformanceChangeEvent = {
  factor: number;
};

type QualityMode = "low" | "medium" | "high";

function OptimizedScene({ showHelpers }: OptimizedSceneProps): JSX.Element {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <StoreFloor />

      {showHelpers && (
        <>
          <gridHelper
            args={[100, 100, "#888888", "#444444"]}
            position={[0, 0.01, 0]}
          />
          <axesHelper args={[5]} />
        </>
      )}

      <SoftShadows size={10} samples={16} focus={0.5} />
    </>
  );
}

function LazyLoadedContent(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <ShelfList />
      <CustomerList />
      <Simulation />
    </Suspense>
  );
}

function RenderQualityControl({
  qualityMode,
}: {
  qualityMode: QualityMode;
}): JSX.Element {
  const dprValues: [number, number] = useMemo(() => {
    switch (qualityMode) {
      case "low":
        return [0.4, 0.6];
      case "medium":
        return [0.6, 0.8];
      case "high":
        return [0.8, 1.0];
      default:
        return [0.5, 1.0];
    }
  }, [qualityMode]);

  return <AdaptiveDpr pixelated />;
}

export function StoreCanvas({ showAnalytics }: StoreCanvasProps): JSX.Element {
  const [canvasSize, setCanvasSize] = useState<{
    width: string;
    height: string;
  }>({
    width: "100%",
    height: "850px",
  });

  const { selectShelf } = useShelvesActions();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHelpers, setShowHelpers] = useState<boolean>(true);
  const [qualityMode, setQualityMode] = useState<QualityMode>("medium");

  const lowPerformanceCount = useRef<number>(0);

  const selectedShelfId = useAppSelector(
    (state) => state.shelves.selectedShelfId
  );

  const cameraSettings = useMemo<THREE.PerspectiveCamera | Record<string, any>>(
    () => ({
      position: [10, 10, 10],
      fov: 50,
      near: 0.1,
      far: 1000,
    }),
    []
  );

  const glSettings = useMemo<THREE.WebGLRendererParameters>(() => {
    const settings: THREE.WebGLRendererParameters = {
      antialias: qualityMode !== "low",
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    };

    if (qualityMode === "low") {
      settings.precision = "lowp";
    } else if (qualityMode === "medium") {
      settings.precision = "mediump";
    } else {
      settings.precision = "highp";
    }

    return settings;
  }, [qualityMode]);

  useEffect(() => {
    const updateCanvasSize = (): void => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (showAnalytics) {
          const newWidth = containerWidth * 0.9;
          setCanvasSize({
            width: `${newWidth}px`,
            height: "850px",
          });
        } else {
          setCanvasSize({
            width: "1300px",
            height: "850px",
          });
        }
      }
    };

    updateCanvasSize();

    let timeoutId: NodeJS.Timeout;
    const handleResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateCanvasSize, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [showAnalytics]);

  const handleBackgroundClick = (): void => {
    if (selectedShelfId) {
      selectShelf(null);
    }
  };

  const handlePerformanceChange = ({
    factor,
  }: PerformanceChangeEvent): void => {
    if (factor < 0.7) {
      lowPerformanceCount.current += 1;

      if (lowPerformanceCount.current > 3) {
        if (qualityMode === "high") {
          setQualityMode("medium");
          lowPerformanceCount.current = 0;
        } else if (qualityMode === "medium") {
          setQualityMode("low");
          lowPerformanceCount.current = 0;
        }

        if (qualityMode === "low" && showHelpers) {
          setShowHelpers(false);
        }
      }
    } else if (factor > 0.9) {
      lowPerformanceCount.current = 0;

      if (qualityMode === "low" && !showHelpers) {
        setShowHelpers(true);
      } else if (qualityMode === "low") {
        setQualityMode("medium");
      } else if (qualityMode === "medium") {
        setQualityMode("high");
      }
    }
  };

  const toggleQualityMode = (): void => {
    if (qualityMode === "low") {
      setQualityMode("medium");
    } else if (qualityMode === "medium") {
      setQualityMode("high");
    } else {
      setQualityMode("low");
    }
  };

  return (
    <div ref={containerRef}>
      <button
        onClick={toggleQualityMode}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 100,
        }}
      >
        Quality: {qualityMode}
      </button>

      <Canvas
        shadows={qualityMode !== "low"}
        gl={glSettings}
        camera={cameraSettings}
        dpr={[0.5, 1.0]}
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          outline: "none",
        }}
        onClick={handleBackgroundClick}
        onCreated={({ gl }): void => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;

          if (qualityMode === "low") {
            gl.shadowMap.enabled = false;
          }
        }}
      >
        <color attach="background" args={["#fffbf1"]} />

        <PerformanceMonitor
          onDecline={handlePerformanceChange}
          onIncline={handlePerformanceChange}
        />
        <RenderQualityControl qualityMode={qualityMode} />

        <OptimizedScene showHelpers={showHelpers} />

        <LazyLoadedContent />

        <Orbit selectedShelfId={selectedShelfId} />

        {qualityMode !== "low" && <Preload all />}

        <Stats className="stats" />
      </Canvas>
    </div>
  );
}
