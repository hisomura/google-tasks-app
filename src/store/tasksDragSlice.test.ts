import tasksDragSlice, { dragStart } from "./tasksDragSlice";

describe("tasksDragSlice", () => {
  test("dragStart", () => {
    const nextState = tasksDragSlice.reducer(
      {
        dragState: "yet-started",
        toTaskListId: null,
        targetTaskId: undefined
      },
      {
        type: dragStart.type,
        payload: { offset: { x: 100, y: 100 } },
      }
    );
    expect(nextState.dragState).toBe("dragging");
  });
});
