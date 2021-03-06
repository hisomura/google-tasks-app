import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { QueryClient } from "react-query";
import { moveTasks, Tasklist } from "../lib/gapi-wrappers";
import { getTasksByIdsFromQueryClient, optimisticUpdatesForMoveTasks } from "../lib/react-query-helper";
import { sortTasksWithTasklistOrder } from "../lib/tasks";
import { removeAllTaskIds } from "./selectedTaskIdsSlice";
import { RootState } from "./store";

export type TasksDragState = {
  dragState: "yet-started" | "dragging" | "drop-animation" | "cancel-animation";
  toTasklistId: string | null;
  targetTaskId?: string;
  onLeft?: boolean;
};

export const tasksDragSlice = createSlice<TasksDragState, SliceCaseReducers<TasksDragState>>({
  name: "tasksDrag",
  initialState: {
    dragState: "yet-started",
    toTasklistId: null,
    targetTaskId: undefined,
    onLeft: undefined,
  },
  reducers: {
    dragStart: (state) => {
      state.dragState = "dragging";
    },
    updateTarget: (state, action: { payload: { toTasklistId?: string; targetTaskId?: string; onLeft?: boolean } }) => {
      state.toTasklistId = action.payload.toTasklistId ?? null;
      state.targetTaskId = action.payload.targetTaskId;
      state.onLeft = action.payload.onLeft;
    },
    dropProcessStart: (state, _action: { payload: { toTasklistId: string } }) => {
      state.dragState = "drop-animation";
    },
    dragEnd: (state, _action: {}) => {
      state.dragState = "cancel-animation";
    },
    initTaskDragState: (state, _action: {}) => {
      state.dragState = "yet-started";
      state.toTasklistId = null;
      state.targetTaskId = undefined;
      state.onLeft = undefined;
    },
  },
});

export const { dragStart, updateTarget, dragEnd, initTaskDragState } = tasksDragSlice.actions;

export default tasksDragSlice;

export const isDragTarget = (tasklistId: string, previousTaskId?: string) => (rootState: RootState) =>
  rootState.tasksDrag.toTasklistId === tasklistId && rootState.tasksDrag.targetTaskId === previousTaskId;

export const drop = (toTasklistId: string) => async (
  dispatch: Function,
  getState: Function,
  { queryClient }: { queryClient: QueryClient }
) => {
  dispatch(tasksDragSlice.actions.dropProcessStart({ toTasklistId: toTasklistId }));
  const taskIds = Object.values(getState()["selectedTaskIds"]) as string[];
  const targetTaskId = getState()["tasksDrag"].targetTaskId as string | undefined;
  const onLeft = getState()["tasksDrag"].onLeft as boolean | undefined;

  const tasks = getTasksByIdsFromQueryClient(queryClient, taskIds);
  let targetTask;
  if (targetTaskId) {
    const result = getTasksByIdsFromQueryClient(queryClient, [targetTaskId]);
    targetTask = result[0];
  }

  const tasklists = queryClient.getQueryData<Tasklist[]>("tasklists");
  if (!tasklists) throw new Error("Not found Tasklists cache.");
  const sortedTasks = sortTasksWithTasklistOrder(tasklists, tasks);

  optimisticUpdatesForMoveTasks(queryClient, sortedTasks, toTasklistId, targetTask, onLeft);
  await moveTasks(sortedTasks, toTasklistId, targetTask, onLeft);

  const tasklistIds = new Set(tasks.map((task) => task.tasklistId));
  tasklistIds.add(toTasklistId);

  const promises = Array.from(tasklistIds).map((tasklistId) => queryClient.invalidateQueries(["tasks", tasklistId]));
  await Promise.all(promises);

  // animation
  dispatch(tasksDragSlice.actions.initTaskDragState({}));
  dispatch(removeAllTaskIds({}));
};
