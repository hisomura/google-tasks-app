import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Task, Tasklist } from "../lib/gapi-wrappers";

export type State = {
  entities: { [key: string]: Task };
  // FIXME rename
  idsMap: {
    [key: string]: string[];
  };
};

export const tasksSlice = createSlice<State, SliceCaseReducers<State>>({
  name: "Tasks",
  initialState: {
    idsMap: {},
    entities: {},
  },
  reducers: {
    addTasks: (state, action: { payload: { tasks: Task[] } }) => {
      let taskIdsSet = new Set<string>();

      action.payload.tasks.forEach((task) => {
        state.entities[task.id] = task;
        pushId(state.idsMap, task.tasklistId, task.id);
        taskIdsSet.add(task.tasklistId);
      });

      taskIdsSet.forEach((tasklistId) => {
        state.idsMap[tasklistId].sort((a, b) => {
          if (a === b) {
            return 0;
          }
          return a > b ? 1 : -1;
        });
      });
    },
  },
});

export const { addTasks } = tasksSlice.actions;

export default tasksSlice.reducer;

function pushId(list: State["idsMap"], listId: Tasklist["id"], id: Task["id"]) {
  if (list[listId] === undefined) list[listId] = [];
  list[listId].push(id);
}
