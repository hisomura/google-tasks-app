import { FC, Fragment } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { createTask, getTasks, Tasklist } from "../lib/gapi-wrappers";
import { sortTasks } from "../lib/tasks";
import { drop } from "../store/tasksDragSlice";
import TaskContainer from "./TaskContainer";
import TaskDragTargetLine from "./TaskDragTargetLine";

const TasklistContainer: FC<{ tasklist: Tasklist }> = (props) => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading, data } = useQuery(["tasks", props.tasklist.id], async () => {
    if (props.tasklist.id === undefined) return undefined;
    const tasks = await getTasks(props.tasklist.id);
    return tasks ?? [];
  });

  const mutation = useMutation((title: string) => createTask(title, props.tasklist.id), {
    onSuccess: () => client.invalidateQueries(["tasks", props.tasklist.id]),
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

  const tasks = sortTasks(data);

  return (
    <div
      className="p-2 w-64"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        dispatch(drop(props.tasklist.id));
      }}
    >
      <p className="break-words pl-3 font-bold text-lg select-none">{props.tasklist.title}</p>
      <div className="flex items-center p-3">
        <span className="flex-initial mr-3">+</span>
        <input
          className="flex-initial break-all focus:outline-none"
          onKeyDown={(event) => {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
            // if (event.keyCode === 229) return
            if (event.key !== "Enter") return;
            if (event.currentTarget.value === "") return;
            mutation.mutate(event.currentTarget.value);
            event.currentTarget.value = "";
          }}
          type="text"
        />
      </div>

      <TaskDragTargetLine tasklistId={props.tasklist.id} />
      {tasks.map((task, index) => (
        <Fragment key={task.id}>
          <TaskContainer tasklistId={props.tasklist.id} previousTaskId={tasks[index - 1]?.id} task={task} />
          <TaskDragTargetLine tasklistId={props.tasklist.id} previousTaskId={task.id} />
        </Fragment>
      ))}
    </div>
  );
};

export default TasklistContainer;
