import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { replaceAllTaskIds } from "../store/selectedTaskIdsSlice";
import { AppDispatch } from "../store/store";

const parentStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
};

function getRectangleStyle(state: RectangleState): React.CSSProperties {
  const left = state.startX < state.currentX ? state.startX : state.currentX;
  const top = state.startY < state.currentY ? state.startY : state.currentY;

  return {
    position: "absolute",
    top: top,
    left: left,
    width: Math.abs(state.currentX - state.startX),
    height: Math.abs(state.currentY - state.startY),
    backgroundColor: "#85bdf8",
    opacity: "0.5",
  };
}

type RectangleState = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

function getRectangleVertexes(state: RectangleState) {
  const [left, right] = state.startX < state.currentX ? [state.startX, state.currentX] : [state.currentX, state.startX];
  const [top, bottom] = state.startY < state.currentY ? [state.startY, state.currentY] : [state.currentY, state.startY];
  return { left, right, top, bottom };
}

function checkIfTaskIsSelected(rectangleState: RectangleState, domRect: DOMRect) {
  const rectangleVertexes = getRectangleVertexes(rectangleState);
  const rectCenterX = (domRect.left + domRect.right) / 2;
  const rectCenterY = (domRect.top + domRect.bottom) / 2;

  if (
    rectangleVertexes.left <= rectCenterX &&
    rectCenterX <= rectangleVertexes.right &&
    rectangleVertexes.top < rectCenterY &&
    rectCenterY < rectangleVertexes.bottom
  ) {
    return true;
  }

  return false;
}

const RectangleSelection: FC = ({ children }) => {
  const [rectangleState, setRectangleState] = useState<RectangleState | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div
      draggable={false}
      style={parentStyle}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        setRectangleState({
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY,
        });
      }}
      onMouseMove={(e) => {
        if (rectangleState === null) return;

        setRectangleState({ ...rectangleState, currentX: e.clientX, currentY: e.clientY });
      }}
      onMouseUp={(_e) => {
        if (!rectangleState) return;
        const taskNodeList = document.querySelectorAll<HTMLDivElement>(".task-container");
        if (taskNodeList.length === 0) return;
        const taskIds: string[] = [];

        taskNodeList.forEach((taskNode) => {
          const rect = taskNode.getBoundingClientRect();
          if (checkIfTaskIsSelected(rectangleState, rect)) {
            taskIds.push(taskNode.dataset["taskId"]!);
          }
        });

        dispatch(replaceAllTaskIds(taskIds));
        setRectangleState(null);
      }}
    >
      {rectangleState ? <div style={getRectangleStyle(rectangleState)} /> : null}
      {children}
    </div>
  );
};

export default RectangleSelection;
