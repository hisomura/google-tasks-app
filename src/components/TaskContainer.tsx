import { FC, useState } from "react";
import { Task, updateTaskCompleted } from "../lib/gapi-wrappers";
import { useMutation, useQueryCache } from "react-query";
import CompleteButton from "./CompleteButton";

type Props = {
  tasklistId: string;
  task: Task;
};

const TaskContainer: FC<Props> = (props) => {
  const cache = useQueryCache();
  const [completed, setCompleted] = useState(false);
  const [completeTask] = useMutation(
    (props: { tasklistId: string; task: Task }) => {
      setCompleted(true);
      return updateTaskCompleted({ tasklistId: props.tasklistId, task: props.task });
    },
    {
      onSuccess: () => cache.invalidateQueries(["tasklists", props.tasklistId]),
    }
  );

  return (
    <div>
      <hr />
      <div className="flex items-center p-3">
        <div className="flex-initial mr-3">
          <CompleteButton onClick={() => completeTask({ tasklistId: props.tasklistId, task: props.task })} />
        </div>
        <div className="flex-initial break-all">{props.task.title}</div>
      </div>
    </div>
  );
};

export default TaskContainer
