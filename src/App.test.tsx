import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import * as gapi from "./lib/gapi";

jest.mock("./lib/gapi");
const mockGapi = gapi as jest.Mocked<typeof gapi>;

describe("App", () => {
  // @ts-ignore Too hard to prepare GoogleUser object.
  mockGapi.signIn.mockImplementation(async () => {});
  mockGapi.listenIsSignedIn.mockImplementation(() => {});
  mockGapi.isSignedIn.mockImplementation(() => false);

  it("shows 'waiting...' before load gapi", () => {
    render(<App />);
    expect(screen.getByText(/waiting.../)).toBeInTheDocument();
  });
});
