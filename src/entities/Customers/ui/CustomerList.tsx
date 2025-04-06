import { useFrame } from "@react-three/fiber";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Customer } from "@/entities/Customers/ui/Customer";
import * as THREE from "three";
import { useCustomersActions } from "@/entities/Customers/model/slice/customersSlice";
import { useAnalyticsActions } from "@/entities/Analytics/model/analyticsSlice";
import { useShelvesActions } from "@/entities/Shelves/model/shelvesSlice";
import { useEffect, useRef, useState } from "react";

export function CustomerList() {
  const customers = useAppSelector((state) => state.customers.items);
  const shelves = useAppSelector((state) => state.shelves.items);
  const { setCustomerTarget, removeCustomer, updateCustomerPosition } =
    useCustomersActions();
  const { recordInteraction } = useAnalyticsActions();
  const { incrementInteraction } = useShelvesActions();

  const lineRefs = useRef<Record<string, THREE.Line | undefined>>({});

  const [movingCustomers, setMovingCustomers] = useState<Set<string>>(new Set());
  
  // Ссылка на cashier shelves
  const cashRegisters = shelves.filter((shelf) => shelf.type === "cashier");

  useEffect(() => {
    lineRefs.current = {};
  }, []);

  useFrame(() => {
    customers.forEach((customer) => {
      if (!customer.targetShelfId) {
        // Если покупатель не имеет цели, у него 1% шанс выбрать случайную полку
        if (shelves.length > 0 && Math.random() < 0.01) {
          // Выбираем случайную полку (не кассу) в качестве цели
          const nonCashierShelves = shelves.filter(shelf => shelf.type !== "cashier");
          if (nonCashierShelves.length > 0) {
            const randomShelf = nonCashierShelves[Math.floor(Math.random() * nonCashierShelves.length)];
            
            setCustomerTarget({
              id: customer.id,
              targetShelfId: randomShelf.id,
              targetPosition: { x: randomShelf.x, y: 0, z: randomShelf.y }
            });
          }
        }
      } else {
        const targetShelf = shelves.find(
          (s) => s.id === customer.targetShelfId
        );

        if (targetShelf) {
          const targetPosition = new THREE.Vector3(
            targetShelf.x,
            0,
            targetShelf.y
          );

          const customerPosition = new THREE.Vector3(
            customer.position.x,
            0,
            customer.position.z
          );

          const direction = new THREE.Vector3()
            .subVectors(targetPosition, customerPosition)
            .normalize();

          const distance = customerPosition.distanceTo(targetPosition);

          if (distance < 0.5) {
            incrementInteraction(customer.targetShelfId);
            recordInteraction(customer.targetShelfId);

            // Если текущая цель - это касса, удаляем покупателя после взаимодействия
            if (targetShelf.type === "cashier") {
              removeCustomer(customer.id);
              setMovingCustomers((prev) => {
                const newSet = new Set(prev);
                newSet.delete(customer.id);
                return newSet;
              });
              return; // Прерываем выполнение для этого покупателя
            }

            // После посещения полки с товарами, покупатель либо не выбирает новую цель (30% шанс),
            // либо идет к кассе (если доступны), либо к другой полке
            if (Math.random() < 0.3) {
              setCustomerTarget({
                id: customer.id,
                targetShelfId: null,
                targetPosition: { ...customer.position }
              });
            } else {
              // Если есть доступные кассы и покупатель посетил хотя бы одну полку, направляем его к кассе
              if (cashRegisters.length > 0) {
                const randomCashier = cashRegisters[Math.floor(Math.random() * cashRegisters.length)];
                setCustomerTarget({
                  id: customer.id,
                  targetShelfId: randomCashier.id,
                  targetPosition: { x: randomCashier.x, y: 0, z: randomCashier.y }
                });
              } else {
                // Если касс нет, идем к другой полке
                const otherShelves = shelves.filter(
                  (s) => s.id !== customer.targetShelfId && s.type !== "cashier"
                );
                if (otherShelves.length > 0) {
                  const newTarget =
                    otherShelves[Math.floor(Math.random() * otherShelves.length)];
                  setCustomerTarget({
                    id: customer.id,
                    targetShelfId: newTarget.id,
                    targetPosition: { x: newTarget.x, y: 0, z: newTarget.y }
                  });
                }
              }
            }
          } else {
            const newPosition = {
              x: customer.position.x + direction.x * customer.speed,
              y: 0,
              z: customer.position.z + direction.z * customer.speed,
            };

            if (lineRefs.current[customer.id]) {
              const line = lineRefs.current[customer.id];
              line?.geometry.setFromPoints([
                new THREE.Vector3(
                  customer.position.x,
                  0.1,
                  customer.position.z
                ),
                targetPosition.clone().setY(0.1),
              ]);
              line!.geometry.attributes.position.needsUpdate = true;
            }

            updateCustomerPosition({
              id: customer.id,
              position: newPosition,
            });

            setMovingCustomers((prev) => new Set(prev).add(customer.id));
          }
        }
      }

      if (Math.abs(customer.position.x) > 20 || Math.abs(customer.position.z) > 20) {
        removeCustomer(customer.id);
        setMovingCustomers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(customer.id);
          return newSet;
        });
      }
    });
  });

  return (
    <>
      {customers.map((customer) => (
        <group key={customer.id}>
          <Customer customer={customer} />
          {customer.targetShelfId && movingCustomers.has(customer.id) && (
            <line ref={(el) => (lineRefs.current[customer.id] = el)}>
              <bufferGeometry attach="geometry" />
              <lineBasicMaterial
                attach="material"
                color="white"
                linewidth={1}
                transparent
                opacity={0.5}
              />
            </line>
          )}
        </group>
      ))}
    </>
  );
}
