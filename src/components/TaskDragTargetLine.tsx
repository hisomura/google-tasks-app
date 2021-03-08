import { FC } from "react";
import { useSelector } from "react-redux";
import { selectedSelector } from "../store/tasksDragSlice";

type Props = {
  tasklistId: string;
  previousTaskId?: string;
};

const TaskDragTargetLine: FC<Props> = (props) => {
  const selected = useSelector(selectedSelector(props.tasklistId, props.previousTaskId));

  if (selected === "left") {
    return <hr style={{ borderColor: "#c00" }} />;
  } else if (selected === "right") {
    return <hr style={{ borderColor: "#0c0" }} />;
  }

  return props.previousTaskId ? <hr /> : null;
};

export default TaskDragTargetLine;
