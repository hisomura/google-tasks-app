import { QueryClient } from "react-query";
import { Task } from "./gapi-wrappers";
import { createTasksMap } from "./tasks";

type DragDestination = {
  tasklistId: string;
  prevTaskId: string | undefined;
};

function removeTasks(queryClient: QueryClient, tasksMap: Map<string, Task[]>) {
  tasksMap.forEach((tasks, tasklistId) => {
    const taskIds = tasks.map((task) => task.id);
    const queryKey = ["tasks", tasklistId];
    queryClient.setQueryData<Task[]>(queryKey, (currentData = []) => {
      return currentData.filter((task) => !taskIds.includes(task.id));
    });
  });
}

export function optimisticUpdatesForMoveTasks(
  queryClient: QueryClient,
  tasks: Task[],
  { tasklistId, prevTaskId }: DragDestination
) {
  const tasksMap = createTasksMap(tasks);
  removeTasks(queryClient, tasksMap);

  queryClient.setQueryData<Task[]>(["tasks", tasklistId], (oldData = []) => {
    const prevTask = oldData.find((task) => task.id === prevTaskId);
    const positionBase = prevTask?.position ?? "";
    const tmpTasks = tasks.map((task, index) => ({
      ...task,
      id: `tmp-id-${task.id}`,
      tasklistId: tasklistId,
      position: positionBase + index.toString().padStart(3, "0"),
    }));

    return [...oldData, ...tmpTasks];
  });
}
