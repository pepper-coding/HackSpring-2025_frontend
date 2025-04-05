import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { storeApi } from "@/shared/api/store-api"
import storeReducer from "@/entities/store/model/store-slice"
import shelvesReducer from "@/entities/shelves/model/shelves-slice"
import customersReducer from "@/entities/customers/model/customers-slice"
import analyticsReducer from "@/entities/analytics/model/analytics-slice"

export const store = configureStore({
  reducer: {
    store: storeReducer,
    shelves: shelvesReducer,
    customers: customersReducer,
    analytics: analyticsReducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storeApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

