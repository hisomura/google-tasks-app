import { FC } from "react";
import { useSelector } from "react-redux";
import { isDragTarget } from "../store/tasksDragSlice";

type Props = {
  tasklistId: string;
  previousTaskId?: string;
};

const TaskDragTargetLine: FC<Props> = (props) => {
  const isTargeted = useSelector(isDragTarget(props.tasklistId, props.previousTaskId));
  if (isTargeted) return <hr style={{ borderColor: "#c00" }} />;

  return props.previousTaskId ? <hr /> : null;
};

export default TaskDragTargetLine;
