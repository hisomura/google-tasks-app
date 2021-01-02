import React, { FC, useState } from "react";

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

const RectangleSelection: FC = ({ children }) => {
  const [rectangleState, setRectangleState] = useState<RectangleState | null>(null);
  return (
    <div
      style={parentStyle}
      onMouseDown={(e) =>
        setRectangleState({
          startX: e.clientX,
          startY: e.clientY,
          currentX: e.clientX,
          currentY: e.clientY,
        })
      }
      onMouseMove={(e) => {
        if (rectangleState === null) return;

        setRectangleState({ ...rectangleState, currentX: e.clientX, currentY: e.clientY });
      }}
      onMouseUp={(_e) => {
        // TODO implement
        setRectangleState(null);
      }}
    >
      {rectangleState ? <div style={getRectangleStyle(rectangleState)} /> : null}
      {children}
    </div>
  );
};

export default RectangleSelection;
