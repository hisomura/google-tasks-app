import selectedTasks, { addMany, removeMany } from "./selectedTasksSlice";

describe("selectedTasksSlice", () => {
  test("adds tasks", () => {
    const nextState = selectedTasks(
      { ids: [], entities: {} },
      {
        type: addMany.type,
        payload: [
          { taskListId: "TaskList-1", id: "task-1", title: "Hello" },
          { taskListId: "TaskList-1", id: "task-2", title: "World" },
        ],
      }
    );
    expect(nextState.ids).toEqual(["task-1", "task-2"]);
    expect(nextState.entities["task-1"]).toEqual({ taskListId: "TaskList-1", id: "task-1", title: "Hello" });
  });

  test("remove tasks", () => {
    const nextState = selectedTasks(
      {
        ids: ["task-1", "task-2"],
        entities: {
          "task-1": { taskListId: "TaskList-1", id: "task-1", title: "Hello" },
          "task-2": { taskListId: "TaskList-1", id: "task-2", title: "World" },
        },
      },
      {
        type: removeMany.type,
        payload: ["task-1"],
      }
    );
    expect(nextState.ids).toEqual(["task-2"]);
    expect(nextState.entities["task-1"]).toBeUndefined();
  });
});
