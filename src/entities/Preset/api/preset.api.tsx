import { Preset } from "../model/types/Preset";
import { CreatePresetDto } from "./dto/createPreset";
import { storeApi } from "@/shared/api/storeApi";

const presetApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getPresets: builder.query<Preset[], void>({
      query: () => "/presets",
    }),
    getPresetById: builder.query<Preset, string>({
      query: (id) => `/presets/${id}`,
    }),
    createPreset: builder.mutation<Preset, CreatePresetDto>({
      query: (newPreset) => ({
        url: "/presets",
        method: "POST",
        body: newPreset,
      }),
    }),
    updatePreset: builder.mutation<
      Preset,
      { id: string } & Partial<CreatePresetDto>
    >({
      query: ({ id, ...updatedPreset }) => ({
        url: `/presets/${id}`,
        method: "PUT",
        body: updatedPreset,
      }),
    }),
    deletePreset: builder.mutation<Preset, string>({
      query: (id) => ({
        url: `/presets/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetPresetsQuery,
  useGetPresetByIdQuery,
  useCreatePresetMutation,
  useUpdatePresetMutation,
  useDeletePresetMutation,
} = presetApi;

export default presetApi;
