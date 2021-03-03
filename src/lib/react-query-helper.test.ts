import { QueryClient } from "react-query";
import { Task } from "./gapi-wrappers";
import { getTasksByIdsFromQueryClient, optimisticUpdatesForMoveTasks } from "./react-query-helper";

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
      { tasklistId: "list-4", position: "00000000000000000008", id: "task-from-list-4", parent: "task-4-4" },
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
    ];

    const queryClient = new QueryClient();
    queryClient.setQueryData(["tasks", "list-1"], () => oldTasks);
    queryClient.setQueryData(["tasks", "list-3"], () => [newTasks[0]]);
    queryClient.setQueryData(["tasks", "list-4"], () => [newTasks[1]]);

    optimisticUpdatesForMoveTasks(queryClient, newTasks, "list-1", oldTasks[2], true);

    const expected: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "00000000000000000001.001", id: "tmp-id-task-from-list-4", isLastChild: true },
      { tasklistId: "list-1", position: "00000000000000000001.002", id: "tmp-id-task-3" },
      { tasklistId: "list-1", position: "00000000000000000001.003", id: "tmp-id-task-from-list-3" },
    ];
    expect(queryClient.getQueryData(["tasks", "list-1"])).toEqual(expected);
    expect(queryClient.getQueryData(["tasks", "list-3"])).toEqual([]);
    expect(queryClient.getQueryData(["tasks", "list-4"])).toEqual([]);
  });

  test("when new tasks to children", () => {
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

    optimisticUpdatesForMoveTasks(queryClient, newTasks, "list-1", oldTasks[2], false);

    const expected: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000004", id: "task-4" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-2" },
      { tasklistId: "list-1", position: "-100", id: "tmp-id-task-3", parent: "task-1" },
      { tasklistId: "list-1", position: "-99", id: "tmp-id-task-from-list-3", parent: "task-1" },
      { tasklistId: "list-1", position: "-98", id: "tmp-id-task-from-list-4", parent: "task-1" },
    ];
    expect(queryClient.getQueryData(["tasks", "list-1"])).toEqual(expected);
  });

  test("when tasks move to top", () => {
    const oldTasks: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
    ];
    const newTasks: Task[] = [
      { tasklistId: "list-3", position: "00000000000000000005", id: "task-from-list-3-1" },
      { tasklistId: "list-3", position: "00000000000000000008", id: "task-from-list-3-2" },
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-3" },
    ];

    const queryClient = new QueryClient();
    queryClient.setQueryData(["tasks", "list-1"], () => oldTasks);
    queryClient.setQueryData(["tasks", "list-3"], () => [newTasks[0], newTasks[1]]);

    optimisticUpdatesForMoveTasks(queryClient, newTasks, "list-1", undefined, false);

    const expected: Task[] = [
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-0" },
      { tasklistId: "list-1", position: "-100", id: "tmp-id-task-3" },
      { tasklistId: "list-1", position: "-99", id: "tmp-id-task-from-list-3-1" },
      { tasklistId: "list-1", position: "-98", id: "tmp-id-task-from-list-3-2" },
    ];
    expect(queryClient.getQueryData(["tasks", "list-1"])).toEqual(expected);
  });
});

describe("getTasksByIdsFromQueryClient", () => {
  test("get tasks by task id", () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["tasks", "list-1"], () => [
      { tasklistId: "list-1", position: "00000000000000000003", id: "task-1-3" },
      { tasklistId: "list-1", position: "00000000000000000001", id: "task-1-1" },
      { tasklistId: "list-1", position: "00000000000000000000", id: "task-1-0" },
      { tasklistId: "list-1", position: "00000000000000000002", id: "task-1-2" },
    ]);
    queryClient.setQueryData(["tasks", "list-2"], () => [
      { tasklistId: "list-2", position: "00000000000000000000", id: "task-2-0" },
      { tasklistId: "list-2", position: "00000000000000000002", id: "task-2-2" },
      { tasklistId: "list-2", position: "00000000000000000003", id: "task-2-3" },
      { tasklistId: "list-2", position: "00000000000000000001", id: "task-2-1" },
    ]);
    queryClient.setQueryData(["tasks", "list-3"], () => [
      { tasklistId: "list-3", position: "00000000000000000001", id: "task-3-1" },
      { tasklistId: "list-3", position: "00000000000000000002", id: "task-3-2" },
      { tasklistId: "list-3", position: "00000000000000000003", id: "task-3-3" },
      { tasklistId: "list-3", position: "00000000000000000000", id: "task-3-0" },
    ]);

    const ids = ["task-2-1", "task-2-0", "task-3-3", "task-3-0", "task-1-0", "task-2-2"];
    const tasks = getTasksByIdsFromQueryClient(queryClient, ids);
    const returnTaskIds = new Set(tasks.map((task) => task.id));
    expect(returnTaskIds).toEqual(new Set(ids));
  });
});
