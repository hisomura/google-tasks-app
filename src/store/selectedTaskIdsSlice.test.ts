import selectedTaskIds, { addTaskIds, removeAllTaskIds, replaceAllTaskIds } from "./selectedTaskIdsSlice";

describe("selectedTasksSlice", () => {
  test("adds ids", () => {
    const nextState = selectedTaskIds({"task-0": "task-0"}, {type: addTaskIds.type, payload: ["task-1", "task-2"]});
    expect(nextState).toEqual({"task-0": "task-0", "task-1": "task-1", "task-2": "task-2"});
  });

  test("removes all ids", () => {
    const nextState = selectedTaskIds({"task-1": "task-1", "task-2": "task-2"}, {type: removeAllTaskIds.type});
    expect(nextState).toEqual({});
  });

  test("removes all ids", () => {
    const nextState = selectedTaskIds(
      {"task-1": "task-1", "task-2": "task-2"},
      {type: replaceAllTaskIds.type, payload: ["task-3"]}
    );
    expect(nextState).toEqual({"task-3": "task-3"});
  });
});
