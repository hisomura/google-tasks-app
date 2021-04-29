import { FC, useState } from "react";
import { completeTask, Task } from "../lib/gapi-wrappers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import { dragEnd, dragStart, updateTarget, initTaskDragState } from "../store/tasksDragSlice";
import CompleteButton from "./CompleteButton";
import {
  addTaskIds,
  removeTaskIds,
  isSelectedSelector,
  removeAllTaskIds,
  replaceAllTaskIds,
} from "../store/selectedTaskIdsSlice";

type Props = {
  tasklistId: string;
  previousTaskId?: string;
  task: Task;
};

const TaskContainer: FC<Props> = (props) => {
  const client = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const [completed, setCompleted] = useState(false);
  const isSelected = useSelector(isSelectedSelector(props.task.id));

  const mutation = useMutation((props: { task: Task }) => completeTask({ task: props.task }), {
    onSuccess: () => client.invalidateQueries(["tasks", props.task.tasklistId]),
  });

  return (
    <div
      className={"task-container"}
      data-task-id={props.task.id}
      style={isSelected ? { backgroundColor: "#ccc" } : {}}
      draggable={true}
      onDragStart={(_e) => {
        _e.stopPropagation();
        if (!isSelected) dispatch(replaceAllTaskIds([props.task.id]));

        dispatch(dragStart({}));
      }}
      onDragOver={(e) => {
        // e.preventDefault();
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const targetTaskId = e.clientY < rect.top + rect.height / 2 ? props.previousTaskId : props.task.id;
        const onLeft = e.clientX < rect.x + rect.width / 2;

        dispatch(updateTarget({ toTasklistId: props.tasklistId, targetTaskId, onLeft }));
      }}
      onDragEnd={(_e) => {
        dispatch(dragEnd({}));
        dispatch(initTaskDragState({}));
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
          if (isSelected) {
            dispatch(removeTaskIds([props.task.id]));
          } else {
            dispatch(addTaskIds([props.task.id]));
          }
        } else {
          dispatch(replaceAllTaskIds([props.task.id]));
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center p-3">
        <div className={"flex-initial mr-3" + (props.task.parent ? " ml-3" : "")}>
          <CompleteButton
            completed={completed}
            onClick={(e) => {
              e.stopPropagation();
              setCompleted(true);
              mutation.mutate({ task: props.task });
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
