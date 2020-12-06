import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import * as gapi from "./lib/gapi-wrappers";
import { GapiAuthProvider } from "./lib/GapiAuthProvider";

jest.mock("./lib/gapi-wrappers");
const mockGapi = gapi as jest.Mocked<typeof gapi>;

describe("App", () => {
  function initMockToDefault() {
    // @ts-ignore Too hard to prepare GoogleUser object.
    mockGapi.signIn.mockImplementation(async () => {});
    mockGapi.initGapiClient.mockImplementation(() => Promise.resolve());
    mockGapi.listenIsSignedIn.mockImplementation(() => {});
    mockGapi.isSignedIn.mockImplementation(() => false);
  }

  beforeEach(initMockToDefault);

  it("shows 'waiting...' before gapi is loaded", () => {
    render(<App />);
    expect(screen.getByText(/waiting.../)).toBeInTheDocument();
  });

  it("shows 'Sign In' button after gapi is loaded", async () => {
    // @ts-ignore Too hard to prepare gapi object
    global.gapi = {};
    render(
      <GapiAuthProvider>
        <App />
      </GapiAuthProvider>
    );
    expect(await screen.findByRole("button")).toHaveTextContent("Sign in");
  });
});
