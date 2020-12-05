import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";
import * as gapi from "./lib/gapi";

jest.mock("./lib/gapi");

describe("App", () => {
  it("shows 'waiting...' before load gapi", () => {
    // @ts-ignore
    // gapi.__setSignInReturnValue("hoge");
    // signIn.
    // foobar.mockImplementation(() => 'hoge');
    // const mockFn = jest.fn().mockImplementation(scalar => 42 + scalar);

    gapi.signIn.mockImplementation(() => "hoge");
    // @ts-ignore
    gapi.listenIsSignedIn.mockImplementation(() => {});
    // @ts-ignore
    gapi.isSignedIn.mockImplementation(() => false);

    render(<App />);
    expect(screen.getByText(/waiting.../)).toBeInTheDocument();
  });
});
