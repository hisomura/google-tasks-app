import { Task } from "./gapi-wrappers";
import { createTasksMap, sortTasks } from "./tasks";

describe("sortTasks()", () => {
  it("sorts tasks which includes subtasks", () => {
    const input: Task[] = [
      { taskListId: "list-1", position: "00000000000000000003", id: "task-3" },
      { taskListId: "list-1", position: "00000000000000000001", id: "subtask-6-1", parent: "task-6" },
      { taskListId: "list-1", position: "00000000000000000004", id: "task-4" },
      { taskListId: "list-1", position: "00000000000000000000", id: "subtask-1-0", parent: "task-1" },
      { taskListId: "list-1", position: "00000000000000000006", id: "task-6" },
      { taskListId: "list-1", position: "00000000000000000001", id: "task-1" },
      { taskListId: "list-1", position: "00000000000000000000", id: "task-0" },
      { taskListId: "list-1", position: "00000000000000000002", id: "task-2" },
      { taskListId: "list-1", position: "00000000000000000001", id: "subtask-1-1", parent: "task-1" },
      { taskListId: "list-1", position: "00000000000000000002", id: "subtask-1-2", parent: "task-1" },
      { taskListId: "list-1", position: "00000000000000000000", id: "subtask-3-0", parent: "task-3" },
      { taskListId: "list-1", position: "00000000000000000000", id: "subtask-6-0", parent: "task-6" },
      { taskListId: "list-1", position: "00000000000000000005", id: "task-5" },
    ];
    const result = sortTasks(input);
    expect(result).toEqual([
      { taskListId: "list-1", position: "00000000000000000000", id: "task-0" },
      { taskListId: "list-1", position: "00000000000000000001", id: "task-1" },
      { taskListId: "list-1", position: "00000000000000000000", id: "subtask-1-0", parent: "task-1" },
      { taskListId: "list-1", position: "00000000000000000001", id: "subtask-1-1", parent: "task-1" },
      { taskListId: "list-1", position: "00000000000000000002", id: "subtask-1-2", parent: "task-1" },
      { taskListId: "list-1", position: "00000000000000000002", id: "task-2" },
      { taskListId: "list-1", position: "00000000000000000003", id: "task-3" },
      { taskListId: "list-1", position: "00000000000000000000", id: "subtask-3-0", parent: "task-3" },
      { taskListId: "list-1", position: "00000000000000000004", id: "task-4" },
      { taskListId: "list-1", position: "00000000000000000005", id: "task-5" },
      { taskListId: "list-1", position: "00000000000000000006", id: "task-6" },
      { taskListId: "list-1", position: "00000000000000000000", id: "subtask-6-0", parent: "task-6" },
      { taskListId: "list-1", position: "00000000000000000001", id: "subtask-6-1", parent: "task-6" },
    ]);
  });

  it("sorts tasks which includes subtasks", () => {
    const input: Task[] = [
      { taskListId: "list-1", position: "00000000000000000003", id: "task-3" },
      { taskListId: "list-1", position: "00000000000000000004", id: "task-4" },
      { taskListId: "list-1", position: "00000000000000000001", id: "task-1" },
      { taskListId: "list-1", position: "00000000000000000000", id: "task-0" },
      { taskListId: "list-1", position: "00000000000000000002", id: "task-2" },
      { taskListId: "list-1", position: "000000000000000000020", id: "temporary-task-2-1" },
      { taskListId: "list-1", position: "000000000000000000021", id: "temporary-task-2-2" },
    ];
    const result = sortTasks(input);
    expect(result).toEqual([
      { taskListId: "list-1", position: "00000000000000000000", id: "task-0" },
      { taskListId: "list-1", position: "00000000000000000001", id: "task-1" },
      { taskListId: "list-1", position: "00000000000000000002", id: "task-2" },
      { taskListId: "list-1", position: "000000000000000000020", id: "temporary-task-2-1" },
      { taskListId: "list-1", position: "000000000000000000021", id: "temporary-task-2-2" },
      { taskListId: "list-1", position: "00000000000000000003", id: "task-3" },
      { taskListId: "list-1", position: "00000000000000000004", id: "task-4" },
    ]);
  });
});

describe("createTasksMap()", () => {
  it("creates tasks map by tasklist id", () => {
    const input: Task[] = [
      { taskListId: "list-1", position: "00000000000000000001", id: "task-1-1" },
      { taskListId: "list-1", position: "00000000000000000002", id: "task-1-2" },
      { taskListId: "list-1", position: "00000000000000000003", id: "task-1-3" },
      { taskListId: "list-2", position: "00000000000000000006", id: "task-2-1" },
      { taskListId: "list-3", position: "00000000000000000000", id: "task-3-1" },
      { taskListId: "list-6", position: "00000000000000000001", id: "task-6-1" },
    ];
    const result = createTasksMap(input);
    expect(result).toEqual(
      new Map<string, Task[]>([
        [
          "list-1",
          [
            { taskListId: "list-1", position: "00000000000000000001", id: "task-1-1" },
            { taskListId: "list-1", position: "00000000000000000002", id: "task-1-2" },
            { taskListId: "list-1", position: "00000000000000000003", id: "task-1-3" },
          ],
        ],
        ["list-2", [{ taskListId: "list-2", position: "00000000000000000006", id: "task-2-1" }]],
        ["list-3", [{ taskListId: "list-3", position: "00000000000000000000", id: "task-3-1" }]],
        ["list-6", [{ taskListId: "list-6", position: "00000000000000000001", id: "task-6-1" }]],
      ])
    );
  });
});
