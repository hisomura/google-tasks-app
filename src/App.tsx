import React, { MouseEventHandler, useEffect, useState } from "react";
import "./App.css";
import { initGapiClient } from "./lib/gapi";

const signInClickHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
  gapi.auth2.getAuthInstance().signIn();
};

const signOutClickHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
  gapi.auth2.getAuthInstance().signOut();
};

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const init = () =>
      initGapiClient().then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(setSignedIn);
        setIsInitialized(true);
        setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    if (gapi !== undefined) {
      init();
    } else {
      // not tested.
      const gapiScriptElement = document.getElementById("gapi")!;
      gapiScriptElement.onload = init;
    }
  }, []);

  if (!isInitialized) {
    return <div>waiting...</div>;
  }

  if (!isSignedIn) {
    return (
      <div>
        <button type="button" onClick={signInClickHandler}>
          Sign in.
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-red-100">hello</div>
      <button type="button" onClick={signOutClickHandler}>
        Sign out.
      </button>
    </div>
  );
}
