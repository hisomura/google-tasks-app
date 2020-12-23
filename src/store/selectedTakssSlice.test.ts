import selectedTasks, { addMany } from "./selectedTasksSlice";

describe("selectedTasksSlice", () => {
  test("selects tasks", () => {
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
});
