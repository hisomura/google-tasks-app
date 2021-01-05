import { createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { Task } from "../lib/gapi-wrappers";

const selectedTasksAdapter = createEntityAdapter<Task>();

export const selectedTasksSlice = createSlice({
  name: "selectedTasks",
  initialState: selectedTasksAdapter.getInitialState(),
  reducers: {
    addOne: selectedTasksAdapter.addOne,
    addMany: selectedTasksAdapter.addMany,
    removeMany: selectedTasksAdapter.removeMany,
    removeAll: selectedTasksAdapter.removeAll,
    removeAllAndAddOne: (state, action: { payload: Task }) => {
      selectedTasksAdapter.removeAll(state);
      selectedTasksAdapter.addOne(state, action.payload);
    },
  },
});

export const { addMany, removeMany, removeAll, removeAllAndAddOne } = selectedTasksSlice.actions;

export const isSelectedSelector = (id: string) => ({ selectedTasks }: { selectedTasks: EntityState<Task> }) =>
  selectedTasks.entities[id] !== undefined;

export const selectedTasksSelector = ({ selectedTasks }: { selectedTasks: EntityState<Task> }) => Object.values(selectedTasks.entities)

export default selectedTasksSlice.reducer;