import { FC } from "react";
import { useQuery } from "react-query";
import { getTasks, Task, TaskList } from "../lib/gapi-wrappers";
import TaskContainer from "./TaskContainer";

const taskSortFunc = (a: Task, b: Task) => parseInt(a.position!) - parseInt(b.position!);

function separateAndSortTasks(input: Task[]) {
  const tasks: Task[] = [];
  const subTasksTable = new Map<string, Task[]>();

  input.forEach((t) => {
    if (!t.parent) {
      tasks.push(t);
    } else {
      const tasks = subTasksTable.get(t.parent);
      if (tasks) {
        tasks.push(t);
      } else {
        subTasksTable.set(t.parent, [t]);
      }
    }
  });

  tasks.sort(taskSortFunc);
  for (const subTasks of subTasksTable.values()) {
    subTasks.sort(taskSortFunc);
  }

  return [tasks, subTasksTable] as const;
}

const TaskListContainer: FC<{ tasklist: TaskList }> = (props) => {
  const { isLoading, data } = useQuery(["tasklists", props.tasklist.id], async () => {
    if (props.tasklist.id === undefined) return undefined;
    const tasks = await getTasks(props.tasklist.id);
    return tasks ?? [];
  });

  if (isLoading) {
    return (
      <div className="p-2 w-64">
        <p className="break-words pl-3 font-bold text-lg">{props.tasklist.title}</p>
        <div>Loading...</div>
      </div>
    );
  }

  if (data === undefined) {
    console.error(`data is undefined. tasklistId: ${props.tasklist.id}`);
    return <div>Something wrong</div>;
  }

  const [tasks] = separateAndSortTasks(data);

  return (
    <div className="p-2 w-64">
      <p className="break-words pl-3 font-bold text-lg">{props.tasklist.title}</p>
      {tasks.map((task) => (
        <TaskContainer key={task.id} tasklistId={props.tasklist.id!} task={task} />
      ))}
    </div>
  );
};

export default TaskListContainer;
