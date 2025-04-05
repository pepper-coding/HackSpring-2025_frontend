import { buildSlice } from "@/shared/lib/store/buildStore";
import { type PayloadAction } from "@reduxjs/toolkit";

interface StoreState {
  width: number;
  length: number;
  height: number;
}

const initialState: StoreState = {
  width: 20,
  length: 30,
  height: 4,
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
  },
});

export const { useActions: useStoreActions, reducer: storeReducer } =
  storeSlice;
