import React, { FC, useEffect, useState } from "react";
import { initGapiClient } from "./gapi";

const GapiAuthContext = React.createContext({ gapiReady: false, signedIn: false });

const GapiAuthProvider: FC = (props) => {
  const [gapiReady, setGapiReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const init = () =>
      initGapiClient().then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(setSignedIn);
        setGapiReady(true);
        setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    if (gapi !== undefined) {
      init();
    } else {
      // not tested.
      const gapiScriptElement = document.getElementById("gapi-el")!;
      gapiScriptElement.onload = init;
    }
  }, []);

  return <GapiAuthContext.Provider value={{ gapiReady, signedIn }}>{props.children}</GapiAuthContext.Provider>;
};

function useGapiAuth() {
  return React.useContext(GapiAuthContext);
}

export { GapiAuthProvider, useGapiAuth };
