"use client";

import { useFrame } from "@react-three/fiber";
import { useAppSelector } from "@/shared/hooks/use-app-selector";
import { Customer } from "@/entities/customers/ui/customer";
import * as THREE from "three";
import { useCustomersActions } from "@/entities/customers/model/customers-slice";
import { useAnalyticsActions } from "@/entities/analytics/model/analytics-slice";
import { useShelvesActions } from "@/entities/shelves/model/shelves-slice";

export function CustomerList() {
  const customers = useAppSelector((state) => state.customers.items);
  const shelves = useAppSelector((state) => state.shelves.items);
  const { setCustomerTarget, removeCustomer, updateCustomerPosition } =
    useCustomersActions();
  const { recordInteraction } = useAnalyticsActions();
  const { incrementInteraction } = useShelvesActions();

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
            targetShelf.position.x,
            0,
            targetShelf.position.z
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
        <Customer key={customer.id} customer={customer} />
      ))}
    </>
  );
}
