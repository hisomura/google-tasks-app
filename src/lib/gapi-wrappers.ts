import GapiTask = gapi.client.tasks.Task;
import GapiTaskList = gapi.client.tasks.TaskList;
import { v4 as uuidV4 } from "uuid";
import { getNextParentAndPrevious } from "./tasks";

interface Task extends GapiTask {
  tasklistId: string;
  id: string;
  isLastChild?: boolean;
}

interface Tasklist extends GapiTaskList {
  id: string;
}

const CLIENT_ID = "471921200035-m1q24a39lsd0uihb4t6i89di3an22u0k.apps.googleusercontent.com";
const API_KEY = "AIzaSyDh6FqTnqKgzckbXVYsj1j3yEDQL6S_J6I";

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/tasks";

export async function initGapiClient() {
  // https://stackoverflow.com/a/58822126/10109900
  await new Promise((resolve) => {
    gapi.load("client:auth2", resolve);
  });
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });
  console.log("client initialized.");
}

export function listenIsSignedIn(listener: (signedIn: boolean) => any) {
  return gapi.auth2.getAuthInstance().isSignedIn.listen(listener);
}

export function isSignedIn() {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
}

export function signIn() {
  return gapi.auth2.getAuthInstance().signIn();
}

export function signOut() {
  return gapi.auth2.getAuthInstance().signOut();
}

export async function deleteTasks(tasks: Task[]) {
  if (tasks.length === 0) {
    throw new Error("Tasks have no item.");
  }
  const batch = gapi.client.newBatch();
  tasks.forEach((task) => {
    const request = { tasklist: task.tasklistId, task: task.id };
    batch.add(gapi.client.tasks.tasks.delete(request));
  });

  return batch.then();
}

export async function moveTasks(tasks: Task[], toTasklistId: string, targetTask?: Task, onLeft?: boolean) {
  const sorted = targetTask ? tasks : [...tasks].reverse();
  const tasksInAnotherTasklist = sorted.filter((task) => task.tasklistId !== toTasklistId);
  let newTaskIds: string[] = [];

  if (tasksInAnotherTasklist.length > 0) newTaskIds = await recreateTasks(tasksInAnotherTasklist, toTasklistId);

  // FIXME stay tasks order
  const moveTaskIds: string[] = sorted
    .filter((task) => task.tasklistId === toTasklistId)
    .map((task) => task.id!)
    .concat(newTaskIds);

  if (moveTaskIds.length === 0) return;

  const batch = gapi.client.newBatch();
  moveTaskIds.forEach((taskId) => {
    const { parent, previous } = getNextParentAndPrevious(targetTask, onLeft);
    const request = { tasklist: toTasklistId, task: taskId, previous, parent };
    batch.add(gapi.client.tasks.tasks.move(request));
  });

  return batch.then();
}

async function recreateTasks(tasks: Task[], toTasklistId: string) {
  const batch = gapi.client.newBatch();
  const insertBatchIds: string[] = [];
  tasks.forEach((task) => {
    if (task.tasklistId === toTasklistId) return;

    const batchId = uuidV4();
    batch.add(gapi.client.tasks.tasks.delete({ tasklist: task.tasklistId, task: task.id! }));
    batch.add(gapi.client.tasks.tasks.insert({ tasklist: toTasklistId, resource: task }), {
      id: batchId,
      callback() {},
    });
    insertBatchIds.push(batchId);
  });
  const batchResponse = await batch.then();

  return insertBatchIds.map((id) => batchResponse.result[id].result.id) as string[];
}

export async function createTask(title: string, toTasklistId: string) {
  return gapi.client.tasks.tasks.insert({ tasklist: toTasklistId, resource: { title } });
}

export async function completeTask({ task }: { task: Task }) {
  await gapi.client.tasks.tasks.patch({
    tasklist: task.tasklistId,
    task: task.id,
    resource: { status: "completed" },
  });
  return gapi.client.tasks.tasks.clear({
    tasklist: task.tasklistId,
  });
}

export async function getTasks(tasklistId: string): Promise<Task[]> {
  const res = await gapi.client.tasks.tasks.list({ maxResults: 100, tasklist: tasklistId });
  if (!res.result.items) return [];

  // @ts-ignore
  return res.result.items.map((item) => ({ ...item, tasklistId: tasklistId }));
}

export async function getTasklists(): Promise<Tasklist[]> {
  const res = await gapi.client.tasks.tasklists.list({ maxResults: 100 });

  // @ts-ignore
  return res.result.items;
}

function normalizeList<T extends { id: string }>(list: T[]) {
  const allIds = list.map((item) => item.id);
  const byId = new Map(list.map((item) => [item.id, item]));

  return {
    allIds,
    byId,
  };
}

export type { Task, Tasklist };
