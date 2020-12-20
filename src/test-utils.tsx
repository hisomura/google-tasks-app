import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { FC, ReactElement } from "react";
import { Provider } from "react-redux";
import { rootReducer } from "./store/store";
import { createStore, Store } from "redux";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./globals";

interface Options extends RenderOptions {
  initialState?: {};
  store?: Store;
}

const customRender = (ui: ReactElement, options: Options = {}) => {
  const { initialState, store, ...renderOptions } = options;
  const testStore = store ?? createStore(rootReducer, initialState);
  const Wrapper: FC = (props) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={testStore}>{props.children}</Provider>
      </QueryClientProvider>
    );
  };

  rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
