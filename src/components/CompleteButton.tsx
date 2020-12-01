import { MdDone, MdPanoramaFishEye } from "react-icons/all";
import { FC } from "react";
import styled from "styled-components";

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

const CompleteButton: FC<{ completeTask: () => void }> = (props) => {
  return (
    <Div>
      <MdPanoramaFishEye />
      <MdDone />
    </Div>
  );
};
export default CompleteButton;
