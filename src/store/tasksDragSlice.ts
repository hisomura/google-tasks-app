import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { QueryClient } from "react-query";
import { moveTasks, Task } from "../lib/gapi-wrappers";
import { optimisticUpdatesForMoveTasks } from "../lib/react-query-helper";
import { removeAllTaskIds } from "./selectedTaskIdsSlice";
import { RootState } from "./store";

export type TasksDragState = {
  dragState: "yet-started" | "dragging" | "drop-animation" | "cancel-animation";
  toTaskListId: string | null;
  targetTaskId?: string;
};

export const tasksDragSlice = createSlice<TasksDragState, SliceCaseReducers<TasksDragState>>({
  name: "tasksDrag",
  initialState: {
    dragState: "yet-started",
    toTaskListId: null,
    targetTaskId: undefined,
  },
  reducers: {
    dragStart: (state) => {
      state.dragState = "dragging";
    },
    updateTarget: (state, action: { payload: { toTaskListId?: string; previousTaskId?: string } }) => {
      state.toTaskListId = action.payload.toTaskListId ?? null;
      state.targetTaskId = action.payload.previousTaskId;
    },
    dropProcessStart: (state, _action: { payload: { toTaskListId: string } }) => {
      state.dragState = "drop-animation";
    },
    dragEnd: (state, _action: {}) => {
      state.dragState = "cancel-animation";
    },
    initTaskDragState: (state, _action: {}) => {
      state.dragState = "yet-started";
      state.toTaskListId = null;
      state.targetTaskId = undefined;
    },
  },
});

export const { dragStart, updateTarget, dragEnd, initTaskDragState } = tasksDragSlice.actions;

export default tasksDragSlice;

export const isDragTarget = (taskListId: string, previousTaskId?: string) => (rootState: RootState) =>
  rootState.tasksDrag.toTaskListId === taskListId && rootState.tasksDrag.targetTaskId === previousTaskId;

export const drop = (toTaskListId: string) => async (
  dispatch: Function,
  getState: Function,
  { queryClient }: { queryClient: QueryClient }
) => {
  dispatch(tasksDragSlice.actions.dropProcessStart({ toTaskListId: toTaskListId }));
  const taskIds = Object.values(getState()["selectedTaskIds"]) as string[];
  const previousTaskId = getState()["tasksDrag"].targetTaskId as string | undefined;

  const tasks = getTasksByIdsFromQueryClient(queryClient, taskIds);

  optimisticUpdatesForMoveTasks(queryClient, tasks, { taskListId: toTaskListId, prevTaskId: previousTaskId });
  await moveTasks(tasks, toTaskListId, previousTaskId);

  const taskListIds = new Set(tasks.map((task) => task.taskListId));
  taskListIds.add(toTaskListId);

  const promises = Array.from(taskListIds).map((taskListId) => queryClient.invalidateQueries(["tasks", taskListId]));
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
