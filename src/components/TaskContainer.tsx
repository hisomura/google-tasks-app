import { FC, useState } from "react";
import { Task, updateTaskCompleted } from "../lib/gapi-wrappers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { dragEnd, dragStart, updateOffset } from "../store/tasksDragSlice";
import CompleteButton from "./CompleteButton";
import { isSelectedSelector, selectedTasksSlice } from "../store/selectedTasksSlice";

type Props = {
  tasklistId: string;
  task: Task;
};

const TaskContainer: FC<Props> = (props) => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(false);
  const isSelected = useSelector(isSelectedSelector(props.task.id!));
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
      style={ isSelected ? {backgroundColor: '#ccc'} : {}}
      draggable={true}
      onDragStart={(e) => {
        const offset = { x: e.clientX, y: e.clientY };
        dispatch(dragStart({ offset, task: props.task }));
      }}
      onDrag={(e) => {
        const offset = { x: e.clientX, y: e.clientY };
        dispatch(updateOffset({ offset }));
      }}
      onDragEnd={(e) => {
        const offset = { x: e.clientX, y: e.clientY };
        dispatch(dragEnd({ offset }));
      }}
      onClick={(e) => {
        if (e.ctrlKey || e.metaKey)  {
          dispatch(selectedTasksSlice.actions.addMany([props.task]));
        } else {
          dispatch(selectedTasksSlice.actions.removeAll());
          dispatch(selectedTasksSlice.actions.addMany([props.task]));
        }
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
