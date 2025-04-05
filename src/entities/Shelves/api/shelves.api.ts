import { storeApi } from "@/shared/api/storeApi";
import { Shelf, ShelfSize, ShelfType } from "../model/shelvesSlice";

const shelfApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getShelves: builder.query({
      query: () => "/shelves",
    }),
    getShelfById: builder.query({
      query: (id) => `/shelves/${id}`,
    }),
    createShelf: builder.mutation<
      Shelf,
      {
        name: string;
        type: ShelfType;
        size: ShelfSize;
        x: number;
        y: number;
        presetId: string;
      }
    >({
      query: (newShelf) => ({
        url: "/shelves",
        method: "POST",
        body: newShelf,
      }),
    }),
    updateShelf: builder.mutation<
      Shelf,
      {
        id: string;
      } & Partial<{
        name: string;
        type: ShelfType;
        size: ShelfSize;
        x: number;
        y: number;
        presetId: string;
      }>
    >({
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
