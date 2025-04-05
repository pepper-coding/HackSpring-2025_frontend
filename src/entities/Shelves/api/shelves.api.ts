import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shelfApi = createApi({
  reducerPath: "shelfApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getShelves: builder.query({
      query: () => "/shelves",
    }),
    getShelfById: builder.query({
      query: (id) => `/shelves/${id}`,
    }),
    createShelf: builder.mutation({
      query: (newShelf) => ({
        url: "/shelves",
        method: "POST",
        body: newShelf,
      }),
    }),
    updateShelf: builder.mutation({
      query: ({ id, ...updatedShelf }) => ({
        url: `/shelves/${id}`,
        method: "PUT",
        body: updatedShelf,
      }),
    }),
    deleteShelf: builder.mutation({
      query: (id) => ({
        url: `/shelves/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetShelvesQuery,
  useGetShelfByIdQuery,
  useCreateShelfMutation,
  useUpdateShelfMutation,
  useDeleteShelfMutation,
} = shelfApi;

export default shelfApi;
