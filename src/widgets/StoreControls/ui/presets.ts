import { Shelf } from "@/entities/Shelves";

interface StoreSize {
  width: number;
  length: number;
  height: number;
}

interface StorePreset {
  name: string;
  storeSize: StoreSize;
  shelves: Shelf[];
}

export const storePresets: Record<string, StorePreset> = {
  smallShop: {
    name: "Small Shop",
    storeSize: { width: 10, length: 10, height: 3 },
    shelves: [
      {
        id: "small-veg-1",
        type: "vegetables",
        size: "medium",
        position: { x: -1, y: 0, z: 2 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "small-veg-2",
        type: "vegetables",
        size: "medium",
        position: { x: 0.5, y: 0, z: 2 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "small-bakery-1",
        type: "bakery",
        size: "small",
        position: { x: -1, y: 0, z: -2 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "small-bakery-2",
        type: "bakery",
        size: "small",
        position: { x: -0, y: 0, z: -2 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "small-bakery-3",
        type: "bakery",
        size: "small",
        position: { x: 1, y: 0, z: -2 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "small-dairy-1",
        type: "dairy",
        size: "small",
        position: { x: 2, y: 0, z: -1 },
        rotation: Math.PI / 2,
        interactions: 0,
      },
      {
        id: "small-dairy-2",
        type: "dairy",
        size: "small",
        position: { x: 2, y: 0, z: 0 },
        rotation: Math.PI / 2,
        interactions: 0,
      },
      {
        id: "small-dairy-3",
        type: "dairy",
        size: "small",
        position: { x: 2, y: 0, z: 1 },
        rotation: Math.PI / 2,
        interactions: 0,
      },
    ],
  },

  supermarket: {
    name: "Supermarket",
    storeSize: { width: 30, length: 40, height: 4 },
    shelves: [
      {
        id: "large-veg-1",
        type: "vegetables",
        size: "medium",
        position: { x: -5, y: 0, z: 1 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-veg-2",
        type: "vegetables",
        size: "medium",
        position: { x: -3, y: 0, z: 1 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-veg-3",
        type: "vegetables",
        size: "medium",
        position: { x: -1, y: 0, z: 1 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-veg-4",
        type: "vegetables",
        size: "medium",
        position: { x: 1, y: 0, z: 1 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-veg-5",
        type: "vegetables",
        size: "medium",
        position: { x: 3, y: 0, z: 1 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-veg-6",
        type: "vegetables",
        size: "medium",
        position: { x: 5, y: 0, z: 1 },
        rotation: 0,
        interactions: 0,
      },
  
      {
        id: "large-bakery-1",
        type: "bakery",
        size: "small",
        position: { x: 5, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-2",
        type: "bakery",
        size: "small",
        position: { x: 3.5, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-3",
        type: "bakery",
        size: "small",
        position: { x: 2, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-4",
        type: "bakery",
        size: "small",
        position: { x: 0.5, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-5",
        type: "bakery",
        size: "small",
        position: { x: -1, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-6",
        type: "bakery",
        size: "small",
        position: { x: -2.5, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-6",
        type: "meat",
        size: "small",
        position: { x: -4, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-6",
        type: "meat",
        size: "small",
        position: { x: -5.5, y: 0, z: -1.5 },
        rotation: Math.PI,
        interactions: 0,
      },
      {
        id: "large-bakery-1",
        type: "bakery",
        size: "small",
        position: { x: 5, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-2",
        type: "bakery",
        size: "small",
        position: { x: 3.5, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-3",
        type: "bakery",
        size: "small",
        position: { x: 2, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-4",
        type: "bakery",
        size: "small",
        position: { x: 0.5, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-5",
        type: "bakery",
        size: "small",
        position: { x: -1, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-6",
        type: "bakery",
        size: "small",
        position: { x: -2.5, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-6",
        type: "meat",
        size: "small",
        position: { x: -4, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
      {
        id: "large-bakery-6",
        type: "meat",
        size: "small",
        position: { x: -5.5, y: 0, z: -2.5 },
        rotation: 0,
        interactions: 0,
      },
  

      {
        id: "large-dairy-1",
        type: "dairy",
        size: "large",
        position: { x: -5, y: 0, z: -5 },
        rotation: -Math.PI,
        interactions: 0,
      },
      {
        id: "large-dairy-2",
        type: "dairy",
        size: "large",
        position: { x: -2.5, y: 0, z: -5 },
        rotation: -Math.PI,
        interactions: 0,
      },
      {
        id: "large-dairy-3",
        type: "dairy",
        size: "large",
        position: { x: 0, y: 0, z: -5 },
        rotation: -Math.PI,
        interactions: 0,
      },
      {
        id: "large-dairy-4",
        type: "dairy",
        size: "large",
        position: { x: 2.5, y: 0, z: -5 },
        rotation: -Math.PI,
        interactions: 0,
      },
      {
        id: "large-dairy-5",
        type: "dairy",
        size: "large",
        position: { x: 5, y: 0, z: -5 },
        rotation: -Math.PI,
        interactions: 0,
      },
    ],
  },
};
