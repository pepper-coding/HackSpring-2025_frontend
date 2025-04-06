import { useCustomersActions } from "@/entities/Customers";
import { useStoreActions, useUpdatePresetMutation } from "@/entities/Preset";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Loader } from "lucide-react";
import React from "react";

export const CustomerForm = () => {
  const { addCustomer } = useCustomersActions();
  const { length, width, id, customerNumber } = useAppSelector(
    (state) => state.store
  );
  const shelves = useAppSelector((state) => state.shelves.items);
  const [patchPreset, { isLoading }] = useUpdatePresetMutation();
  const { updatePreset } = useStoreActions();

  const handleAddCustomer = () => {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * (Number(width) / 2 - 1);
    const z = Math.sin(angle) * (Number(length) / 2 - 1);

    patchPreset({ id, customerNumber: customerNumber + 1 });
    updatePreset({ customerNumber: customerNumber + 1 });
    
    // Выбираем случайную полку, исключая кассы
    let targetShelfId = null;
    const productShelves = shelves.filter(shelf => shelf.type !== "cashier");
    
    if (productShelves.length > 0) {
      const randomShelf = productShelves[Math.floor(Math.random() * productShelves.length)];
      targetShelfId = randomShelf.id;
    }
    
    addCustomer({
      position: { x, y: 0, z },
      targetShelfId: targetShelfId
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAddCustomer} className="w-full">
          {isLoading ? <Loader /> : "Add Customer"}
        </Button>
      </CardContent>
    </Card>
  );
};
