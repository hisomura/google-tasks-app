import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { moveTasksToAnotherTasklist, Task } from "../lib/gapi-wrappers";
import { original } from "immer";
import { queryClient } from "../globals";

type Offset = { x: number; y: number };

export type DragState = {
  dragState: "yet-started" | "dragging" | "drop-animation" | "cancel-animation";
  initialClientOffset: Offset | null;
  currentClientOffset: Offset | null;
  fromTasklistId: string | null;
  tasks: Task[];
};

export const tasksDragSlice = createSlice<DragState, SliceCaseReducers<DragState>>({
  name: "taskDrag",
  initialState: {
    dragState: "yet-started",
    initialClientOffset: null,
    currentClientOffset: null,
    fromTasklistId: null,
    tasks: [],
  },
  reducers: {
    dragStart: (state, action: { payload: { offset: Offset; fromTasklistId: string; task: Task } }) => {
      state.dragState = "dragging";
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;
      state.fromTasklistId = action.payload.fromTasklistId;
      state.tasks.push(action.payload.task);
    },
    updateOffset: (state, action: { payload: { offset: Offset } }) => {
      state.currentClientOffset = action.payload.offset;
    },

    drop: (state, action: { payload: { offset: Offset; toTasklistId: string } }) => {
      state.dragState = "drop-animation";
      state.currentClientOffset = action.payload.offset;
      console.log("drop payload:  ", action.payload);
      console.log(action.payload.toTasklistId);
      console.log(action.payload.offset);

      const tasks = original<Task[]>(state.tasks);
      if (!tasks || tasks.length === 0) throw Error("'tasks' is empty.");

      const fromTasklistId = state.fromTasklistId!;
      const toTasklistId = action.payload.toTasklistId;
      moveTasksToAnotherTasklist(tasks, fromTasklistId, toTasklistId).then(() => {
        queryClient.invalidateQueries(["tasklists", fromTasklistId]);
        queryClient.invalidateQueries(["tasklists", toTasklistId]);
      });

      // animation
    },
    dragEnd: (state, action: { payload: { offset: Offset } }) => {
      state.dragState = "cancel-animation";
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;
      state.tasks = [];

      // animation
    },
    initTaskDragState: (state, _action: {}) => {
      state.dragState = "yet-started";
      state.initialClientOffset = null;
      state.currentClientOffset = null;
      state.fromTasklistId = null;
      state.tasks = [];
    },
  },
});

export const { dragStart, updateOffset } = tasksDragSlice.actions;

export default tasksDragSlice;
