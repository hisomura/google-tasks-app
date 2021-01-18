import { FC, useState } from "react";
import { completeTask, Task } from "../lib/gapi-wrappers";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { dragEnd, dragStart, updateOffset, updateTarget } from "../store/tasksDragSlice";
import CompleteButton from "./CompleteButton";
import { addTaskIds, isSelectedSelector, removeAllTaskIds, replaceAllTaskIds } from "../store/selectedTaskIdsSlice";

type Props = {
  taskListId: string;
  previousTaskId?: string;
  task: Task;
};

const TaskContainer: FC<Props> = (props) => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const [completed, setCompleted] = useState(false);
  const isSelected = useSelector(isSelectedSelector(props.task.id!));

  const mutation = useMutation((props: { task: Task }) => completeTask({ task: props.task }), {
    onSuccess: () => client.invalidateQueries(["tasks", props.task.taskListId]),
  });

  return (
    <div
      className={"task-container"}
      data-task-id={props.task.id}
      style={isSelected ? { backgroundColor: "#ccc" } : {}}
      draggable={true}
      onDragStart={(e) => {
        if (!isSelected) dispatch(replaceAllTaskIds([props.task.id]));

        dispatch(dragStart({ offset: { x: e.clientX, y: e.clientY } }));
      }}
      onDrag={(e) => {
        dispatch(updateOffset({ offset: { x: e.clientX, y: e.clientY } }))
        e.preventDefault();
      }}
      onDragOver={(e) => {
        // e.preventDefault();
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const previousTaskFocused = rect.top + rect.height / 2 > e.clientY;
        dispatch(
          updateTarget({
            toTaskListId: props.taskListId,
            previousTaskId: previousTaskFocused ? props.previousTaskId : props.task.id,
          })
        );
      }}
      onDragEnd={(e) => {
        const offset = { x: e.clientX, y: e.clientY };
        dispatch(dragEnd({ offset }));
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
          dispatch(addTaskIds([props.task.id]));
        } else {
          dispatch(replaceAllTaskIds([props.task.id]));
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex items-center p-3">
        <div className="flex-initial mr-3">
          <CompleteButton
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
