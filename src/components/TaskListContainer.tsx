import { FC } from "react";
import { useQuery } from "react-query";
import CompleteButton from "./CompleteButton";
import TaskList = gapi.client.tasks.TaskList;
import Task = gapi.client.tasks.Task;

function renderTasks(tasks: Task[]) {
  return tasks.map((task) => (
    <div key={task.id}>
      <hr />
      <div className="flex items-center p-3">
        <div className="flex-initial mr-3">
          <CompleteButton completeTask={() => {}} />
        </div>
        <div className="flex-initial break-all">{task.title}</div>
      </div>
    </div>
  ));
}

const TaskListContainer: FC<{ list: TaskList }> = (props) => {
  const { isLoading, data } = useQuery(`tasklists-${props.list.id}`, () => {
    if (props.list.id === undefined) return undefined;
    return gapi.client.tasks.tasks.list({ maxResults: 100, tasklist: props.list.id }).then((res) => res.result.items);
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-2 w-64">
      <p className="break-words pl-3 font-bold text-lg">{props.list.title}</p>
      {data === undefined ? null : renderTasks(data)}
    </div>
  );
};

export default TaskListContainer;
