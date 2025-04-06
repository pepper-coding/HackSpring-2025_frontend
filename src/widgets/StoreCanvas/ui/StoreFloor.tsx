"use client";

import { SQUARE_SIZE } from "@/entities/Shelves";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useMemo, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const size = SQUARE_SIZE;

export function StoreFloor() {
  const { width, length } = useAppSelector((state) => state.store);

  const heatmapData = useAppSelector(
    (state) => state.simulation.simulationState?.heatmap
  );

  useEffect(() => {
    console.log("Heatmap data in StoreFloor:", heatmapData);
  }, [heatmapData]);

  const parquetTexture = useLoader(
    THREE.TextureLoader,
    "/textures/parquet.jpg"
  );

  useEffect(() => {
    if (parquetTexture) {
      parquetTexture.wrapS = parquetTexture.wrapT = THREE.RepeatWrapping;

      parquetTexture.repeat.set(1, 1);

      parquetTexture.anisotropy = 16;
      parquetTexture.needsUpdate = true;
    }
  }, [parquetTexture]);

  const heatmapTexture = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) {
      console.log("No heatmap data available for texture creation");
      return null;
    }

    try {
      console.log(
        "Creating heatmap texture with dimensions:",
        heatmapData.length,
        "x",
        heatmapData[0].length
      );

      const rows = heatmapData.length;
      const cols = heatmapData[0].length;

      const canvas = document.createElement("canvas");
      const scale = 4;
      canvas.width = cols * scale;
      canvas.height = rows * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to get canvas context");
        return null;
      }

      let maxValue = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          maxValue = Math.max(maxValue, heatmapData[r][c]);
        }
      }

      console.log("Max value in heatmap:", maxValue);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const value = heatmapData[r][c];
          if (value > 0) {
            const intensity = value / maxValue;

            const red = Math.floor(255 * intensity);
            const green = Math.floor(100 * (1 - intensity));
            const blue = Math.floor(255 * (1 - intensity));

            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.9)`;

            const rectSize = scale * 0.9;
            const x = c * scale + (scale - rectSize) / 2;
            const y = r * scale + (scale - rectSize) / 2;
            ctx.beginPath();
            ctx.roundRect(x, y, rectSize, rectSize, rectSize * 0.2);
            ctx.fill();

            if (value > maxValue * 0.5) {
              ctx.fillStyle = 'white';
              ctx.font = `bold ${scale*0.8}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(
                value.toString(),
                c * scale + scale / 2,
                r * scale + scale / 2
              );
            }
          }
        }
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;

      console.log("Heatmap texture created successfully");
      return texture;
    } catch (error) {
      console.error("Error creating heatmap texture:", error);
      return null;
    }
  }, [heatmapData]);

  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: parquetTexture,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.2,
    });
  }, [parquetTexture]);

  const heatmapMaterial = useMemo(() => {
    if (!heatmapTexture) {
      console.log("No heatmap texture available for material creation");
      return null;
    }

    console.log("Creating heatmap material");
    return new THREE.MeshBasicMaterial({
      map: heatmapTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false,
      alphaTest: 0.1,
    });
  }, [heatmapTexture]);

  const floorGeometry = useMemo(() => {
    const totalWidth = width * size;
    const totalLength = length * size;

    const geometry = new THREE.PlaneGeometry(
      totalWidth,
      totalLength,
      width,
      length
    );

    const uvs = geometry.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      const u = uvs.getX(i) * width;
      const v = uvs.getY(i) * length;
      uvs.setXY(i, u, v);
    }

    return geometry;
  }, [width, length]);

  useEffect(() => {
    console.log("Render cycle - heatmapMaterial available:", !!heatmapMaterial);
  }, [heatmapMaterial]);

  useEffect(() => {
    if (!heatmapData || heatmapData.length === 0) {
      console.log("No real heatmap data, waiting for simulation data...");
    } else {
      console.log("Heatmap data available, size:", heatmapData.length, "x", heatmapData[0]?.length);
    }
  }, [heatmapData]);

  return (
    <>
      {/* Base floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <primitive object={floorGeometry} attach="geometry" />
        <primitive object={floorMaterial} attach="material" />
      </mesh>

      {/* Heatmap overlay - positioned higher above floor for better visibility */}
      {heatmapMaterial && (
        <mesh
          position={[0, 0.15, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow={false}
        >
          <primitive object={floorGeometry} attach="geometry" />
          <primitive object={heatmapMaterial} attach="material" />
        </mesh>
      )}
    </>
  );
}
