import { buildSlice } from "@/shared/lib/store/buildStore";
import { type PayloadAction } from "@reduxjs/toolkit";

interface StoreState {
  width: number;
  length: number;
  height: number;
  id: string;
  name: string;
  customerNumber: number;
}

const initialState: StoreState = {
  width: 20,
  length: 30,
  height: 4,
  id: "",
  name: "",
  customerNumber: 0,
};

export const storeSlice = buildSlice({
  name: "store",
  initialState,
  reducers: {
    setStoreSize: (
      state,
      action: PayloadAction<{ width: number; length: number; height: number }>
    ) => {
      state.width = action.payload.width;
      state.length = action.payload.length;
      state.height = action.payload.height;
    },

    updatePreset: (
      state,
      action: PayloadAction<
        Partial<{
          width: number;
          height: number;
          length: number;
          name: string;
          id: string;
          customerNumber: number;
        }>
      >
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { useActions: useStoreActions, reducer: storeReducer } =
  storeSlice;
