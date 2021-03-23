import tasksSlice, { addTasks, State } from "./tasksSlice";

describe("tasksSlice", () => {
  test("adds tasks to the initial state", () => {
    const state: State = {
      idsMap: {},
      entities: {},
    };
    const action = {
      type: addTasks.type,
      payload: {
        tasks: [
          { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
          { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
          { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
          { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
          { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
        ],
      },
    };
    const nextState = tasksSlice(state, action);
    expect(nextState.idsMap["list-1"]).toEqual(["task-0", "task-1", "task-2", "task-3", "task-4"]);
  });
});
