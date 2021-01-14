import GapiTask = gapi.client.tasks.Task;
import GapiTaskList = gapi.client.tasks.TaskList;

interface Task extends GapiTask {
  taskListId: string;
}

interface TaskList extends GapiTaskList {}

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

export async function moveTasksToAnotherTasklist(tasks: Task[], toTaskListId: string) {
  console.log(tasks, toTaskListId);
  const promises: Promise<any>[] = [];
  tasks.forEach((task) => {
    promises.push(gapi.client.tasks.tasks.delete({ tasklist: task.taskListId, task: task.id! }));
    promises.push(gapi.client.tasks.tasks.insert({ tasklist: toTaskListId, resource: task }));
  });
  await Promise.all(promises);
}

export async function completeTask({ task }: { task: Task }) {
  await gapi.client.tasks.tasks.patch({
    tasklist: task.taskListId,
    task: task.id!,
    resource: { status: "completed" },
  });
  return gapi.client.tasks.tasks.clear({
    tasklist: task.taskListId,
  });
}

export async function getTasks(taskListId: string): Promise<Task[]> {
  const res = await gapi.client.tasks.tasks.list({ maxResults: 100, tasklist: taskListId });
  if (!res.result.items) return [];
  return res.result.items.map((item) => ({ ...item, taskListId }));
}

export async function getTasklists() {
  const res = await gapi.client.tasks.tasklists.list({ maxResults: 100 });
  return res.result.items;
}

export { Task, TaskList };
