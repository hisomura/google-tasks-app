import { FC, Fragment } from "react";
import { useQuery } from "react-query";
import { getTasks, Task, TaskList } from "../lib/gapi-wrappers";
import TaskContainer from "./TaskContainer";
import { useDispatch } from "react-redux";
import { drop } from "../store/tasksDragSlice";
import TaskDragTargetLine from "./TaskDragTargetLine";

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
  const dispatch = useDispatch();
  const { isLoading, data } = useQuery(["tasks", props.tasklist.id], async () => {
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
    <div
      className="p-2 w-64"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        dispatch(drop(props.tasklist.id!));
      }}
    >
      <p className="break-words pl-3 font-bold text-lg select-none">{props.tasklist.title}</p>
      <TaskDragTargetLine taskListId={props.tasklist.id!} />
      {tasks.map((task, index) => (
        <Fragment key={task.id}>
          <TaskContainer taskListId={props.tasklist.id!} previousTaskId={tasks[index-1]?.id} task={task} />
          <TaskDragTargetLine taskListId={props.tasklist.id!} previousTaskId={task.id} />
        </Fragment>
      ))}
    </div>
  );
};

export default TaskListContainer;
