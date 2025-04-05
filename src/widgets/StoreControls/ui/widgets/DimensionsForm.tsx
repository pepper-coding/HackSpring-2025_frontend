import { useStoreActions, useUpdatePresetMutation } from "@/entities/Preset";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import { Loader } from "lucide-react";
import React, { FC, useEffect, useState } from "react";

interface DimensionsFormProps {}

export const DimensionsForm: FC<DimensionsFormProps> = ({}) => {
  const [patchPreset, { isLoading }] = useUpdatePresetMutation();
  const { updatePreset } = useStoreActions();
  const { id, name, width, height, length } = useAppSelector(
    (state) => state.store
  );

  const [newName, setNewName] = useState<string>("");
  const [newWidth, setNewWidth] = useState<number>(0);
  const [newHeight, setNewHeight] = useState<number>(0);
  const [newLength, setNewLength] = useState<number>(0);

  useEffect(() => {
    setNewName(name);
    setNewWidth(width);
    setNewHeight(height);
    setNewLength(length);
  }, [name, width, height, length]);

  const handleUpdateStoreSize = async () => {
    await patchPreset({
      width: newWidth ? Number(newWidth) : undefined,
      height: newHeight ? Number(newHeight) : undefined,
      name: newName ? newName : undefined,
      id,
    });

    updatePreset({
      width: typeof newWidth === "number" ? Number(newWidth) : undefined,
      height: typeof newHeight === "number" ? Number(newHeight) : undefined,
      length: typeof newLength === "number" ? Number(newLength) : undefined,
      name: newName ? newName : undefined,
    });
  };

  return (
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
              value={newWidth || ""}
              onChange={(e) => {
                console.log(e.target.value);
                setNewWidth(+e.target.value);
              }}
              type="number"
              min="5"
              max="50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="length">Length (m)</Label>
            <Input
              id="length"
              value={newLength || ""}
              onChange={(e) => setNewLength(+e.target.value)}
              type="number"
              min="5"
              max="50"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="height">Height (m)</Label>
            <Input
              id="height"
              value={newHeight || ""}
              onChange={(e) => setNewHeight(+e.target.value)}
              type="number"
              min="2"
              max="10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              type="text"
            />
          </div>

          <Button onClick={handleUpdateStoreSize} className="w-full">
            {isLoading ? <Loader /> : "Update Store Size"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
