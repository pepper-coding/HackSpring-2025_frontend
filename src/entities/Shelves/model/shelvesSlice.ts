import { buildSlice } from "@/shared/lib/store/buildStore";
import { type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type ShelfType =
  | "dairy"
  | "bakery"
  | "produce"
  | "meat"
  | "vegetables"
  | "general"
  | "wall";
export type ShelfSize = "small" | "medium" | "large";

export interface Shelf {
  id: string;
  type: ShelfType;
  size: ShelfSize;
  x: number;
  y: number;
  rotation: number;
  interactions: number;
}

interface ShelvesState {
  items: Shelf[];
  selectedShelfId: string | null;
}

const initialState: ShelvesState = {
  items: [],
  selectedShelfId: null,
};

export const shelvesSlice = buildSlice({
  name: "shelves",
  initialState,
  reducers: {
    addShelf: (
      state,
      action: PayloadAction<{
        type: ShelfType;
        size: ShelfSize;
        position: { x: number; y: number; z: number };
      }>
    ) => {
      const { type, size, position } = action.payload;
      const newShelf: Shelf = {
        id: uuidv4(),
        type,
        size,
        x: position.x,
        y: position.y,
        rotation: 0,
        interactions: 0,
      };
      state.items.push(newShelf);
    },
    updateShelfPosition: (
      state,
      action: PayloadAction<{
        id: string;
        position: { x: number; y: number; z: number };
      }>
    ) => {
      const { id, position } = action.payload;
      const shelf = state.items.find((s) => s.id === id);
      if (shelf) {
        shelf.x = position.x;
        shelf.y = position.y;
      }
    },
    updateShelfRotation: (
      state,
      action: PayloadAction<{ id: string; rotation: number }>
    ) => {
      const { id, rotation } = action.payload;
      const shelf = state.items.find((s) => s.id === id);
      if (shelf) {
        shelf.rotation = rotation;
      }
    },
    incrementInteraction: (state, action: PayloadAction<string>) => {
      const shelf = state.items.find((s) => s.id === action.payload);
      if (shelf) {
        shelf.interactions += 1;
      }
    },
    selectShelf: (state, action: PayloadAction<string | null>) => {
      state.selectedShelfId = action.payload;
    },
    removeShelf: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((shelf) => shelf.id !== action.payload);
      if (state.selectedShelfId === action.payload) {
        state.selectedShelfId = null;
      }
    },
    clearShelves: (state) => {
      state.items = [];
      state.selectedShelfId = null;
    },
    setShelves: (state, action: PayloadAction<Shelf[]>) => {
      state.items = action.payload;
    },
  },
});

export const { useActions: useShelvesActions, reducer: shelvesReducer } =
  shelvesSlice;
