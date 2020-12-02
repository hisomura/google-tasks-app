import { FC } from "react";
import { useMutation, useQuery, useQueryCache } from "react-query";
import CompleteButton from "./CompleteButton";
import { updateTaskCompleted } from "../lib/gapi";
import TaskList = gapi.client.tasks.TaskList;

const TaskListContainer: FC<{ tasklist: TaskList }> = (props) => {
  const { isLoading, data } = useQuery(["tasklists", props.tasklist.id], async () => {
    if (props.tasklist.id === undefined) return undefined;
    const tasklists = await gapi.client.tasks.tasks
      .list({
        maxResults: 100,
        tasklist: props.tasklist.id,
      })
      .then((res) => res.result.items);
    return tasklists ?? [];
  });

  const cache = useQueryCache();
  const [completeTask] = useMutation(updateTaskCompleted, {
    onSuccess: () => {
      cache.invalidateQueries(["tasklists", props.tasklist.id]);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (data === undefined) {
    console.error(`data is undefined. tasklistId: ${props.tasklist.id}`);
    return <div>Something wrong</div>;
  }

  return (
    <div className="p-2 w-64">
      <p className="break-words pl-3 font-bold text-lg">{props.tasklist.title}</p>
      {data.map((task) => (
        <div key={task.id}>
          <hr />
          <div className="flex items-center p-3">
            <div className="flex-initial mr-3">
              <CompleteButton onClick={() => completeTask({ tasklistId: props.tasklist.id!, task })} />
            </div>
            <div className="flex-initial break-all">{task.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListContainer;
