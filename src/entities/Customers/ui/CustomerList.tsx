import { useFrame } from "@react-three/fiber";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Customer } from "@/entities/Customers/ui/Customer";
import * as THREE from "three";
import { useCustomersActions } from "@/entities/Customers/model/slice/customersSlice";
import { useAnalyticsActions } from "@/entities/Analytics/model/analyticsSlice";
import { useShelvesActions } from "@/entities/Shelves/model/shelvesSlice";
import { useEffect, useRef, useMemo } from "react";

// Типы данных
interface VectorCache {
  direction: THREE.Vector3;
  targetPosition: THREE.Vector3;
  customerPosition: THREE.Vector3;
  lineStart: THREE.Vector3;
  lineEnd: THREE.Vector3;
}

interface ShelfPosition {
  x: number;
  y: number;
  position: THREE.Vector3;
}

export function CustomerList() {
  const customers = useAppSelector((state) => state.customers.items);
  const shelves = useAppSelector((state) => state.shelves.items);
  const { setCustomerTarget, removeCustomer, updateCustomerPosition } =
    useCustomersActions();
  const { recordInteraction } = useAnalyticsActions();
  const { incrementInteraction } = useShelvesActions();

  const lineMap = useRef<Map<string, THREE.Line>>(new Map());

  const vectorCache = useRef<VectorCache>({
    direction: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    customerPosition: new THREE.Vector3(),
    lineStart: new THREE.Vector3(),
    lineEnd: new THREE.Vector3(),
  });

  const shelfMap = useMemo<Map<string, ShelfPosition>>(() => {
    const map = new Map<string, ShelfPosition>();
    shelves.forEach((shelf) => {
      map.set(shelf.id, {
        x: shelf.x,
        y: shelf.y,
        position: new THREE.Vector3(shelf.x, 0, shelf.y),
      });
    });
    return map;
  }, [shelves]);

  useEffect(() => {
    return () => {
      lineMap.current.clear();
    };
  }, []);

  const handleCustomerMovement = (
    customer: (typeof customers)[0],
    targetShelf: ShelfPosition,
    vectors: VectorCache
  ): void => {
    const { direction, targetPosition, customerPosition, lineStart, lineEnd } =
      vectors;

    targetPosition.set(targetShelf.x, 0, targetShelf.y);
    customerPosition.set(customer.position.x, 0, customer.position.z);

    direction.subVectors(targetPosition, customerPosition).normalize();
    const distance = customerPosition.distanceTo(targetPosition);

    if (distance < 0.5) {
      incrementInteraction(customer.targetShelfId!);
      recordInteraction(customer.targetShelfId!);

      if (Math.random() < 0.3) {
        setCustomerTarget({
          id: customer.id,
          targetShelfId: null,
        });
      } else {
        const otherShelvesIds = Array.from(shelfMap.keys()).filter(
          (id) => id !== customer.targetShelfId
        );

        if (otherShelvesIds.length > 0) {
          const newTargetId =
            otherShelvesIds[Math.floor(Math.random() * otherShelvesIds.length)];
          setCustomerTarget({
            id: customer.id,
            targetShelfId: newTargetId,
          });
        }
      }
    } else {
      const newPosition = {
        x: customer.position.x + direction.x * customer.speed,
        y: 0,
        z: customer.position.z + direction.z * customer.speed,
      };

      const line = lineMap.current.get(customer.id);
      if (line) {
        lineStart.set(customer.position.x, 0.1, customer.position.z);
        lineEnd.set(targetPosition.x, 0.1, targetPosition.z);

        const positions = line.geometry.attributes.position
          .array as Float32Array;
        positions[0] = lineStart.x;
        positions[1] = lineStart.y;
        positions[2] = lineStart.z;
        positions[3] = lineEnd.x;
        positions[4] = lineEnd.y;
        positions[5] = lineEnd.z;

        line.geometry.attributes.position.needsUpdate = true;
        line.geometry.computeBoundingSphere();
      }

      updateCustomerPosition({
        id: customer.id,
        position: newPosition,
      });
    }
  };

  useFrame(() => {
    const vectors = vectorCache.current;
    const customersToRemove: string[] = [];

    const updates = {
      positions: new Map<string, { x: number; y: number; z: number }>(),
      targets: new Map<string, string | null>(),
      interactions: new Set<string>(),
    };

    customers.forEach((customer) => {
      if (
        Math.abs(customer.position.x) > 20 ||
        Math.abs(customer.position.z) > 20
      ) {
        customersToRemove.push(customer.id);
        return;
      }

      if (!customer.targetShelfId) {
        if (shelves.length > 0 && Math.random() < 0.01) {
          const shelfIds = Array.from(shelfMap.keys());
          const randomShelfId =
            shelfIds[Math.floor(Math.random() * shelfIds.length)];

          updates.targets.set(customer.id, randomShelfId);
        }
      } else {
        const targetShelf = shelfMap.get(customer.targetShelfId);
        if (targetShelf) {
          handleCustomerMovement(customer, targetShelf, vectors);
        }
      }
    });

    updates.targets.forEach((targetId, customerId) => {
      setCustomerTarget({ id: customerId, targetShelfId: targetId });
    });

    customersToRemove.forEach((id) => removeCustomer(id));
  });

  const createLineForCustomer = (customer: (typeof customers)[0]) => {
    if (!customer.targetShelfId) return null;

    const targetShelf = shelfMap.get(customer.targetShelfId);
    if (!targetShelf) return null;

    const points = [
      new THREE.Vector3(customer.position.x, 0.1, customer.position.z),
      new THREE.Vector3(targetShelf.x, 0.1, targetShelf.y),
    ];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    return (
      <line
        key={`line-${customer.id}`}
        ref={(el) => {
          if (el) {
            // @ts-ignore
            lineMap.current.set(customer.id, el);
          } else {
            lineMap.current.delete(customer.id);
          }
        }}
      >
        <bufferGeometry attach="geometry" {...geometry} />
        <lineBasicMaterial
          attach="material"
          color="white"
          transparent
          opacity={0.5}
        />
      </line>
    );
  };

  const prevCustomerCount = useRef(customers.length);

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) =>
      a.targetShelfId && b.targetShelfId
        ? a.targetShelfId.localeCompare(b.targetShelfId)
        : a.targetShelfId
        ? -1
        : b.targetShelfId
        ? 1
        : 0
    );
  }, [customers]);

  useEffect(() => {
    if (prevCustomerCount.current !== customers.length) {
      // Удаляем линии для несуществующих клиентов
      const currentIds = new Set(customers.map((c) => c.id));
      Array.from(lineMap.current.keys()).forEach((id) => {
        if (!currentIds.has(id)) {
          lineMap.current.delete(id);
        }
      });

      prevCustomerCount.current = customers.length;
    }
  }, [customers.length]);

  return (
    <>
      {sortedCustomers.map((customer) => (
        <group key={customer.id}>
          <Customer customer={customer} />
          {customer.targetShelfId && createLineForCustomer(customer)}
        </group>
      ))}
    </>
  );
}
