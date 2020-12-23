import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Task } from "../lib/gapi-wrappers";

const selectedTasksAdapter = createEntityAdapter<Task>();

export const selectedTasksSlice = createSlice({
  name: "selectedTasks",
  initialState: selectedTasksAdapter.getInitialState(),
  reducers: {
    addMany: selectedTasksAdapter.addMany,
    removeMany: selectedTasksAdapter.removeMany,
    removeAll: selectedTasksAdapter.removeAll,
  },
});

export const { addMany, removeMany, removeAll } = selectedTasksSlice.actions;

export default selectedTasksSlice.reducer;
