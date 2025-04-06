import { buildSlice } from "@/shared/lib/store/buildStore";
import { SimulationResponse } from "../types/Simulation";
import { PayloadAction } from "@reduxjs/toolkit";

interface SimulationState {
  simulationState?: SimulationResponse;
}

const initialState: SimulationState = {
  simulationState: undefined,
};

const simulationSlice = buildSlice({
  name: "simulation",
  initialState,
  reducers: {
    setSimulationState: (state, action: PayloadAction<SimulationResponse>) => {
      state.simulationState = action.payload;
    },
  },
});

export const { reducer: simulationReducer, useActions: useSimulationActions } =
  simulationSlice;
