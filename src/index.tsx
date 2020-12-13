import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";

import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";

const queryCache = new QueryCache();
ReactDOM.render(
  <>
    <Provider store={store}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <GapiAuthProvider>
          <App />
        </GapiAuthProvider>
      </ReactQueryCacheProvider>
      <ReactQueryDevtools initialIsOpen />
    </Provider>
  </>,
  document.getElementById("root")
);
