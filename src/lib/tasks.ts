import { Task, Tasklist } from "./gapi-wrappers";

const compareTaskOrder = (a: Task, b: Task) => {
  return parseFloat(a.position!) - parseFloat(b.position!);
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

  tasks.sort(compareTaskOrder);
  for (const subTasks of subTasksMap.values()) {
    subTasks.sort(compareTaskOrder);
    subTasks[subTasks.length - 1].isLastChild = true;
    const parentIndex = tasks.findIndex((task) => task.id === subTasks[0].parent);
    tasks.splice(parentIndex + 1, 0, ...subTasks);
  }

  return tasks;
}

// FIXME name
export function sortTasksWithTasklistOrder(tasklists: Tasklist[], tasks: Task[]) {
  const tasklistOrderMap = new Map<Tasklist["id"], number>();
  tasklists.forEach((tasklist, index) => tasklistOrderMap.set(tasklist.id, index));

  return [...tasks].sort((a, b) => {
    const listOrderDiff = tasklistOrderMap.get(a.tasklistId)! - tasklistOrderMap.get(b.tasklistId)!;
    if (listOrderDiff !== 0) return listOrderDiff;

    return parseFloat(a.position!) - parseFloat(b.position!);
  });
}

export function createTasksMap(tasks: Task[]) {
  const tasksMap = new Map<string, Task[]>();
  tasks.forEach((task) => {
    const currentTasks = tasksMap.get(task.tasklistId) ?? [];
    tasksMap.set(task.tasklistId, [...currentTasks, task]);
  });

  return tasksMap;
}

export function getNextParentAndPrevious(targetTask?: Task, onLeft?: boolean) {
  let parent: string | undefined;
  let previous: string | undefined;

  if (targetTask === undefined) return { parent: undefined, previous: undefined };

  // top level
  if (targetTask.parent === undefined) {
    if (onLeft) {
      previous = targetTask.id;
    } else {
      parent = targetTask.id;
    }
    // sub task
  } else {
    if (targetTask.isLastChild && onLeft) {
      previous = targetTask.parent;
    } else {
      parent = targetTask.parent;
      previous = targetTask.id;
    }
  }

  return { parent, previous };
}
