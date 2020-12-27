import { createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
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

export const isSelectedSelector = (id: string) => ({ selectedTasks }: { selectedTasks: EntityState<Task> }) =>
  selectedTasks.entities[id] !== undefined;

export default selectedTasksSlice.reducer;
