import { MouseEventHandler } from "react";
import Board from "./components/Board";
import ContextMenuWrapper from "./components/ContextMenuWrapper";
import RectangleSelection from "./components/RectangleSelection";
import { useGapiAuth } from "./lib/GapiAuthProvider";

const signInClickHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
  gapi.auth2.getAuthInstance().signIn();
};

export default function App() {
  const { gapiReady, signedIn } = useGapiAuth();

  if (!gapiReady) return <div>waiting...</div>;

  if (!signedIn) {
    return (
      <div>
        <button type="button" onClick={signInClickHandler}>
          Sign in.
        </button>
      </div>
    );
  }

  return (
    <RectangleSelection>
      <ContextMenuWrapper>
        <Board />
      </ContextMenuWrapper>
    </RectangleSelection>
  );
}
