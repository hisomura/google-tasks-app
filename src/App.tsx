import { MouseEventHandler } from "react";
import { useGapiAuth } from "./lib/GapiAuthProvider";
import Board from "./components/Board";
import RectangleSelection from "./components/RectangleSelection";

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
      <Board />
    </RectangleSelection>
  );
}
