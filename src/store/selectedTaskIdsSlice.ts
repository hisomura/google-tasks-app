import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

type State = { [key: string]: string };

const selectedTaskIdsSlice = createSlice<State, SliceCaseReducers<State>>({
  name: "selectedTaskIds",
  initialState: {},
  reducers: {
    addMany: (state, action: { payload: string[] }) => {
      action.payload.forEach((id) => {
        state[id] = id;
      });
    },
    removeAll: () => ({}),
    replaceAll: (state, action: { payload: string[] }) => {
      const newState: State = {};
      action.payload.forEach((id) => {
        newState[id] = id;
      });
      return newState;
    },
  },
});

export const { addMany, removeAll, replaceAll } = selectedTaskIdsSlice.actions;

export default selectedTaskIdsSlice.reducer;
