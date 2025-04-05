import type { Shelf } from "@/entities/shelves/model/shelves-slice"

interface StoreSize {
  width: number
  length: number
  height: number
}

interface StorePreset {
  name: string
  storeSize: StoreSize
  shelves: Shelf[]
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
          id: "super-dairy-1",
          type: "dairy",
          size: "medium",
          position: { x: -10, y: 0, z: 10 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-dairy-2",
          type: "dairy",
          size: "medium",
          position: { x: -10, y: 0, z: 7 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-bakery-1",
          type: "bakery",
          size: "medium",
          position: { x: -5, y: 0, z: 10 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-bakery-2",
          type: "bakery",
          size: "medium",
          position: { x: -5, y: 0, z: 7 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-produce-1",
          type: "produce",
          size: "large",
          position: { x: 0, y: 0, z: 12 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-produce-2",
          type: "vegetables",
          size: "large",
          position: { x: 0, y: 0, z: 8 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-meat-1",
          type: "meat",
          size: "large",
          position: { x: 5, y: 0, z: 10 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-meat-2",
          type: "meat",
          size: "medium",
          position: { x: 5, y: 0, z: 7 },
          rotation: 0,
          interactions: 0,
        },
        {
          id: "super-vagetables-1",
          type: "vegetables",
          size: "large",
          position: { x: -2, y: 0, z: -5 },
          rotation: Math.PI / 2,
          interactions: 0,
        },
        {
          id: "super-vagetables-2",
          type: "vegetables",
          size: "large",
          position: { x: 2, y: 0, z: -5 },
          rotation: Math.PI / 2,
          interactions: 0,
        },
        {
          id: "super-vagetables-3",
          type: "vegetables",
          size: "large",
          position: { x: 6, y: 0, z: -5 },
          rotation: Math.PI / 2,
          interactions: 0,
        },
      ],
    },
  }
  