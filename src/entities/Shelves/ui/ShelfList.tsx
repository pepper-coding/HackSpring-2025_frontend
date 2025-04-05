"use client";

import { useEffect, useRef, useState } from "react";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { ShelfModel } from "@/entities/Shelves";
import * as THREE from "three";
import { useShelvesActions } from "@/entities/Shelves";

const shelfSizes = {
  small: { width: 1, height: 1.5, depth: 0.6 },
  medium: { width: 1.5, height: 1.5, depth: 0.6 },
  large: { width: 2.5, height: 1.5, depth: 0.6 },
};

export function ShelfList() {
  const shelves = useAppSelector((state) => state.shelves.items);
  const selectedShelfId = useAppSelector(
    (state) => state.shelves.selectedShelfId
  );
  const { selectShelf, updateShelfPosition, updateShelfRotation } =
    useShelvesActions();
  const { camera, gl } = useThree();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const groupRefs = useRef<{ [id: string]: THREE.Group }>({});
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());
  const offset = useRef(new THREE.Vector3());

  const handlePointerDown = (
    event: ThreeEvent<PointerEvent>,
    shelfId: string
  ) => {
    event.stopPropagation();
    if (draggingId) return;

    const group = groupRefs.current[shelfId];
    if (!group) return;

    const intersects = event.intersections;
    if (
      intersects.some((intersect) => intersect.object.userData.isRotateButton)
    ) {
      const newRotation = group.rotation.y + Math.PI / 2;
      group.rotation.y = newRotation;
      updateShelfRotation({ id: shelfId, rotation: newRotation });
      return;
    }

    pointer.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.current.setFromCamera(pointer.current, camera);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane.current, intersection);

    offset.current.copy(intersection).sub(group.position);

    setDraggingId(shelfId);
    selectShelf(shelfId);
    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: MouseEvent) => {
    if (!draggingId) return;

    const group = groupRefs.current[draggingId];
    if (!group) return;

    pointer.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.current.setFromCamera(pointer.current, camera);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane.current, intersection);

    group.position.copy(intersection.sub(offset.current));
  };

  const handlePointerUp = () => {
    if (!draggingId) return;

    const group = groupRefs.current[draggingId];
    if (group) {
      updateShelfPosition({
        id: draggingId,
        position: {
          x: group.position.x,
          y: group.position.y,
          z: group.position.z,
        },
      });
    }

    setDraggingId(null);
    gl.domElement.style.cursor = hoveredId ? "pointer" : "auto";
  };

  const handlePointerOver = (
    event: ThreeEvent<PointerEvent>,
    shelfId: string
  ) => {
    event.stopPropagation();
    setHoveredId(shelfId);
    if (!draggingId) {
      gl.domElement.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    setHoveredId(null);
    if (!draggingId) {
      gl.domElement.style.cursor = "auto";
    }
  };

  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingId]);

  return (
    <>
      {shelves.map((shelf) => {
        const size = shelfSizes[shelf.size];
        const baseY = size.height / 2;

        return (
          <group
            key={shelf.id}
            position={[shelf.position.x, baseY, shelf.position.z]}
            rotation={[0, shelf.rotation, 0]}
            onPointerDown={(e) => handlePointerDown(e, shelf.id)}
            onPointerOver={(e) => handlePointerOver(e, shelf.id)}
            onPointerOut={handlePointerOut}
            onClick={(e) => e.stopPropagation()}
            ref={(el) => {
              if (el) {
                el.userData = { id: shelf.id };
                groupRefs.current[shelf.id] = el;
              }
            }}
          >
            <ShelfModel
              shelf={shelf}
              isSelected={shelf.id === selectedShelfId}
              onClick={() => !draggingId && selectShelf(shelf.id)}
            />
            {
              <mesh
                position={[size.width / 2 + 0.2, size.height / 2 + 0.1, 0]}
                userData={{ isRotateButton: true }}
                onClick={(e) => e.stopPropagation()}
              >
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshStandardMaterial color="yellow" />
              </mesh>
            }
          </group>
        );
      })}
    </>
  );
}
