import { FC } from "react";
import { useSelector } from "react-redux";
import { isDragTarget } from "../store/tasksDragSlice";

type Props = {
  taskListId: string;
  previousTaskId?: string;
};

const TaskDragTargetLine: FC<Props> = (props) => {
  const isSelected = useSelector(isDragTarget(props.taskListId, props.previousTaskId ?? null));
  if (isSelected) return <hr style={{ backgroundColor: "#c00" }} />;

  return props.previousTaskId ? <hr /> : null;
};

export default TaskDragTargetLine;
