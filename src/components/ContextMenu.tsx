import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTasks, selectedTaskExists } from "../store/selectedTaskIdsSlice";
import { Box } from "@chakra-ui/react";

const parentStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
};

type MenuPosition = {
  x: number;
  y: number;
};

const Menu: FC<{ position: MenuPosition }> = ({ position }) => {
  const dispatch = useDispatch();
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      position={"absolute"}
      backgroundColor="#fff"
      top={position.y}
      left={position.x}
      px={3}
      py={3}
      cursor={"default"}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        dispatch(deleteTasks());
      }}
    >
      Delete
    </Box>
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
