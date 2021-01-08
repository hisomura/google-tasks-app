import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

const selectedTaskIdsSlice = createSlice<string[], SliceCaseReducers<string[]>>({
  name: "selectedTaskIds",
  initialState: [],
  reducers: {
    addMany: (state, action: { payload: string[] }) => {
      return Array.from(new Set(action.payload.concat(state)));
    },
    removeAll: () => [],
    replaceAll: (state, action: { payload: string[] }) => Array.from(new Set(action.payload)),
  },
});

export const { addMany, removeAll, replaceAll } = selectedTaskIdsSlice.actions;

export default selectedTaskIdsSlice.reducer;
