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
  }

  &:hover svg {
    transform: scale(1.3);
  }
`;

type Props = {
  completed: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

const CompleteButton: FC<Props> = (props) => {
  return (
    <Div onClick={props.onClick} onMouseUp={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
      {props.completed ? <MdDone /> : <MdPanoramaFishEye />}
    </Div>
  );
};
export default CompleteButton;
