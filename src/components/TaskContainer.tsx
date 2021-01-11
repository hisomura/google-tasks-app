import { FC, useState } from "react";
import { Task, updateTaskCompleted } from "../lib/gapi-wrappers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { dragEnd, dragStart, updateOffset } from "../store/tasksDragSlice";
import CompleteButton from "./CompleteButton";
import {
  addTaskIds,
  isSelectedSelector,
  removeAllTaskIds,
  replaceAllTaskIds,
  selectedTaskIdsSelector,
} from "../store/selectedTaskIdsSlice";

type Props = {
  tasklistId: string;
  task: Task;
};

const TaskContainer: FC<Props> = (props) => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(false);
  const isSelected = useSelector(isSelectedSelector(props.task.id!));
  const selectedTaskIds = useSelector(selectedTaskIdsSelector); // FIXME remove

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
      style={isSelected ? { backgroundColor: "#ccc" } : {}}
      draggable={true}
      onDragStart={(e) => {
        const offset = { x: e.clientX, y: e.clientY };

        if (isSelected) {
          dispatch(dragStart({ offset, taskIds: selectedTaskIds }));
        } else {
          dispatch(replaceAllTaskIds([props.task.id]));
          dispatch(dragStart({ offset, taskIds: [props.task.id] }));
        }
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
        if (e.defaultPrevented) return;
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          dispatch(addTaskIds([props.task.id]));
        } else {
          dispatch(replaceAllTaskIds([props.task.id]));
        }
      }}
    >
      <hr />
      <div className="flex items-center p-3">
        <div className="flex-initial mr-3">
          <CompleteButton
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate({ tasklistId: props.tasklistId, task: props.task });
              dispatch(removeAllTaskIds({}));
            }}
          />
        </div>
        <div className="flex-initial break-all" style={{ textDecorationLine: completed ? "line-through" : "none" }}>
          {props.task.title}
        </div>
      </div>
    </div>
  );
};

export default TaskContainer;
