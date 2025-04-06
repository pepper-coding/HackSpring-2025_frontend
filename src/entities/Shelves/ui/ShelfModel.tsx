"use client";

import { forwardRef, useMemo } from "react";
import {
  useShelvesActions,
  type Shelf as ShelfModel,
} from "@/entities/Shelves/model/shelvesSlice";
import { Box, Text, Instance, Instances } from "@react-three/drei";
import type * as THREE from "three";
import {
  shelfColors,
  shelfSizes,
  productColorPalettes,
} from "../model/constants/shelf";
import { useAnalyticsActions } from "@/entities/Analytics/model/analyticsSlice";

interface ShelfProps {
  shelf: ShelfModel;
  isSelected: boolean;
  onClick: () => void;
}

export const Shelf = forwardRef<THREE.Group, ShelfProps>(
  ({ shelf, isSelected, onClick }, ref) => {
    const { incrementInteraction } = useShelvesActions();
    const { recordInteraction } = useAnalyticsActions();

    const { id, type, size } = shelf;
    const [width, height, depth] = shelfSizes[size];
    const color = shelfColors[type] || "#b8b8ff";

    const shelfData = useMemo(() => {
      const shelves = [0.25, 0.5, 0.75].map((pos, index) => ({
        key: `shelf-${index}`,
        position: [0, -height / 2 + height * pos, 0],
        size: [width - 0.05, 0.05, depth - 0.05],
      }));

      return { shelves };
    }, [size]);

    const productData = useMemo(() => {
      const spheres = [];
      const boxes = [];
      const shelfPositions = [0.25, 0.5, 0.75];

      const shelfProductTypes = [
        type,
        type === "meat" ? "dairy" : type,
        type === "meat" ? "bakery" : type,
      ];

      for (let i = 0; i < shelfPositions.length; i++) {
        const shelfY = -height / 2 + height * shelfPositions[i];
        const productType = shelfProductTypes[i];
        const colorPalette =
          productColorPalettes[productType] || productColorPalettes.general;

        const productCount = Math.max(3, Math.floor(width / 0.4));
        const isSphere = i % 2 === 0;

        for (let j = 0; j < productCount; j++) {
          const productWidth = isSphere ? 0.15 : 0.2;
          const productHeight = isSphere ? 0.15 : 0.15;
          const productDepth = isSphere ? 0.15 : 0.15;

          const xPos = -width / 2 + (width / (productCount + 1)) * (j + 1);
          const colorIndex = j % colorPalette.length;
          const productColor = colorPalette[colorIndex];

          const product = {
            id: `${i}-${j}`,
            position: [
              xPos,
              shelfY + 0.05,
              -depth / 2 + 0.1 + depth * 0.6 * 0.5,
            ] as [number, number, number],
            color: productColor,
          };

          if (isSphere) {
            spheres.push({
              ...product,
              radius: productWidth,
            });
          } else {
            boxes.push({
              ...product,
              size: [productWidth, productHeight, productDepth] as [
                number,
                number,
                number
              ],
            });
          }
        }
      }

      return { spheres, boxes };
    }, [size]);

    const handleInteraction = () => {
      incrementInteraction(id);
      recordInteraction(id);
    };

    if (type === "cashier") {
      return (
        <group
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
            handleInteraction();
          }}
        >
          <Box
            args={[1.5, 0.05, 1]}
            position={[0, -0.1, 0.1]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={color}
              opacity={isSelected ? 0.8 : 1}
              transparent={isSelected}
            />
          </Box>
          <Box
            args={[0.1, -0.62, 1]}
            position={[-0.7, -0.43, 0.1]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={color} />
          </Box>
          <Box
            args={[0.1, -0.62, 1]}
            position={[0.7, -0.43, 0.1]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={color} />
          </Box>
          <Box
            args={[0.5, 0.8, 0.1]}
            position={[0, 0.5, 0.51]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#b7d2f1" />
          </Box>
          <Text
            position={[0, 1.2, 0.5]}
            fontSize={0.2}
            color="black"
            anchorX="center"
            anchorY="middle"
            rotation={[0, Math.PI, 0]}
          >
            CashRegister
          </Text>
          <Box visible={isSelected} args={[1.6, 1.1, 1.1]}>
            <meshStandardMaterial
              color="#ffff00"
              wireframe
              opacity={0.5}
              transparent
            />
          </Box>
        </group>
      );
    }

    if (type === "wall") {
      return (
        <group
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
            handleInteraction();
          }}
        >
          <Box
            args={[2, 3, 0.25]}
            castShadow
            receiveShadow
            position={[0, 0.5, 0]}
          >
            <meshStandardMaterial
              color={"#333"}
              opacity={isSelected ? 0.8 : 1}
              transparent={isSelected}
            />
          </Box>
        </group>
      );
    }

    // Рендеринг стандартной полки
    return (
      <group
        ref={ref}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
          handleInteraction();
        }}
      >
        <Box
          args={[width, height, 0.05]}
          position={[0, 0, depth / 2 - 0.025]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            opacity={isSelected ? 0.8 : 1}
            transparent={isSelected}
          />
        </Box>

        <Box
          args={[0.05, height, depth]}
          position={[-width / 2 + 0.025, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </Box>
        <Box
          args={[0.05, height, depth]}
          position={[width / 2 - 0.025, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </Box>

        <Box
          args={[width, 0.05, depth]}
          position={[0, height / 2 - 0.025, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </Box>
        <Box
          args={[width, 0.05, depth]}
          position={[0, -height / 2 + 0.025, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} />
        </Box>

        <Instances>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d0d0d0" />
          {shelfData.shelves.map((shelf) => (
            <Instance
              key={shelf.key}
              position={shelf.position as [number, number, number]}
              scale={shelf.size as [number, number, number]}
              castShadow
            />
          ))}
        </Instances>

        <Instances visible={productData.spheres.length > 0}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial />
          {productData.spheres.map((sphere) => (
            <Instance
              key={sphere.id}
              position={sphere.position}
              scale={sphere.radius}
              color={sphere.color}
              castShadow
            />
          ))}
        </Instances>

        <Instances visible={productData.boxes.length > 0}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial />
          {productData.boxes.map((box) => (
            <Instance
              key={box.id}
              position={box.position}
              scale={box.size}
              color={box.color}
              castShadow
            />
          ))}
        </Instances>

        <Text
          position={[0, height / 2 + 0.2, 0]}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, Math.PI, 0]}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>

        <Text
          position={[0, -height / 2 - 0.2, 0]}
          fontSize={0.15}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`Interactions: ${shelf.interactions}`}
        </Text>

        <Box
          visible={isSelected}
          args={[width + 0.1, height + 0.1, depth + 0.1]}
        >
          <meshStandardMaterial
            color="#ffff00"
            wireframe
            opacity={0.5}
            transparent
          />
        </Box>
      </group>
    );
  }
);

Shelf.displayName = "Shelf";
