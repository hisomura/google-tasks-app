import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { moveTasks, Task } from "../lib/gapi-wrappers";
import { QueryClient } from "react-query";
import { removeAllTaskIds } from "./selectedTaskIdsSlice";

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

export const isDragTarget = (taskListId: string, previousTaskId?: string) => (rootState: {
  tasksDrag: TasksDragState;
}) => rootState.tasksDrag.toTaskListId === taskListId && rootState.tasksDrag.targetTaskId === previousTaskId;

export const drop = (toTaskListId: string) => async (
  dispatch: Function,
  getState: Function,
  extras: { queryClient: QueryClient }
) => {
  dispatch(tasksDragSlice.actions.dropProcessStart({ toTaskListId: toTaskListId }));
  const taskIds = Object.values(getState()["selectedTaskIds"]) as string[];
  const toTaskListId2 = getState()["tasksDrag"].toTaskListId as string | null;
  const previousTaskId = getState()["tasksDrag"].targetTaskId as string | undefined;

  const tasks = getTasksByIdsFromQueryClient(extras.queryClient, taskIds);

  console.log(tasks, toTaskListId, toTaskListId2);
  await moveTasks(tasks, toTaskListId, previousTaskId);

  const taskListIds = new Set(tasks.map((task) => task.taskListId));
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
  return allTasks.filter((task) => ids.includes(task.id));
}
