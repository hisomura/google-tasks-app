import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTasks, selectedTaskExists } from "../store/selectedTaskIdsSlice";
import { Box, Menu, MenuItem } from "@chakra-ui/react";
import { AppDispatch } from "../store/store";

const parentStyle: React.CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100vh",
};

type MenuPosition = {
  x: number;
  y: number;
};

const ContextMenu: FC<{ position: MenuPosition }> = ({ position }) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Box position={"absolute"} top={position.y} left={position.x} cursor={"default"}>
      <Menu isOpen={true}>
        <MenuItem
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteTasks());
          }}
        >
          Delete
        </MenuItem>
        <MenuItem>Edit</MenuItem>
      </Menu>
    </Box>
  );
};

const ContextMenuWrapper: FC = ({ children }) => {
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
      {position ? <ContextMenu position={position} /> : null}
      {children}
    </div>
  );
};

export default ContextMenuWrapper;
