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
  const simulationData = useAppSelector((state) => state.simulation.simulationState);
  const { setCustomerTarget, updateCustomerPosition, removeCustomer } = useCustomersActions();
  const { recordInteraction } = useAnalyticsActions();
  const { incrementInteraction } = useShelvesActions();

  const lineMap = useRef<Map<string, THREE.Line>>(new Map());
  const pathLinesRef = useRef<Map<string, THREE.Line>>(new Map());

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

  // Определяем, какие полки являются кассами
  const cashierShelves = useMemo(() => {
    return shelves
      .filter(shelf => shelf.type === "cashier")
      .map(shelf => shelf.id);
  }, [shelves]);

  useEffect(() => {
    return () => {
      lineMap.current.clear();
      pathLinesRef.current.clear();
    };
  }, [simulationData]);

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
      if (customer.targetShelfId) {
        incrementInteraction(customer.targetShelfId);
        recordInteraction(customer.targetShelfId);
      }

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

  const handleSimulationPathMovement = (customer: (typeof customers)[0]) => {
    if (!customer.simulationPath || !customer.currentPathIndex) return;
    
    // Проверяем достиг ли покупатель конца пути
    if (customer.currentPathIndex >= customer.simulationPath.length) {
      // Покупатель достиг конца пути - проверяем, вернулся ли он в начальную точку
      const startPoint = customer.simulationPath[0];
      const endPoint = customer.simulationPath[customer.simulationPath.length - 1];
      
      // Проверяем, совпадают ли начало и конец пути (возврат к входу/выходу)
      if (Math.abs(startPoint[0] - endPoint[0]) < 2 && Math.abs(startPoint[1] - endPoint[1]) < 2) {
        // Очищаем линию пути
        pathLinesRef.current.delete(customer.id);
        // Удаляем покупателя, так как он вернулся к выходу
        removeCustomer(customer.id);
      }
      return;
    }
    
    const currentPoint = customer.simulationPath[customer.currentPathIndex - 1];
    const nextPoint = customer.simulationPath[customer.currentPathIndex];
    
    const vectors = vectorCache.current;
    vectors.customerPosition.set(customer.position.x, 0, customer.position.z);
    vectors.targetPosition.set(nextPoint[0], 0, nextPoint[1]);
    
    vectors.direction.subVectors(vectors.targetPosition, vectors.customerPosition).normalize();
    const distance = vectors.customerPosition.distanceTo(vectors.targetPosition);
    
    if (distance < 0.3) {
      // Достигли текущей точки, переходим к следующей
      const newPathIndex = customer.currentPathIndex + 1;
      
      // Если у нас есть информация о посещенных полках, записываем взаимодействие
      if (customer.visitedShelves && customer.currentPathIndex < customer.visitedShelves.length) {
        const shelfId = customer.visitedShelves[customer.currentPathIndex - 1];
        if (shelfId) {
          incrementInteraction(shelfId);
          recordInteraction(shelfId);
        }
      }
      
      // Обновляем позицию и целевую точку покупателя
      if (newPathIndex < customer.simulationPath.length) {
        updateCustomerPosition({
          id: customer.id,
          position: {
            x: nextPoint[0],
            y: 0,
            z: nextPoint[1],
          },
          currentPathIndex: newPathIndex
        });
        
        // Обновляем целевую позицию
        setCustomerTarget({
          id: customer.id,
          targetShelfId: customer.targetShelfId,
          targetPosition: {
            x: customer.simulationPath[newPathIndex][0],
            y: 0,
            z: customer.simulationPath[newPathIndex][1],
          },
        });
      } else {
        // Достигли последней точки в пути
        // Проверяем, вернулись ли в исходную точку (вход/выход)
        const startPoint = customer.simulationPath[0];
        const endPoint = customer.simulationPath[customer.simulationPath.length - 1];
        
        updateCustomerPosition({
          id: customer.id,
          position: {
            x: nextPoint[0],
            y: 0,
            z: nextPoint[1],
          },
          currentPathIndex: newPathIndex
        });
        
        // Проверяем, совпадают ли начало и конец пути
        if (Math.abs(startPoint[0] - endPoint[0]) < 2 && Math.abs(startPoint[1] - endPoint[1]) < 2) {
          // Очищаем линию пути
          pathLinesRef.current.delete(customer.id);
          // Удаляем покупателя, так как он вернулся к выходу
          removeCustomer(customer.id);
        }
      }
    } else {
      // Двигаемся к следующей точке
      const newPosition = {
        x: customer.position.x + vectors.direction.x * customer.speed,
        y: 0,
        z: customer.position.z + vectors.direction.z * customer.speed,
      };
      
      updateCustomerPosition({
        id: customer.id,
        position: newPosition,
      });
    }
  };

  useFrame(() => {
    customers.forEach((customer) => {
      // Используем симуляцию, если у покупателя есть путь
      if (customer.simulationPath && customer.simulationPath.length > 1) {
        handleSimulationPathMovement(customer);
      } else if (customer.targetShelfId) {
        // Используем стандартное движение, если нет пути симуляции
        const targetShelf = shelfMap.get(customer.targetShelfId);
        if (targetShelf) {
          handleCustomerMovement(customer, targetShelf, vectorCache.current);
        }
      }
    });
  });

  // Создание линии пути для покупателя
  const createPathLine = (customer: (typeof customers)[0]) => {
    if (!customer.simulationPath || customer.simulationPath.length < 2) return null;
    
    const points = customer.simulationPath.map(
      ([x, z]) => new THREE.Vector3(x, 0.1, z)
    );
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    return (
      <line
        key={`path-${customer.id}`}
        ref={(el) => {
          if (el) {
            // @ts-ignore
            pathLinesRef.current.set(customer.id, el);
          } else {
            pathLinesRef.current.delete(customer.id);
          }
        }}
      >
        <bufferGeometry attach="geometry" {...geometry} />
        <lineBasicMaterial
          attach="material"
          color="#00ffff"
          transparent
          opacity={0.4}
          linewidth={1}
        />
      </line>
    );
  };

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

  return (
    <>
      {sortedCustomers.map((customer) => (
        <group key={customer.id}>
          <Customer customer={customer} />
          {customer.simulationPath ? (
            createPathLine(customer)
          ) : (
            customer.targetShelfId && createLineForCustomer(customer)
          )}
        </group>
      ))}
    </>
  );
}
