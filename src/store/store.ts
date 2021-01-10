import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import tasksDragSlice from "./tasksDragSlice";
import { queryClient } from "../globals";
import selectedTaskIdsSlice from "./selectedTaskIdsSlice";

export const rootReducer = combineReducers({
  selectedTaskIds: selectedTaskIdsSlice,
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
