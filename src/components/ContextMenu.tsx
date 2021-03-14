import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTasks, selectedTaskExists } from "../store/selectedTaskIdsSlice";

const parentStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
};

type MenuPosition = {
  x: number;
  y: number;
};

function getMenuStyle(position: MenuPosition): React.CSSProperties {
  return {
    position: "absolute",
    top: position.y,
    left: position.x,
    width: 200,
    height: 100,
    backgroundColor: "#aaa",
  };
}

const Menu: FC<{ position: MenuPosition }> = ({ position }) => {
  const dispatch = useDispatch();
  return (
    <ul style={getMenuStyle(position)} onMouseDown={(e) => e.stopPropagation()}>
      <li
        onClick={(e) => {
          e.stopPropagation();
          dispatch(deleteTasks());
        }}
      >
        Delete
      </li>
    </ul>
  );
};

const ContextMenu: FC = ({ children }) => {
  const selected = useSelector(selectedTaskExists);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  if (position !== null && !selected) setPosition(null);

  return (
    <div
      style={parentStyle}
      onContextMenu={(e) => {
        if (!selected) return;

        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
      }}
    >
      {position ? <Menu position={position} /> : null}
      {children}
    </div>
  );
};

export default ContextMenu;
