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
      }>
    ) => {
      const { id, position } = action.payload;
      const customer = state.items.find((c) => c.id === id);
      if (customer) {
        customer.position = position;
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
    
      if (customer) {
        customer.targetShelfId = targetShelfId;
        if (targetPosition) {
          customer.targetPosition = targetPosition;
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
  },
});

export const { reducer: customersReducer, useActions: useCustomersActions } =
  customersSlice;
