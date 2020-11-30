import React, { MouseEventHandler, useEffect, useState } from "react";
import "./App.css";
import { useGapiAuth } from "./lib/GapiAuthProvider";
import TaskList = gapi.client.tasks.TaskList;

const signInClickHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
  gapi.auth2.getAuthInstance().signIn();
};

const signOutClickHandler: MouseEventHandler<HTMLButtonElement> = (_event) => {
  gapi.auth2.getAuthInstance().signOut();
};

export default function App() {
  const { gapiReady, signedIn } = useGapiAuth();
  const [taskLists, setLists] = useState<TaskList[]>([]);

  useEffect(() => {
    if (!signedIn) return;

    gapi.client.tasks.tasklists
      .list({
        maxResults: 10,
      })
      .then(function (response) {
        if (!response.result.items) return;
        setLists(response.result.items);
      });
  }, [signedIn]);

  if (!gapiReady) return <div>waiting...</div>;

  if (!signedIn) {
    return (
      <div>
        <button type="button" onClick={signInClickHandler}>
          Sign in.
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-red-100">hello</div>
      <button type="button" onClick={signOutClickHandler}>
        Sign out.
      </button>
      <div>
        {taskLists.map((t) => (
          <p key={t.id}>{t.title}</p>
        ))}
      </div>
    </div>
  );
}
