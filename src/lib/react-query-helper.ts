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
    const positionBase = prevTask?.position ?? "";

    const reversed = [...tasks].reverse();
    const tmpTasks = reversed.map((task, index) => {
      return {
        ...task,
        id: `tmp-id-${task.id}`,
        tasklistId: toTasklistId,
        parent,
        position: positionBase + index.toString().padStart(3, "0"),
      };
    });

    return [...oldData, ...tmpTasks];
  });
}
