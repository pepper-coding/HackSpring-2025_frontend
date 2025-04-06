import { storeApi } from "@/shared/api/storeApi";
import {
  SimulationRequest,
  SimulationResponse,
} from "../model/types/Simulation";

const simulationApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getSimulation: builder.mutation<SimulationResponse, SimulationRequest>({
      query: (body) => ({
        url: "/simulation",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetSimulationMutation } = simulationApi;
