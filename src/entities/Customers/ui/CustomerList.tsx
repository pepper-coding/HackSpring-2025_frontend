import { useFrame } from "@react-three/fiber";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Customer } from "@/entities/Customers/ui/Customer";
import * as THREE from "three";
import { useCustomersActions } from "@/entities/Customers/model/slice/customersSlice";
import { useAnalyticsActions } from "@/entities/Analytics/model/analyticsSlice";
import { useShelvesActions } from "@/entities/Shelves/model/shelvesSlice";
import { useEffect, useRef } from "react";

export function CustomerList() {
  const customers = useAppSelector((state) => state.customers.items);
  const shelves = useAppSelector((state) => state.shelves.items);
  const { setCustomerTarget, removeCustomer, updateCustomerPosition } =
    useCustomersActions();
  const { recordInteraction } = useAnalyticsActions();
  const { incrementInteraction } = useShelvesActions();

  const lineRefs = useRef<Record<string, THREE.Line | undefined>>({});

  useEffect(() => {
    lineRefs.current = {};
  }, []);

  useFrame(() => {
    customers.forEach((customer) => {
      if (!customer.targetShelfId) {
        if (shelves.length > 0 && Math.random() < 0.01) {
          const randomShelf =
            shelves[Math.floor(Math.random() * shelves.length)];
          setCustomerTarget({
            id: customer.id,
            targetShelfId: randomShelf.id,
          });
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

            if (Math.random() < 0.3) {
              setCustomerTarget({
                id: customer.id,
                targetShelfId: null,
              });
            } else {
              const otherShelves = shelves.filter(
                (s) => s.id !== customer.targetShelfId
              );
              if (otherShelves.length > 0) {
                const newTarget =
                  otherShelves[Math.floor(Math.random() * otherShelves.length)];
                setCustomerTarget({
                  id: customer.id,
                  targetShelfId: newTarget.id,
                });
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
          }
        }
      }
      if (
        Math.abs(customer.position.x) > 20 ||
        Math.abs(customer.position.z) > 20
      ) {
        removeCustomer(customer.id);
      }
    });
  });

  return (
    <>
      {customers.map((customer) => (
        <group key={customer.id}>
          <Customer customer={customer} />
          {customer.targetShelfId && (
            // @ts-ignore
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
