"use client";

import { useState } from "react";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { useCustomersActions } from "@/entities/Customers";
import { PresetSelect } from "./widgets/PresetSelect";
import { DimensionsForm } from "./widgets/DimensionsForm";
import { ShelfForm } from "./widgets/ShelfForm";
import { CustomerForm } from "./widgets/CustomerForm";

export function StoreControls() {
  const storeSize = useAppSelector((state) => state.store);
  const { addCustomer } = useCustomersActions();

  const [width, setWidth] = useState(storeSize.width.toString());
  const [length, setLength] = useState(storeSize.length.toString());
  const [height, setHeight] = useState(storeSize.height.toString());

  return (
    <div className="space-y-6">
      <PresetSelect />
      <DimensionsForm />
      <ShelfForm />
      <CustomerForm />
    </div>
  );
}
