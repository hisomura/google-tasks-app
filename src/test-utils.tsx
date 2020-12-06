import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { render, RenderOptions } from "@testing-library/react";
import { FC, ReactElement } from "react";

const AllTheProviders: FC = ({ children }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: RenderOptions) => {
  render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
