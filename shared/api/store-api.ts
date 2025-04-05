import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["Store", "Shelves", "Customers", "Analytics"],
  endpoints: (builder) => ({
    getStoreLayout: builder.query({
      query: () => "store/layout",
      transformResponse: () => ({
        width: 20,
        length: 30,
        height: 4,
      }),
    }),
  }),
});

export const { useGetStoreLayoutQuery } = storeApi;
