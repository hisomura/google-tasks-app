import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import tasksDragSlice from "./tasksDragSlice";
import { selectedTasksSlice } from "./selectedTasksSlice";
import { queryClient } from "../globals";

export const rootReducer = combineReducers({
  selectedTasks: selectedTasksSlice.reducer,
  tasksDrag: tasksDragSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    // https://github.com/reduxjs/redux-toolkit/issues/518
    thunk: { extraArgument: { queryClient } },
  }),
});

export default store;
