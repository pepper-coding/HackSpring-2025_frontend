"use client";

import { useState } from "react";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ShelfSize, ShelfType, useShelvesActions } from "@/entities/Shelves";
import { useCustomersActions } from "@/entities/Customers";
import { useStoreActions } from "@/entities/Preset";
import { storePresets } from "./presets";

export function StoreControls() {
  const storeSize = useAppSelector((state) => state.store);
  const { addShelf, clearShelves, setShelves } = useShelvesActions();
  const { addCustomer } = useCustomersActions();
  const { setStoreSize } = useStoreActions();

  const [width, setWidth] = useState(storeSize.width.toString());
  const [length, setLength] = useState(storeSize.length.toString());
  const [height, setHeight] = useState(storeSize.height.toString());

  const [shelfType, setShelfType] = useState<ShelfType>("general");
  const [shelfSize, setShelfSize] = useState<ShelfSize>("medium");

  const handleUpdateStoreSize = () => {
    setStoreSize({
      width: Number(width),
      length: Number(length),
      height: Number(height),
    });
  };

  const handleAddShelf = () => {
    const x = (Math.random() - 0.5) * (Number(width) - 2);
    const z = (Math.random() - 0.5) * (Number(length) - 2);

    addShelf({
      type: shelfType,
      size: shelfSize,
      position: { x, y: 0, z },
    });
  };

  const handleAddCustomer = () => {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * (Number(width) / 2 - 1);
    const z = Math.sin(angle) * (Number(length) / 2 - 1);

    addCustomer({
      position: { x, y: 0, z },
    });
  };

  const handlePresetChange = (presetKey: string) => {
    if (presetKey === "") return;

    const preset = storePresets[presetKey];
    if (preset) {
      setStoreSize(preset.storeSize);
      setShelves(preset.shelves);
      // Update local state to match the preset
      setWidth(preset.storeSize.width.toString());
      setLength(preset.storeSize.length.toString());
      setHeight(preset.storeSize.height.toString());
    }
  };

  const handleClearAll = () => {
    clearShelves();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset layout" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(storePresets).map(([key, preset]) => (
                  <SelectItem key={key} value={key}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="w-full"
            >
              Clear All Shelves
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="width">Width (m)</Label>
              <Input
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                type="number"
                min="5"
                max="50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="length">Length (m)</Label>
              <Input
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                type="number"
                min="5"
                max="50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="height">Height (m)</Label>
              <Input
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                type="number"
                min="2"
                max="10"
              />
            </div>

            <Button onClick={handleUpdateStoreSize} className="w-full">
              Update Store Size
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  <SelectItem value="general">General</SelectItem>
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

            <Button onClick={handleAddShelf} className="w-full">
              Add Shelf
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddCustomer} className="w-full">
            Add Customer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
