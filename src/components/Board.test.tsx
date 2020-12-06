import { render, screen } from "../test-utils";
import Board from "./Board";
import userEvent from "@testing-library/user-event";
import * as gapi from "../lib/gapi-wrappers";

jest.mock("../lib/gapi-wrappers");
const mockGapi = gapi as jest.Mocked<typeof gapi>;

describe("Board", () => {
  function initMockToDefault() {
    mockGapi.getTasklists.mockImplementation(async () => [{ id: "tasklist-id-1", title: "High Priority" }]);
  }

  beforeEach(initMockToDefault);

  it("call signOut() when 'Sign out' button is clicked", async () => {
    render(<Board />);
    expect(await screen.findByRole("button")).toHaveTextContent("Sign out");
    userEvent.click(screen.getByRole("button"));
    expect(mockGapi.signOut).toBeCalledTimes(1);
  });

  it("shows 'High Priority', tasklist name", async () => {
    render(<Board />);
    // findByText() is needed instead of getByText().
    expect(await screen.findByText("High Priority")).toBeInTheDocument();
  });
});
