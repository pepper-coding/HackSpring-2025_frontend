import { buildSlice } from "@/shared/lib/store/buildStore";
import { type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { Customer } from "../types/Customer";
import { CustomersState } from "../types/CustomerState";

const initialState: CustomersState = {
  items: [],
};

export const customersSlice = buildSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: (
      state,
      action: PayloadAction<{
        position: { x: number; y: number; z: number };
        targetShelfId?: string;
      }>
    ) => {
      const { position, targetShelfId = null } = action.payload;
      const newCustomer: Customer = {
        id: uuidv4(),
        position,
        targetPosition: { ...position },
        targetShelfId,
        speed: 0.001 + Math.random() * 0.05,
        isTakingItem: false,
      };
      state.items.push(newCustomer);
    },
    updateCustomerPosition: (
      state,
      action: PayloadAction<{
        id: string;
        position: { x: number; y: number; z: number };
        currentPathIndex?: number;
      }>
    ) => {
      const { id, position, currentPathIndex } = action.payload;
      const customer = state.items.find((c) => c.id === id);
      if (customer) {
        customer.position = position;
        if (currentPathIndex !== undefined) {
          customer.currentPathIndex = currentPathIndex;
        }
      }
    },
    setCustomerTarget: (
      state,
      action: PayloadAction<{
        id: string;
        targetShelfId: string | null;
        targetPosition?: { x: number; y: number; z: number };
      }>
    ) => {
      const { id, targetShelfId, targetPosition } = action.payload;
      const customer = state.items.find((c) => c.id === id);

      const shelvesExist = state.items.some((item) => item.targetShelfId);
      const cashierExist = state.items.some(
        (item) => item.targetShelfId === "cashier"
      );

      if (customer) {
        if (shelvesExist || cashierExist) {
          customer.targetShelfId = targetShelfId;
          if (targetPosition) {
            customer.targetPosition = targetPosition;
          }
        } else {
          customer.targetShelfId = null;
          customer.targetPosition = customer.position;
        }
      }
    },
    setCustomerTakingItem: (
      state,
      action: PayloadAction<{ id: string; isTakingItem: boolean }>
    ) => {
      const { id, isTakingItem } = action.payload;
      const customer = state.items.find((c) => c.id === id);
      if (customer) {
        customer.isTakingItem = isTakingItem;
      }
    },
    removeCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (customer) => customer.id !== action.payload
      );
    },
    setCustomersFromSimulation: (
      state,
      action: PayloadAction<{
        visitors: {
          id: number;
          path: [number, number][];
          final_position: [number, number];
          visited_shelves: string[];
        }[];
      }>
    ) => {
      state.items = [];
      
      const { visitors } = action.payload;
      
      const limitedVisitors = visitors.slice(0, 20);
      
      limitedVisitors.forEach((visitor) => {
        if (visitor.path.length < 2) return;
        
        const newCustomer: Customer = {
          id: visitor.id.toString(),
          position: {
            x: visitor.path[0][0],
            y: 0,
            z: visitor.path[0][1],
          },
          targetPosition: {
            x: visitor.path[1][0],
            y: 0,
            z: visitor.path[1][1],
          },
          targetShelfId: visitor.visited_shelves[0] || null,
          speed: 0.005 + Math.random() * 0.01,
          isTakingItem: false,
          simulationPath: visitor.path,
          currentPathIndex: 1,
          visitedShelves: visitor.visited_shelves,
        };
        
        state.items.push(newCustomer);
      });
    },
  },
});

export const { reducer: customersReducer, useActions: useCustomersActions } =
  customersSlice;
