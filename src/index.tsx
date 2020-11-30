import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";

ReactDOM.render(
  <GapiAuthProvider>
    <App />
  </GapiAuthProvider>,
  document.getElementById("root")
);
