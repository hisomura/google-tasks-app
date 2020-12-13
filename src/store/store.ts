import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tasksDragSlice from "./tasksDragSlice";

export const rootReducer = combineReducers({
  tasksDrag: tasksDragSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });
export default store;
