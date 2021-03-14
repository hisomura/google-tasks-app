import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import App from "./App";
import { queryClient } from "./globals";
import "./index.css";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";
import store from "./store/store";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <GapiAuthProvider>
            <App />
          </GapiAuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById("root")
);
