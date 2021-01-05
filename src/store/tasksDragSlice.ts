import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { moveTasksToAnotherTasklist, Task } from "../lib/gapi-wrappers";
import { QueryClient } from "react-query";
import { queryClient } from "../globals";

type Offset = { x: number; y: number };

export type DragState = {
  dragState: "yet-started" | "dragging" | "drop-animation" | "cancel-animation";
  initialClientOffset: Offset | null;
  currentClientOffset: Offset | null;
  tasks: Task[];
};

export const tasksDragSlice = createSlice<DragState, SliceCaseReducers<DragState>>({
  name: "taskDrag",
  initialState: {
    dragState: "yet-started",
    initialClientOffset: null,
    currentClientOffset: null,
    tasks: [],
  },
  reducers: {
    dragStart: (state, action: { payload: { offset: Offset; tasks: Task[] } }) => {
      state.dragState = "dragging";
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;
      state.tasks = action.payload.tasks;
    },
    updateOffset: (state, action: { payload: { offset: Offset } }) => {
      state.currentClientOffset = action.payload.offset;
    },
    dropProcessStart: (state, action: { payload: { offset: Offset; toTasklistId: string } }) => {
      state.dragState = "drop-animation";
      state.currentClientOffset = action.payload.offset;
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
      state.tasks = [];
    },
  },
});

export const { dragStart, updateOffset, dragEnd } = tasksDragSlice.actions;

export default tasksDragSlice;

export const drop = (offset: Offset, toTaskListId: string) => async (
  dispatch: Function,
  getState: Function,
  extras: { queryClient: QueryClient }
) => {
  console.log(extras);
  dispatch(tasksDragSlice.actions.dropProcessStart({ offset, toTasklistId: toTaskListId }));
  const tasks = getState()["tasksDrag"].tasks as Task[];
  if (!tasks || tasks.length === 0) throw Error("'tasks' is empty.");

  console.log(getAllTasksFromQueryClient(queryClient));
  await moveTasksToAnotherTasklist(tasks, toTaskListId);
  const taskListIds = new Set(tasks.map((task) => task.taskListId));
  taskListIds.add(toTaskListId);

  const promises = Array.from(taskListIds).map((taskListId) =>
    extras.queryClient.invalidateQueries(["tasks", taskListId])
  );
  await Promise.all(promises);

  // animation
  dispatch(tasksDragSlice.actions.initTaskDragState({}));
};

function getAllTasksFromQueryClient(queryClient: QueryClient) {
  return queryClient
    .getQueryCache()
    .findAll("tasks")
    // TODO remove ts-ignore
    // @ts-ignore
    .reduce((acc, query) => [...acc, ...query.state.data], []);
}
