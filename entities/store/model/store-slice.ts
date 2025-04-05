import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface StoreState {
  width: number
  length: number
  height: number
}

const initialState: StoreState = {
  width: 20,
  length: 30,
  height: 4,
}

export const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setStoreSize: (state, action: PayloadAction<{ width: number; length: number; height: number }>) => {
      state.width = action.payload.width
      state.length = action.payload.length
      state.height = action.payload.height
    },
  },
})

export const { setStoreSize } = storeSlice.actions
export default storeSlice.reducer

