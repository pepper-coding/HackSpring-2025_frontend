import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// This would connect to a backend in a real application
export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Store", "Shelves", "Customers", "Analytics"],
  endpoints: (builder) => ({
    // Example endpoints - in a real app these would connect to a backend
    getStoreLayout: builder.query({
      query: () => "store/layout",
      // Mock response for demo purposes
      transformResponse: () => ({
        width: 20,
        length: 30,
        height: 4,
      }),
    }),
  }),
})

export const { useGetStoreLayoutQuery } = storeApi

