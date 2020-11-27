import React, { useEffect, useState } from "react";
import "./App.css";


function initGapiClient() {
  gapi.load('client:auth2', initClient);
}

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (gapi !== undefined) {
      initGapiClient();
      setIsInitialized(true);
    } else {
      // not tested.
      const gapiScriptElement = document.getElementById("gapi")!;
      gapiScriptElement.onload = () => {
        initGapiClient();
        setIsInitialized(true);
      }
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
