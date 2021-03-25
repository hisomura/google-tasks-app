import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Task, Tasklist } from "../lib/gapi-wrappers";
import { sortTasks } from "../lib/tasks";

export type State = {
  entities: { [key: string]: Task };
  // FIXME rename
  idsMap: {
    [key: string]: string[];
  };
};

const tasksSlice = createSlice<State, SliceCaseReducers<State>>({
  name: "tasks",
  initialState: {
    idsMap: {},
    entities: {},
  },
  reducers: {
    addTasks: (state, action: { payload: { tasks: Task[] } }) => {
      let tasklistIdsSet = new Set<string>();

      action.payload.tasks.forEach((task) => {
        state.entities[task.id] = task;
        pushId(state.idsMap, task.tasklistId, task.id);
        tasklistIdsSet.add(task.tasklistId);
      });

      tasklistIdsSet.forEach((tasklistId) => {
        const sortedTasks = sortTasks(getTasksByTasklistId(state, tasklistId));
        state.idsMap[tasklistId] = sortedTasks.map((task) => task.id);
      });
    },
  },
});

export const { addTasks } = tasksSlice.actions;

export default tasksSlice.reducer;

const getTasksByTasklistId = (state: State, tasklistId: string) =>
  state.idsMap[tasklistId].map((taskId) => state.entities[taskId]);

function pushId(list: State["idsMap"], listId: Tasklist["id"], id: Task["id"]) {
  if (list[listId] === undefined) list[listId] = [];
  list[listId].push(id);
}
