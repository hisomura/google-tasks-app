import Task = gapi.client.tasks.Task;
import TaskList = gapi.client.tasks.TaskList

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

export async function updateTaskCompleted({ tasklistId, task }: { tasklistId: string; task: Task }) {
  await gapi.client.tasks.tasks.update({
    tasklist: tasklistId,
    task: task.id!,
    resource: { ...task, status: "completed" },
  });
  return gapi.client.tasks.tasks.clear({
    tasklist: tasklistId,
  });
}

export async function getTasks(taskListId: string) {
  const res = await gapi.client.tasks.tasks.list({ maxResults: 100, tasklist: taskListId });
  return res.result.items ?? [];
}

export async function getTasklists() {
  const res = await gapi.client.tasks.tasklists.list({ maxResults: 100 });
  return res.result.items;
}

export { Task, TaskList }
