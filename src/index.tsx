import ReactDOM from "react-dom";
import { StrictMode } from "react";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query-devtools";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";
import { queryClient } from "./globals";

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GapiAuthProvider>
          <App />
        </GapiAuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);
