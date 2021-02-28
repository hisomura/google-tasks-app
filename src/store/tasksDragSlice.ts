import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { QueryClient } from "react-query";
import { moveTasks, Task } from "../lib/gapi-wrappers";
import { optimisticUpdatesForMoveTasks } from "../lib/react-query-helper";
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

  // FIXME consider subtask.
  optimisticUpdatesForMoveTasks(queryClient, tasks, { tasklistId: toTasklistId, prevTaskId: targetTask?.id });
  await moveTasks(tasks, toTasklistId, targetTask, onLeft);

  const tasklistIds = new Set(tasks.map((task) => task.tasklistId));
  tasklistIds.add(toTasklistId);

  const promises = Array.from(tasklistIds).map((tasklistId) => queryClient.invalidateQueries(["tasks", tasklistId]));
  await Promise.all(promises);

  // animation
  dispatch(tasksDragSlice.actions.initTaskDragState({}));
  dispatch(removeAllTaskIds({}));
};

function getTasksByIdsFromQueryClient(queryClient: QueryClient, ids: string[]) {
  queryClient.getQueryCache().findAll("tasks");
  // @ts-ignore
  const allTasks = queryClient
    .getQueryCache()
    .findAll("tasks")
    // @ts-ignore
    .reduce((acc, query) => [...acc, ...query.state.data], []) as Task[];
  return allTasks.filter((task) => ids.includes(task.id));
}
