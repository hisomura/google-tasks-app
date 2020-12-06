import { render, screen } from "./test-utils";
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

    // @ts-ignore Too hard to prepare gapi object
    global.gapi = {};
  }

  beforeEach(initMockToDefault);

  it("shows 'waiting...' before gapi is loaded", () => {
    // @ts-ignore
    global.gapi = undefined;
    const script = document.createElement("script");
    script.id = "gapi-el";
    document.body.appendChild(script);

    render(
      <GapiAuthProvider>
        <App />
      </GapiAuthProvider>
    );
    expect(screen.getByText(/waiting.../)).toBeInTheDocument();
  });

  it("shows 'Sign in' button after gapi is loaded", async () => {
    render(
      <GapiAuthProvider>
        <App />
      </GapiAuthProvider>
    );
    expect(await screen.findByRole("button")).toHaveTextContent("Sign in");
  });

  it("shows 'Sign out' button when use is signed in", async () => {
    mockGapi.isSignedIn.mockImplementation(() => true);
    render(
      <GapiAuthProvider>
        <App />
      </GapiAuthProvider>
    );
    expect(await screen.findByRole("button")).toHaveTextContent("Sign out");
  });
});
