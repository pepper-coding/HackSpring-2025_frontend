import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL + "/api",
  }),
  tagTypes: ["Store", "Shelves", "Customers", "Analytics"],
  endpoints: (builder) => ({}),
});
