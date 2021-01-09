import selectedTaskIds, { addMany, removeAll, replaceAll } from "./selectedTaskIdsSlice";

describe("selectedTasksSlice", () => {
  test("adds ids", () => {
    const nextState = selectedTaskIds({"task-0": "task-0"}, {type: addMany.type, payload: ["task-1", "task-2"]});
    expect(nextState).toEqual({"task-0": "task-0", "task-1": "task-1", "task-2": "task-2"});
  });

  test("removes all ids", () => {
    const nextState = selectedTaskIds({"task-1": "task-1", "task-2": "task-2"}, {type: removeAll.type});
    expect(nextState).toEqual({});
  });

  test("removes all ids", () => {
    const nextState = selectedTaskIds(
      {"task-1": "task-1", "task-2": "task-2"},
      {type: replaceAll.type, payload: ["task-3"]}
    );
    expect(nextState).toEqual({"task-3": "task-3"});
  });
});
