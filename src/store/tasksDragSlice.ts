import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { moveTasks, Task } from "../lib/gapi-wrappers";
import { QueryClient } from "react-query";
import { removeAllTaskIds } from "./selectedTaskIdsSlice";

type Offset = { x: number; y: number };

export type TasksDragState = {
  dragState: "yet-started" | "dragging" | "drop-animation" | "cancel-animation";
  initialClientOffset: Offset | null;
  currentClientOffset: Offset | null;
  toTaskListId: string | null;
  targetTaskId?: string;
};

export const tasksDragSlice = createSlice<TasksDragState, SliceCaseReducers<TasksDragState>>({
  name: "tasksDrag",
  initialState: {
    dragState: "yet-started",
    initialClientOffset: null,
    currentClientOffset: null,
    toTaskListId: null,
    targetTaskId: undefined,
  },
  reducers: {
    dragStart: (state, action: { payload: { offset: Offset } }) => {
      state.dragState = "dragging";
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;
    },
    updateTarget: (state, action: { payload: { toTaskListId?: string; previousTaskId?: string } }) => {
      state.toTaskListId = action.payload.toTaskListId ?? null;
      state.targetTaskId = action.payload.previousTaskId;
    },
    updateOffset: (state, action: { payload: { offset: Offset } }) => {
      state.currentClientOffset = action.payload.offset;
    },
    dropProcessStart: (state, action: { payload: { offset: Offset; toTaskListId: string } }) => {
      state.dragState = "drop-animation";
      state.currentClientOffset = action.payload.offset;
    },
    dragEnd: (state, action: { payload: { offset: Offset } }) => {
      state.dragState = "cancel-animation";
      state.initialClientOffset = action.payload.offset;
      state.currentClientOffset = action.payload.offset;

      // animation
    },
    initTaskDragState: (state, _action: {}) => {
      state.dragState = "yet-started";
      state.initialClientOffset = null;
      state.currentClientOffset = null;
      state.toTaskListId = null;
      state.targetTaskId = undefined;
    },
  },
});

export const { dragStart, updateTarget, updateOffset, dragEnd, initTaskDragState } = tasksDragSlice.actions;

export default tasksDragSlice;

export const isDragTarget = (taskListId: string, previousTaskId?: string) => (rootState: {
  tasksDrag: TasksDragState;
}) => rootState.tasksDrag.toTaskListId === taskListId && rootState.tasksDrag.targetTaskId === previousTaskId;

export const drop = (offset: Offset, toTaskListId: string) => async (
  dispatch: Function,
  getState: Function,
  extras: { queryClient: QueryClient }
) => {
  dispatch(tasksDragSlice.actions.dropProcessStart({ offset, toTaskListId: toTaskListId }));
  const taskIds = Object.values(getState()["selectedTaskIds"]) as string[];
  const toTaskListId2 = getState()["tasksDrag"].toTaskListId as string | null;
  const previousTaskId = getState()["tasksDrag"].targetTaskId as string | undefined;

  const tasks = getTasksByIdsFromQueryClient(extras.queryClient, taskIds);

  console.log(tasks, toTaskListId, toTaskListId2);
  await moveTasks(tasks, toTaskListId, previousTaskId);

  const taskListIds = new Set(tasks.map((task) => task.taskListId!));
  taskListIds.add(toTaskListId);

  const promises = Array.from(taskListIds).map((taskListId) =>
    extras.queryClient.invalidateQueries(["tasks", taskListId])
  );
  await Promise.all(promises);

  // animation
  dispatch(tasksDragSlice.actions.initTaskDragState({}));
  dispatch(removeAllTaskIds({}));
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
