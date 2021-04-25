import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { queryClient } from "../globals";
import { tasklistsApi, tasksApi } from "./queries";
import selectedTaskIdsSlice from "./selectedTaskIdsSlice";
import tasksDragSlice from "./tasksDragSlice";
import tasksSlice from "./tasksSlice";

export const rootReducer = combineReducers({
  selectedTaskIds: selectedTaskIdsSlice,
  tasksDrag: tasksDragSlice.reducer,
  tasks: tasksSlice,
  tasklistsApi: tasklistsApi.reducer,
  tasksApi: tasksApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: { queryClient } },
    }).concat(tasklistsApi.middleware),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
