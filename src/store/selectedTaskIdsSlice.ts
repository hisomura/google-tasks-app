import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { QueryClient } from "react-query";
import { deleteTasks as gapiDeleteTasks, Task } from "../lib/gapi-wrappers";
import { getTasksByIdsFromQueryClient } from "../lib/react-query-helper";
import { RootState } from "./store";

type State = { [key: string]: string };

const selectedTaskIdsSlice = createSlice<State, SliceCaseReducers<State>>({
  name: "selectedTaskIds",
  initialState: {},
  reducers: {
    addTaskIds: (state, action: { payload: string[] }) => {
      action.payload.forEach((id) => (state[id] = id));
    },
    removeTaskIds: (state, action: { payload: string[] }) => {
      action.payload.forEach((id) => delete state[id]);
    },
    removeAllTaskIds: () => ({}),
    replaceAllTaskIds: (state, action: { payload: string[] }) => {
      const newState: State = {};
      action.payload.forEach((id) => {
        newState[id] = id;
      });
      return newState;
    },
  },
});

export const { addTaskIds, removeTaskIds, removeAllTaskIds, replaceAllTaskIds } = selectedTaskIdsSlice.actions;

export default selectedTaskIdsSlice.reducer;

export const isSelectedSelector = (id: string) => (rootState: RootState) => id in rootState.selectedTaskIds;

export const selectedTaskExists = (rootState: RootState) => Object.keys(rootState.selectedTaskIds).length > 0;

// FIXME rename
export const deleteTasks = () => async (
  dispatch: Function,
  getState: Function,
  { queryClient }: { queryClient: QueryClient }
) => {
  // FIXME implement optimistic delete
  const taskIds = Object.values(getState()["selectedTaskIds"]) as string[];
  const tasks = getTasksByIdsFromQueryClient(queryClient, taskIds);
  const invalidate = createInvalidateTasks(queryClient, tasks);

  await gapiDeleteTasks(tasks);
  dispatch(removeAllTaskIds({}));
  await invalidate();
};

function createInvalidateTasks(queryClient: QueryClient, tasks: Task[]) {
  const tasklistIds = new Set(tasks.map((task) => task.tasklistId));

  return () => {
    const promises = Array.from(tasklistIds).map((tasklistId) => queryClient.invalidateQueries(["tasks", tasklistId]));
    return Promise.all(promises);
  };
}
