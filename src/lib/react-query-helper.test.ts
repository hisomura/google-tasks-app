import { QueryClient } from "react-query";
import { Task } from "./gapi-wrappers";
import { optimisticUpdatesForMoveTasks } from "./react-query-helper";

describe("createInsertTasksUpdater", () => {
  test("removes and adds temporary task data to query cache", () => {
    const oldTasks: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
    ];
    const newTasks: Task[] = [
      { tasklistId: "list-3", position: "00000000000000000005", id: "task-from-list-3" },
      { tasklistId: "list-4", position: "00000000000000000008", id: "task-from-list-4" },
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
    ];

    const queryClient = new QueryClient();
    queryClient.setQueryData(["tasks", "list-1"], () => oldTasks);
    queryClient.setQueryData(["tasks", "list-3"], () => [newTasks[0]]);
    queryClient.setQueryData(["tasks", "list-4"], () => [newTasks[1]]);

    optimisticUpdatesForMoveTasks(queryClient, newTasks, { tasklistId: "list-1", prevTaskId: "task-1" });

    expect(queryClient.getQueryData(["tasks", "list-1"])).toEqual([
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "00000000000000000001000", id: "tmp-id-task-from-list-3" },
      { tasklistId: "list-1", position: "00000000000000000001001", id: "tmp-id-task-from-list-4" },
      { tasklistId: "list-1", position: "00000000000000000001002", id: "tmp-id-task-3" },
    ]);

    expect(queryClient.getQueryData(["tasks", "list-3"])).toEqual([]);
    expect(queryClient.getQueryData(["tasks", "list-4"])).toEqual([]);
  });
});
