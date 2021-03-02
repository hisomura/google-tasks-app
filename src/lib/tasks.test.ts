import { Task } from "./gapi-wrappers";
import { getNextParentAndPrevious, createTasksMap, sortTasks } from "./tasks";

describe("sortTasks()", () => {
  it("sorts tasks which includes subtasks", () => {
    const input: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "subtask-6-1", parent: "task-6" },
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "subtask-1-0", parent: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000006", id: "task-6" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "subtask-1-1", parent: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "subtask-1-2", parent: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "subtask-3-0", parent: "task-3" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "subtask-6-0", parent: "task-6" },
      { tasklistId: "list-1", position: "00000000000000000005", id: "task-5" },
    ];
    const result = sortTasks(input);
    const expected: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "subtask-1-0", parent: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "subtask-1-1", parent: "task-1" },
      {
        tasklistId: "list-1",
        position: "00000000000000000002",
        id: "subtask-1-2",
        parent: "task-1",
        isLastChild: true,
      },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
      {
        tasklistId: "list-1",
        position: "00000000000000000000",
        id: "subtask-3-0",
        parent: "task-3",
        isLastChild: true,
      },
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000005", id: "task-5" },
      { tasklistId: "list-1", position: "00000000000000000006", id: "task-6" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "subtask-6-0", parent: "task-6" },
      {
        tasklistId: "list-1",
        position: "00000000000000000001",
        id: "subtask-6-1",
        parent: "task-6",
        isLastChild: true,
      },
    ];
    expect(result).toEqual(expected);
  });

  it("sorts tasks with temporary tasks", () => {
    const input: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "000000000000000000020", id: "temporary-task-2-1" },
      { tasklistId: "list-1", position: "000000000000000000021", id: "temporary-task-2-2" },
    ];
    const result = sortTasks(input);
    expect(result).toEqual([
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "000000000000000000020", id: "temporary-task-2-1" },
      { tasklistId: "list-1", position: "000000000000000000021", id: "temporary-task-2-2" },
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
    ]);
  });
});

describe("createTasksMap()", () => {
  it("creates tasks map by tasklist id", () => {
    const input: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1-1" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-1-2" },
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-1-3" },
      { tasklistId: "list-2", position: "00000000000000000006", id: "task-2-1" },
      { tasklistId: "list-3", position: "00000000000000000000", id: "task-3-1" },
      { tasklistId: "list-6", position: "00000000000000000001", id: "task-6-1" },
    ];
    const result = createTasksMap(input);
    expect(result).toEqual(
      new Map<string, Task[]>([
        [
          "list-1",
          [
            { tasklistId: "list-1", position: "00000000000000000001", id: "task-1-1" },
            { tasklistId: "list-1", position: "00000000000000000002", id: "task-1-2" },
            { tasklistId: "list-1", position: "00000000000000000003", id: "task-1-3" },
          ],
        ],
        ["list-2", [{ tasklistId: "list-2", position: "00000000000000000006", id: "task-2-1" }]],
        ["list-3", [{ tasklistId: "list-3", position: "00000000000000000000", id: "task-3-1" }]],
        ["list-6", [{ tasklistId: "list-6", position: "00000000000000000001", id: "task-6-1" }]],
      ])
    );
  });
});

describe("test", () => {
  it("when target task is undefined", () => {
    const task = undefined;
    const expected = { parent: undefined, previous: undefined };
    expect(getNextParentAndPrevious(task, true)).toEqual(expected);
    expect(getNextParentAndPrevious(task, false)).toEqual(expected);
  });

  it("when target task is top level and onLeft is true", () => {
    const task = { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" };
    const onLeft = true;
    const expected = { parent: undefined, previous: task.id };
    expect(getNextParentAndPrevious(task, onLeft)).toEqual(expected);
  });

  it("when target task is top level and onLeft is false", () => {
    const task = { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" };
    const onLeft = false;
    const expected = { parent: task.id, previous: undefined };
    expect(getNextParentAndPrevious(task, onLeft)).toEqual(expected);
  });

  it("when target task is subtask and not last in children", () => {
    const task = { tasklistId: "list-1", position: "00000000000000000000", id: "task-0-1", parent: "task-0" };
    const expected = { parent: task.parent, previous: "task-0-1" };
    expect(getNextParentAndPrevious(task, true)).toEqual(expected);
    expect(getNextParentAndPrevious(task, false)).toEqual(expected);
  });

  it("when target task is last subtask and onLeft is false ", () => {
    const task = {
      tasklistId: "list-1",
      position: "00000000000000000000",
      id: "task-0-1",
      parent: "task-0",
      isLastChild: true,
    };
    const onLeft = false;
    const expected = { parent: task.parent, previous: "task-0-1" };
    expect(getNextParentAndPrevious(task, onLeft)).toEqual(expected);
  });

  it("when target task is last subtask and onLeft is true ", () => {
    const task = {
      tasklistId: "list-1",
      position: "00000000000000000000",
      id: "task-0-1",
      parent: "task-0",
      isLastChild: true,
    };
    const onLeft = true;
    const expected = { parent: undefined, previous: task.parent };
    expect(getNextParentAndPrevious(task, onLeft)).toEqual(expected);
  });
});
