"use client"

import { useState } from "react"
import { useAppSelector } from "@/shared/hooks/use-app-selector"
import { useAppDispatch } from "@/shared/hooks/use-app-dispatch"
import { setStoreSize } from "@/entities/store/model/store-slice"
import { addShelf, type ShelfSize, type ShelfType, clearShelves, setShelves } from "@/entities/shelves/model/shelves-slice"
import { addCustomer } from "@/entities/customers/model/customers-slice"
import { storePresets } from "./store-presets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StoreControls() {
  const dispatch = useAppDispatch()
  const storeSize = useAppSelector((state) => state.store)

  const [width, setWidth] = useState(storeSize.width.toString())
  const [length, setLength] = useState(storeSize.length.toString())
  const [height, setHeight] = useState(storeSize.height.toString())

  const [shelfType, setShelfType] = useState<ShelfType>("vegetables")
  const [shelfSize, setShelfSize] = useState<ShelfSize>("medium")

  const handleUpdateStoreSize = () => {
    dispatch(
      setStoreSize({
        width: Number(width),
        length: Number(length),
        height: Number(height),
      }),
    )
  }

  const handleAddShelf = () => {
    const x = (Math.random() - 0.5) * (Number(width) - 2)
    const z = (Math.random() - 0.5) * (Number(length) - 2)

    dispatch(
      addShelf({
        type: shelfType,
        size: shelfSize,
        position: { x, y: 0, z },
      }),
    )
  }

  const handleAddCustomer = () => {
    const angle = Math.random() * Math.PI * 2
    const x = Math.cos(angle) * (Number(width) / 2 - 1)
    const z = Math.sin(angle) * (Number(length) / 2 - 1)

    dispatch(
      addCustomer({
        position: { x, y: 0, z },
      }),
    )
  }

  const handlePresetChange = (presetKey: string) => {
    if (presetKey === "") return
    
    const preset = storePresets[presetKey]
    if (preset) {
      dispatch(setStoreSize(preset.storeSize))
      dispatch(setShelves(preset.shelves))
      // Update local state to match the preset
      setWidth(preset.storeSize.width.toString())
      setLength(preset.storeSize.length.toString())
      setHeight(preset.storeSize.height.toString())
    }
  }

  const handleClearAll = () => {
    dispatch(clearShelves())
  }

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
            <Button variant="destructive" onClick={handleClearAll} className="w-full">
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
              <Select value={shelfType} onValueChange={(value) => setShelfType(value as ShelfType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dairy">Dairy Products</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="produce">Produce</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shelfSize">Shelf Size</Label>
              <Select value={shelfSize} onValueChange={(value) => setShelfSize(value as ShelfSize)}>
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
  )
}