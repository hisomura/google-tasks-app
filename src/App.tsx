import React, { useEffect, useState } from "react";
import "./App.css";
import { initGapiClient } from "./lib/gapi";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = () => initGapiClient().then(() => setIsInitialized(true));
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

  return (
    <div>
      <div className="text-red-100">hello</div>
      <p>Allow this application to get your Google Tasks data.</p>
    </div>
  );
}
