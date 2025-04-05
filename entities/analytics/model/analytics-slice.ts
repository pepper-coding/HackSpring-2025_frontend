import { buildSlice } from "@/shared/lib/store/buildStore";
import { type PayloadAction } from "@reduxjs/toolkit";

interface ShelfInteraction {
  shelfId: string;
  count: number;
}

interface AnalyticsState {
  shelfInteractions: Record<string, number>;
  timeData: {
    labels: string[];
    datasets: {
      shelfId: string;
      data: number[];
    }[];
  };
}

const initialState: AnalyticsState = {
  shelfInteractions: {},
  timeData: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [],
  },
};

export const analyticsSlice = buildSlice({
  name: "analytics",
  initialState,
  reducers: {
    recordInteraction: (state, action: PayloadAction<string>) => {
      const shelfId = action.payload;
      if (!state.shelfInteractions[shelfId]) {
        state.shelfInteractions[shelfId] = 0;
      }
      state.shelfInteractions[shelfId] += 1;

      // Add to time data
      const hour = new Date().getHours();
      const existingDataset = state.timeData.datasets.find(
        (ds) => ds.shelfId === shelfId
      );

      if (existingDataset) {
        existingDataset.data[hour] += 1;
      } else {
        const newDataset = {
          shelfId,
          data: Array(24).fill(0),
        };
        newDataset.data[hour] = 1;
        state.timeData.datasets.push(newDataset);
      }
    },
    resetAnalytics: (state) => {
      state.shelfInteractions = {};
      state.timeData.datasets = [];
    },
  },
});

export const { reducer: analyticsReducer, useActions: useAnalyticsActions } =
  analyticsSlice;
