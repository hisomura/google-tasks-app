import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TestComponent from "./TestComponent";

describe("TestComponent", () => {
  it("shows 'Hello, world!'", () => {
    render(<TestComponent />);
    expect(screen.getByText(/Hello, World!/)).toBeInTheDocument();
  });
});
