import React, { FC, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isSelectedSelector, replaceAllTaskIds, selectedTaskExists } from "../store/selectedTaskIdsSlice";

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
    width: 100,
    height: 100,
    backgroundColor: "#aaa",
  };
}

const Menu: FC<{ position: MenuPosition }> = ({ position }) => {
  return <div style={getMenuStyle(position)}>This is ContextMenu!</div>;
};

const ContextMenu: FC = ({ children }) => {
  const selected = useSelector(selectedTaskExists);
  // const selected = false
  const [position, setPosition] = useState<MenuPosition | null>(null);
  return (
    <div
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
