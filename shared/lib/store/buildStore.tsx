import {
  CreateSliceOptions,
  SliceCaseReducers,
  bindActionCreators,
  createSlice,
} from "@reduxjs/toolkit";
import { useAppDispatch } from "../../hooks/use-app-dispatch";
import { useMemo } from "react";

export const buildSlice = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string = string
>(
  options: CreateSliceOptions<State, CaseReducers, Name>
) => {
  const slice = createSlice(options);

  const useActions = () => {
    const dispatch = useAppDispatch();

    return useMemo(
      () => bindActionCreators(slice.actions, dispatch),
      [dispatch]
    );
  };

  return {
    ...slice,
    useActions,
  };
};
