import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

type State = { [key: string]: string };

const selectedTaskIdsSlice = createSlice<State, SliceCaseReducers<State>>({
  name: "selectedTaskIds",
  initialState: {},
  reducers: {
    addTaskIds: (state, action: { payload: string[] }) => {
      action.payload.forEach((id) => (state[id] = id));
    },
    removeTaskIds: (state, action: { payload: string[] }) => {
      action.payload.forEach((id) => delete state[id]);
    },
    removeAllTaskIds: () => ({}),
    replaceAllTaskIds: (state, action: { payload: string[] }) => {
      const newState: State = {};
      action.payload.forEach((id) => {
        newState[id] = id;
      });
      return newState;
    },
  },
});

export const { addTaskIds, removeTaskIds, removeAllTaskIds, replaceAllTaskIds } = selectedTaskIdsSlice.actions;

export default selectedTaskIdsSlice.reducer;

export const isSelectedSelector = (id: string) => (rootState: { selectedTaskIds: State }) =>
  id in rootState.selectedTaskIds;