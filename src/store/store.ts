import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { queryClient } from "../globals";
import selectedTaskIdsSlice from "./selectedTaskIdsSlice";
import tasksDragSlice from "./tasksDragSlice";

export const rootReducer = combineReducers({
  selectedTaskIds: selectedTaskIdsSlice,
  tasksDrag: tasksDragSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: { extraArgument: { queryClient } },
    }),
});

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
