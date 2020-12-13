import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Task } from "../lib/gapi-wrappers";

type Offset = { x: number; y: number };

export type DragState = {
  initialClientOffset: Offset | null;
  currentClientOffset: Offset | null;
  dragState: "yetstarted" | "dragging" | "dropeffect" | "finished";
  fromTaskListId: string | null;
  tasks: Task[];
};

export const tasksDragSlice = createSlice<DragState, SliceCaseReducers<DragState>>({
  name: "taskDrag",
  initialState: {
    initialClientOffset: null,
    currentClientOffset: null,
    dragState: "yetstarted",
    fromTaskListId: null,
    tasks: [],
  },
  reducers: {
    dragStart: (state, action: { payload: { offset: Offset; fromTaskListId: string; task: Task } }) => {
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;
      state.fromTaskListId = action.payload.fromTaskListId;
      state.dragState = "dragging";
      state.tasks.push(action.payload.task);
    },
  },
});

export const { dragStart } = tasksDragSlice.actions;

export default tasksDragSlice;
