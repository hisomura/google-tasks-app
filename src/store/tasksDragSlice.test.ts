import tasksDragSlice, { dragStart } from "./tasksDragSlice";

describe("tasksDragSlice", () => {
  test("dragStart", () => {
    const nextState = tasksDragSlice.reducer(
      {
        dragState: "yet-started",
        initialClientOffset: null,
        currentClientOffset: null,
        tasks: [],
      },
      {
        type: dragStart.type,
        payload: {
          offset: { x: 100, y: 100 },
          fromTasklistId: "from-task-list-id",
          task: { title: "task 1", taskListId: "list 1" },
        },
      }
    );
    expect(nextState.dragState).toBe("dragging");
    expect(nextState.initialClientOffset).toEqual({ x: 100, y: 100 });
    expect(nextState.currentClientOffset).toEqual({ x: 100, y: 100 });
    expect(nextState.tasks).toEqual([{ title: "task 1", taskListId: "list 1" }]);
  });
});
