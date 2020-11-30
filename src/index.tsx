import ReactDOM from "react-dom";
import App from "./App";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";

const queryCache = new QueryCache();
ReactDOM.render(
  <>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <GapiAuthProvider>
        <App />
      </GapiAuthProvider>
    </ReactQueryCacheProvider>
    <ReactQueryDevtools initialIsOpen />
  </>,
  document.getElementById("root")
);
