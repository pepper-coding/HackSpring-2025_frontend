import { buildSlice } from "@/shared/lib/store/buildStore";
import { PayloadAction } from "@reduxjs/toolkit";

interface TimerSchema {
  time: string;
  isRunning: boolean;
  booster: number;
}

const initialState: TimerSchema = {
  time: new Date().toISOString(),
  isRunning: false,
  booster: 1,
};

const timerSlice = buildSlice({
  name: "timer",
  initialState,
  reducers: {
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    setIsRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    setBooster: (state, action: PayloadAction<number>) => {
      state.booster = action.payload;
    },
  },
});

export const { reducer: timerReducer, useActions: useTimerActions } =
  timerSlice;
