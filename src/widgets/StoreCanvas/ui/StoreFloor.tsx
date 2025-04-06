"use client";

import { SQUARE_SIZE } from "@/entities/Shelves";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useMemo, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

const size = SQUARE_SIZE;

export function StoreFloor() {
  const { width, length } = useAppSelector((state) => state.store);

  // Загружаем текстуру и сразу настраиваем её
  const parquetTexture = useLoader(
    THREE.TextureLoader,
    "/textures/parquet.jpg"
  );

  useEffect(() => {
    if (parquetTexture) {
      // Настраиваем правильное повторение текстуры
      parquetTexture.wrapS = parquetTexture.wrapT = THREE.RepeatWrapping;

      // Настраиваем количество повторений в зависимости от размера каждой клетки
      parquetTexture.repeat.set(1, 1);

      // Улучшаем качество текстуры при взгляде под углом
      parquetTexture.anisotropy = 16;
      parquetTexture.needsUpdate = true;
    }
  }, [parquetTexture]);

  // Создаем один материал для всего пола
  const floorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: parquetTexture,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.2,
    });
  }, [parquetTexture]);

  // Простое решение - создаем один большой пол
  // Это устраняет проблему с перекрывающимися текстурами
  const floorGeometry = useMemo(() => {
    const totalWidth = width * size;
    const totalLength = length * size;

    // Создаем один большой меш с правильными UV-координатами
    const geometry = new THREE.PlaneGeometry(
      totalWidth,
      totalLength,
      width, // Разделяем на сегменты по ширине
      length // Разделяем на сегменты по длине
    );

    // Настраиваем UV-координаты для корректного мапинга текстуры
    const uvs = geometry.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      const u = uvs.getX(i) * width;
      const v = uvs.getY(i) * length;
      uvs.setXY(i, u, v);
    }

    return geometry;
  }, [width, length]);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={floorGeometry} attach="geometry" />
      <primitive object={floorMaterial} attach="material" />
    </mesh>
  );
}
