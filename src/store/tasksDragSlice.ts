import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { moveTasksToAnotherTasklist, Task } from "../lib/gapi-wrappers";
import { QueryClient } from "react-query";
import { queryClient } from "../globals";

type Offset = { x: number; y: number };

export type DragState = {
  dragState: "yet-started" | "dragging" | "drop-animation" | "cancel-animation";
  initialClientOffset: Offset | null;
  currentClientOffset: Offset | null;
  taskIds: string[];
};

export const tasksDragSlice = createSlice<DragState, SliceCaseReducers<DragState>>({
  name: "taskDrag",
  initialState: {
    dragState: "yet-started",
    initialClientOffset: null,
    currentClientOffset: null,
    taskIds: [],
  },
  reducers: {
    dragStart: (state, action: { payload: { offset: Offset; taskIds: string[] } }) => {
      state.dragState = "dragging";
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;
      state.taskIds = action.payload.taskIds;
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
      state.taskIds = [];

      // animation
    },
    initTaskDragState: (state, _action: {}) => {
      state.dragState = "yet-started";
      state.initialClientOffset = null;
      state.currentClientOffset = null;
      state.taskIds = [];
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
  dispatch(tasksDragSlice.actions.dropProcessStart({ offset, toTasklistId: toTaskListId }));
  const taskIds = getState()["tasksDrag"].taskIds as string[];
  const tasks = getTasksByIdsFromQueryClient(queryClient, taskIds);
  console.log(tasks);
  await moveTasksToAnotherTasklist(tasks, toTaskListId);

  const taskListIds = new Set(tasks.map((task) => task.taskListId!));
  taskListIds.add(toTaskListId);

  const promises = Array.from(taskListIds).map((taskListId) =>
    extras.queryClient.invalidateQueries(["tasks", taskListId])
  );
  await Promise.all(promises);

  // animation
  dispatch(tasksDragSlice.actions.initTaskDragState({}));
};

function getTasksByIdsFromQueryClient(queryClient: QueryClient, ids: string[]) {
  // TODO remove ts-ignore
  // @ts-ignore
  const allTasks = queryClient
    .getQueryCache()
    .findAll("tasks")
    // TODO remove ts-ignore
    // @ts-ignore
    .reduce((acc, query) => [...acc, ...query.state.data], []) as Task[];
  return allTasks.filter((task) => ids.includes(task.id!));
}
