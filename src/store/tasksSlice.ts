import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Task, Tasklist } from "../lib/gapi-wrappers";

export type State = {
  entities: { [key: string]: Task };
  // FIXME rename
  idsMap: {
    [key: string]: string[];
  };
};

export const TasksSlice = createSlice<State, SliceCaseReducers<State>>({
  name: "Tasks",
  initialState: {
    idsMap: {},
    entities: {},
  },
  reducers: {
    addTasks: (state, action: { payload: { tasks: Task[] } }) => {
      action.payload.tasks.forEach((task) => {
        state.entities[task.id] = task;
        pushId(state.idsMap, task.tasklistId, task.id);
      });
      // TODO sort
    },
  },
});

export const { addTask } = TasksSlice.actions;

export default TasksSlice.reducer;

function pushId(list: State["idsMap"], listId: Tasklist["id"], id: Task["id"]) {
  if (list[listId] === undefined) list[listId] = [];
  list[listId].push(id);
}
