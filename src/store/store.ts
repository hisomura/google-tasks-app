import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tasksDragSlice from "./tasksDragSlice";
import { selectedTasksSlice } from "./selectedTasksSlice";

export const rootReducer = combineReducers({
  selectedTasks: selectedTasksSlice.reducer,
  tasksDrag: tasksDragSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });
export default store;
