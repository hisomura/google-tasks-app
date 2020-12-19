import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store";

import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query-devtools";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";

export const queryClient = new QueryClient();
ReactDOM.render(
  <>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GapiAuthProvider>
          <App />
        </GapiAuthProvider>
      </QueryClientProvider>
    </Provider>
  </>,
  document.getElementById("root")
);
