import { storeApi } from "@/shared/api/storeApi";
import {
  SimulationRequest,
  SimulationResponse,
} from "../model/types/Simulation";

export const simulationApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimulation: builder.mutation<SimulationResponse, SimulationRequest>({
      query: (body) => ({
        url: "/simulation/run",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetSimulationMutation } = simulationApi;
