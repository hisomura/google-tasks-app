import { QueryClient } from "react-query";
import { Task } from "./gapi-wrappers";
import { createTasksMap, getNextParentAndPrevious } from "./tasks";

function removeTasksFromClient(queryClient: QueryClient, tasksMap: Map<string, Task[]>) {
  tasksMap.forEach((tasks, tasklistId) => {
    const taskIds = tasks.map((task) => task.id);
    const queryKey = ["tasks", tasklistId];
    queryClient.setQueryData<Task[]>(queryKey, (currentData = []) => {
      return currentData.filter((task) => !taskIds.includes(task.id));
    });
  });
}

// FIXME when multi tasks move to top order.
export function optimisticUpdatesForMoveTasks(
  queryClient: QueryClient,
  tasks: Task[],
  toTasklistId: string,
  targetTask?: Task,
  onLeft?: boolean
) {
  const tasksMap = createTasksMap(tasks);
  removeTasksFromClient(queryClient, tasksMap);

  queryClient.setQueryData<Task[]>(["tasks", toTasklistId], (oldData = []) => {
    const { parent, previous } = getNextParentAndPrevious(targetTask, onLeft);
    const prevTask = oldData.find((task) => task.id === previous);
    const positionBase = prevTask?.position!;

    const tmpTasks = tasks.map((task, index) => {
      let tmpPosition;
      if (positionBase) {
        tmpPosition = `${positionBase}.` + (index + 1).toString().padStart(3, "0");
      } else {
        tmpPosition = (-100 + index).toString();
      }

      return {
        ...task,
        id: `tmp-id-${task.id}`,
        tasklistId: toTasklistId,
        parent,
        position: tmpPosition,
      };
    });

    return [...oldData, ...tmpTasks];
  });
}

export function getTasksByIdsFromQueryClient(queryClient: QueryClient, ids: string[]) {
  const taskMap = new Map<string, Task>();
  // @ts-ignore
  queryClient
    .getQueryCache()
    .findAll("tasks")
    .forEach((query) => {
      const tasks = query.state.data as Task[];
      tasks.forEach((task) => taskMap.set(task.id, task));
    });

  return ids.map((id) => {
    const task = taskMap.get(id);
    if (!task) {
      throw Error(`id:${id} のタスクqueryClient内に存在しない`);
    }

    return task;
  });
}
