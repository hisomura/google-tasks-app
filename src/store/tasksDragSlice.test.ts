import tasksDragSlice, { dragStart } from "./tasksDragSlice";

describe("tasksDragSlice", () => {
  test("dragStart", () => {
    const nextState = tasksDragSlice.reducer(
      {
        dragState: "yet-started",
        initialClientOffset: null,
        currentClientOffset: null,
        taskIds: [],
      },
      {
        type: dragStart.type,
        payload: {
          offset: { x: 100, y: 100 },
          fromTasklistId: "from-task-list-id",
          taskIds: ['task 1', 'task 2'],
        },
      }
    );
    expect(nextState.dragState).toBe("dragging");
    expect(nextState.initialClientOffset).toEqual({ x: 100, y: 100 });
    expect(nextState.currentClientOffset).toEqual({ x: 100, y: 100 });
    expect(nextState.taskIds).toEqual(['task 1', 'task 2']);
  });
});
