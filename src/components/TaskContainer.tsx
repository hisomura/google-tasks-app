import { FC, useState } from "react";
import { Task, updateTaskCompleted } from "../lib/gapi-wrappers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import tasksDragSlice from "../store/tasksDragSlice";
import CompleteButton from "./CompleteButton";

type Props = {
  tasklistId: string;
  task: Task;
};

const TaskContainer: FC<Props> = (props) => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(false);
  const mutation = useMutation(
    (props: { tasklistId: string; task: Task }) => {
      setCompleted(true);
      return updateTaskCompleted({ tasklistId: props.tasklistId, task: props.task });
    },
    {
      onSuccess: () => client.invalidateQueries(["tasklists", props.tasklistId]),
    }
  );

  return (
    <div
      draggable={true}
      onDragStart={(e) => {
        const offset = { x: e.clientX, y: e.clientY };
        dispatch(
          tasksDragSlice.actions.dragStart({ offset: offset, fromTasklistId: props.tasklistId, task: props.task })
        );
      }}
    >
      <hr />
      <div className="flex items-center p-3">
        <div className="flex-initial mr-3">
          <CompleteButton onClick={() => mutation.mutate({ tasklistId: props.tasklistId, task: props.task })} />
        </div>
        <div className="flex-initial break-all" style={{ textDecorationLine: completed ? "line-through" : "none" }}>
          {props.task.title}
        </div>
      </div>
    </div>
  );
};

export default TaskContainer;
