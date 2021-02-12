import { Task } from "./gapi-wrappers";
import { sortTasks } from "./tasks";

describe("tasks", () => {
  it("tasks ", () => {
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
});
