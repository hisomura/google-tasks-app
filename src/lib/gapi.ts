const CLIENT_ID = "471921200035-m1q24a39lsd0uihb4t6i89di3an22u0k.apps.googleusercontent.com";
const API_KEY = "AIzaSyDh6FqTnqKgzckbXVYsj1j3yEDQL6S_J6I";

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/tasks.readonly";

async function initClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
  });
  console.log("client initialized.");
}
