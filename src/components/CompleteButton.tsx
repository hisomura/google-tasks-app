import { MdDone, MdPanoramaFishEye } from "react-icons/md";
import { FC, MouseEventHandler } from "react";
import styled from "@emotion/styled";

const Div = styled.div`
  position: relative;
  width: 1em;
  height: 1em;

  & svg {
    position: absolute;
    top: 0;
    left: 0;

    &:nth-child(1) {
      visibility: visible;
    }

    &:nth-child(2) {
      visibility: hidden;
    }
  }

  &:hover svg {
    &:nth-child(1) {
      visibility: hidden;
    }

    &:nth-child(2) {
      visibility: visible;
    }
  }
`;

const CompleteButton: FC<{ onClick: MouseEventHandler<HTMLDivElement> }> = (props) => {
  return (
    <Div onClick={props.onClick} onMouseUp={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
      <MdPanoramaFishEye />
      <MdDone />
    </Div>
  );
};
export default CompleteButton;
