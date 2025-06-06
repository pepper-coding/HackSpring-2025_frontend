import {
  ShelfSize,
  ShelfType,
  SQUARE_SIZE,
  useCreateShelfMutation,
  useShelvesActions,
} from "@/entities/Shelves";
import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Loader } from "lucide-react";

export const ShelfForm = () => {
  const [shelfType, setShelfType] = useState<ShelfType>("vegetables");
  const [shelfSize, setShelfSize] = useState<ShelfSize>("medium");
  const { addShelf } = useShelvesActions();
  const { width, length, id } = useAppSelector((state) => state.store);
  const [createShelf, { isLoading }] = useCreateShelfMutation();

  const handleAddShelf = async () => {
    const x =
      Math.round(((Math.random() - 0.5) * (Number(width) - 2)) / SQUARE_SIZE) *
      SQUARE_SIZE;
    const z =
      Math.round(((Math.random() - 0.5) * (Number(length) - 2)) / SQUARE_SIZE) *
      SQUARE_SIZE;

    await createShelf({
      type: shelfType,
      size: shelfSize,
      x,
      y: z,
      presetId: id,
      name: shelfType,
      interactions: 0,
      rotation: 0,
    });

    addShelf({
      type: shelfType,
      size: shelfSize,
      position: { x, y: 0, z },
    });
  };

  const handleAddCashRegister = async () => {
    const x =
      Math.round(((Math.random() - 0.5) * (Number(width) - 2)) / SQUARE_SIZE) *
      SQUARE_SIZE;
    const z =
      Math.round(((Math.random() - 0.5) * (Number(length) - 2)) / SQUARE_SIZE) *
      SQUARE_SIZE;

    await createShelf({
      type: "cashier",
      size: "medium",
      x,
      y: z,
      presetId: id,
      name: "cashier",
      interactions: 0,
      rotation: 0,
    });
    addShelf({
      type: "cashier",
      size: "medium",
      position: { x, y: 0, z },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Shelf</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="shelfType">Shelf Type</Label>
            <Select
              value={shelfType}
              onValueChange={(value) => setShelfType(value as ShelfType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dairy">Dairy Products</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="produce">Produce</SelectItem>
                <SelectItem value="meat">Meat</SelectItem>
                <SelectItem value="wall">Wall</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shelfSize">Shelf Size</Label>
            <Select
              value={shelfSize}
              onValueChange={(value) => setShelfSize(value as ShelfSize)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full"
            onClick={handleAddCashRegister}
            style={{
              backgroundColor: "#6bb8ff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Set up a cash reg
          </Button>

          <Button onClick={handleAddShelf} className="w-full">
            {isLoading ? <Loader /> : "Add Shelf"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
