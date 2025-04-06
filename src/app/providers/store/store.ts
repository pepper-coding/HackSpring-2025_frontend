import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { storeApi } from "@/shared/api/storeApi";
import { storeReducer } from "@/entities/Preset";
import { shelvesReducer } from "@/entities/Shelves";
import { customersReducer } from "@/entities/Customers";
import { analyticsReducer } from "@/entities/Analytics";
import { timerReducer } from "@/features/VirtualTimer";
import { simulationReducer } from "@/features/Simulation";

export const store = configureStore({
  reducer: {
    store: storeReducer,
    shelves: shelvesReducer,
    customers: customersReducer,
    analytics: analyticsReducer,
    timer: timerReducer,
    simulation: simulationReducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(storeApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
