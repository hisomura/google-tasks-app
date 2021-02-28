import { Task } from "./gapi-wrappers";

const taskSortFunc = (a: Task, b: Task) => {
  if (a.position! > b.position!) {
    return 1;
  } else if (a.position! < b.position!) {
    return -1;
  } else {
    return 0;
  }
};

export function sortTasks(input: Task[]): Task[] {
  const tasks: Task[] = [];
  const subTasksMap = new Map<string, Task[]>();

  input.forEach((t) => {
    if (!t.parent) {
      tasks.push(t);
      return;
    }

    const subTasks = subTasksMap.get(t.parent);
    if (subTasks) {
      subTasks.push(t);
    } else {
      subTasksMap.set(t.parent, [t]);
    }
  });

  tasks.sort(taskSortFunc);
  for (const subTasks of subTasksMap.values()) {
    subTasks.sort(taskSortFunc);
    subTasks[subTasks.length - 1].isLastChild = true;
    const parentIndex = tasks.findIndex((task) => task.id === subTasks[0].parent);
    tasks.splice(parentIndex + 1, 0, ...subTasks);
  }

  return tasks;
}

export function createTasksMap(tasks: Task[]) {
  const tasksMap = new Map<string, Task[]>();
  tasks.forEach((task) => {
    const currentTasks = tasksMap.get(task.tasklistId) ?? [];
    tasksMap.set(task.tasklistId, [...currentTasks, task]);
  });

  return tasksMap;
}
