import tasksDragSlice, { dragStart } from "./tasksDragSlice";

describe("tasksDragSlice", () => {
  test("dragStart", () => {
    const nextState = tasksDragSlice.reducer(
      {
        dragState: "yet-started",
        initialClientOffset: null,
        currentClientOffset: null,
      },
      {
        type: dragStart.type,
        payload: { offset: { x: 100, y: 100 } },
      }
    );
    expect(nextState.dragState).toBe("dragging");
    expect(nextState.initialClientOffset).toEqual({ x: 100, y: 100 });
    expect(nextState.currentClientOffset).toEqual({ x: 100, y: 100 });
  });
});
